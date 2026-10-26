// Demo auth: phone OTP, email/password and a simulated Google sign-in,
// with sessions kept in localStorage like supabase-js does.

import { getMeta, setMeta, table, commit, uuid } from "./store";

const SESSION_KEY = "alma-demo:session";
const listeners = new Set();

function readSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  } catch {
    return null;
  }
}

function writeSession(session) {
  try {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
  } catch {}
}

function users() {
  return getMeta("users") ?? [];
}

function saveUsers(list) {
  setMeta("users", list);
}

function publicUser(user) {
  if (!user) return null;
  const { password, ...rest } = user;
  return rest;
}

function makeSession(user) {
  return {
    access_token: `demo-${uuid()}`,
    refresh_token: `demo-${uuid()}`,
    token_type: "bearer",
    expires_in: 60 * 60 * 24 * 365,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 365,
    user: publicUser(user),
  };
}

function emit(event, session) {
  for (const fn of listeners) {
    try {
      fn(event, session);
    } catch (error) {
      console.error(error);
    }
  }
}

export function currentUserId() {
  return readSession()?.user?.id ?? null;
}

export function findOrCreateUser({
  email = null,
  phone = null,
  displayName = null,
  provider = "email",
  password,
  profilePhone = null,
}) {
  const list = users();
  let user = list.find((u) => (email && u.email === email) || (phone && u.phone === phone));
  if (!user) {
    user = {
      id: uuid(),
      aud: "authenticated",
      role: "authenticated",
      email,
      phone,
      password,
      app_metadata: { provider, providers: [provider] },
      user_metadata: { display_name: displayName ?? undefined },
      created_at: new Date().toISOString(),
    };
    list.push(user);
    saveUsers(list);
    // handle_new_user trigger: every account gets a profile row
    table("profiles").push({
      id: uuid(),
      user_id: user.id,
      display_name: displayName,
      phone: phone ?? profilePhone,
      timezone: null,
      preferences: {},
      created_at: user.created_at,
      updated_at: user.created_at,
    });
    commit();
    return { user, created: true };
  }
  return { user, created: false };
}

const pendingTokens = new Map();

export function issueOtpToken(phone) {
  const { user, created } = findOrCreateUser({ phone, provider: "phone" });
  const token = `demo-otp-${uuid()}`;
  pendingTokens.set(token, { userId: user.id, created });
  return token;
}

function signIn(user, event = "SIGNED_IN") {
  const session = makeSession(user);
  writeSession(session);
  emit(event, session);
  return session;
}

export function createAuth(onSignedIn) {
  const authError = (message, status = 400) => ({ name: "AuthApiError", message, status });

  return {
    async getSession() {
      return { data: { session: readSession() }, error: null };
    },
    async getUser() {
      const session = readSession();
      if (!session) return { data: { user: null }, error: authError("Auth session missing!", 401) };
      const user = users().find((u) => u.id === session.user.id);
      return { data: { user: publicUser(user) ?? session.user }, error: null };
    },
    onAuthStateChange(callback) {
      listeners.add(callback);
      queueMicrotask(() => callback("INITIAL_SESSION", readSession()));
      return { data: { subscription: { unsubscribe: () => listeners.delete(callback) } } };
    },
    async signUp({ email, password, options = {} }) {
      if (!email || !password)
        return { data: { user: null, session: null }, error: authError("Missing email or password") };
      if (users().some((u) => u.email === email)) {
        return { data: { user: null, session: null }, error: authError("User already registered", 422) };
      }
      const { user } = findOrCreateUser({
        email,
        password,
        displayName: options.data?.display_name ?? null,
        profilePhone: options.data?.phone ?? null,
      });
      const session = signIn(user);
      onSignedIn?.(user, true);
      return { data: { user: publicUser(user), session }, error: null };
    },
    async signInWithPassword({ email, password }) {
      const user = users().find((u) => u.email === email);
      if (!user || user.password !== password) {
        return { data: { user: null, session: null }, error: authError("Invalid login credentials") };
      }
      const session = signIn(user);
      onSignedIn?.(user, false);
      return { data: { user: publicUser(user), session }, error: null };
    },
    async verifyOtp({ token_hash }) {
      const pending = pendingTokens.get(token_hash);
      if (!pending)
        return { data: { user: null, session: null }, error: authError("Token has expired or is invalid", 403) };
      pendingTokens.delete(token_hash);
      const user = users().find((u) => u.id === pending.userId);
      const session = signIn(user);
      onSignedIn?.(user, pending.created);
      return { data: { user: publicUser(user), session }, error: null };
    },
    async signInWithOAuth({ provider, options = {} }) {
      // No real Google round trip in demo mode: sign in as a demo Google user.
      const { user, created } = findOrCreateUser({
        email: `demo.${provider}@meetalma.ai`,
        displayName: "Alex Morgan",
        provider,
      });
      signIn(user);
      onSignedIn?.(user, created);
      const target = options.redirectTo || `${window.location.origin}/today`;
      window.setTimeout(() => window.location.assign(target), 50);
      return { data: { provider, url: target }, error: null };
    },
    async signOut() {
      writeSession(null);
      emit("SIGNED_OUT", null);
      return { error: null };
    },
    async updateUser(attributes) {
      const session = readSession();
      if (!session) return { data: { user: null }, error: authError("Auth session missing!", 401) };
      const list = users();
      const user = list.find((u) => u.id === session.user.id);
      if (attributes.data) user.user_metadata = { ...user.user_metadata, ...attributes.data };
      if (attributes.email) user.email = attributes.email;
      if (attributes.password) user.password = attributes.password;
      saveUsers(list);
      const next = { ...session, user: publicUser(user) };
      writeSession(next);
      emit("USER_UPDATED", next);
      return { data: { user: publicUser(user) }, error: null };
    },
    async refreshSession() {
      return { data: { session: readSession(), user: readSession()?.user ?? null }, error: null };
    },
  };
}

export function deleteUser(userId) {
  saveUsers(users().filter((u) => u.id !== userId));
}
