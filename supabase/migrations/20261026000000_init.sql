-- ALMA AI schema. Every user-owned table is protected by row level security
-- so a signed-in user can only ever read and write their own rows.

create extension if not exists pgcrypto;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- Profiles -----------------------------------------------------------------
create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  display_name text,
  phone text unique,
  timezone text,
  preferences jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (user_id, display_name, phone)
  values (
    new.id,
    nullif(new.raw_user_meta_data ->> 'display_name', ''),
    coalesce(nullif(new.raw_user_meta_data ->> 'phone', ''), new.phone)
  )
  on conflict (user_id) do nothing;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- Conversations and chat ---------------------------------------------------
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null default 'New Conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index conversations_user_updated on public.conversations (user_id, updated_at desc);
create trigger conversations_touch before update on public.conversations
  for each row execute function public.touch_updated_at();

create table public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null default '',
  metadata jsonb,
  created_at timestamptz not null default now()
);
create index chat_messages_conversation on public.chat_messages (conversation_id, created_at);

-- Memories -----------------------------------------------------------------
create table public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text,
  summary text,
  content text not null default '',
  type text not null default 'text',
  tags text[] not null default '{}',
  metadata jsonb,
  timestamp timestamptz not null default now(),
  event_date date,
  event_date_is_estimated boolean not null default false,
  entry_type text not null default 'memory',
  is_core boolean not null default false,
  processing_state text not null default 'complete',
  source text not null default 'web',
  deleted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index memories_user_timestamp on public.memories (user_id, timestamp desc);
create index memories_search on public.memories using gin (to_tsvector('simple', coalesce(title, '') || ' ' || content));
create trigger memories_touch before update on public.memories
  for each row execute function public.touch_updated_at();

create table public.memory_media (
  id uuid primary key default gen_random_uuid(),
  memory_id uuid not null references public.memories(id) on delete cascade,
  file_url text,
  file_type text,
  file_size bigint,
  transcription text,
  duration_seconds numeric,
  storage_path text,
  created_at timestamptz not null default now()
);
create index memory_media_memory on public.memory_media (memory_id);

-- Reminders and calendar ---------------------------------------------------
create table public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_name text,
  event_description text,
  event_date date,
  reminder_time timestamptz,
  reminder_sent boolean not null default false,
  google_event_id text,
  tags text[] not null default '{}',
  created_at timestamptz not null default now()
);
create index reminders_user_time on public.reminders (user_id, reminder_time);

create table public.google_calendar_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  access_token text not null,
  refresh_token text,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Gallery, vaults, lists ---------------------------------------------------
create table public.gallery_images (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  file_url text,
  file_name text,
  storage_path text,
  width integer,
  height integer,
  x numeric,
  created_at timestamptz not null default now()
);

create table public.vaults (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  cover_url text,
  created_at timestamptz not null default now()
);
create unique index vaults_user_name on public.vaults (user_id, lower(name));

create table public.vault_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vault_id uuid not null references public.vaults(id) on delete cascade,
  memory_id uuid not null references public.memories(id) on delete cascade,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.user_lists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  list_name text not null,
  created_at timestamptz not null default now()
);

create table public.list_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  list_id uuid not null references public.user_lists(id) on delete cascade,
  title text not null default '',
  is_completed boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.photo_favourites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  item_key text not null,
  memory_id uuid references public.memories(id) on delete cascade,
  gallery_image_id uuid references public.gallery_images(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, item_key)
);

-- What Alma knows ----------------------------------------------------------
create table public.context_entities (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  aliases text[] not null default '{}',
  kind text not null default 'person',
  canonical_key text,
  summary text,
  salience numeric not null default 0,
  mention_count integer not null default 0,
  merged_into uuid references public.context_entities(id) on delete set null,
  status text not null default 'active',
  first_seen timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create table public.context_mentions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  memory_id uuid not null references public.memories(id) on delete cascade,
  entity_id uuid not null references public.context_entities(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table public.context_facts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_entity_id uuid not null references public.context_entities(id) on delete cascade,
  predicate text not null,
  object_text text,
  object_entity_id uuid references public.context_entities(id) on delete set null,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

create table public.context_surfaced (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject_key text not null,
  created_at timestamptz not null default now()
);

-- WhatsApp one-time codes (service role only) ------------------------------
create table public.otp_codes (
  phone text primary key,
  code_hash text not null,
  attempts integer not null default 0,
  expires_at timestamptz not null
);
alter table public.otp_codes enable row level security;

-- Row level security -------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'profiles', 'conversations', 'chat_messages', 'memories', 'reminders', 'google_calendar_tokens',
    'gallery_images', 'vaults', 'vault_items', 'user_lists', 'list_items', 'photo_favourites',
    'context_entities', 'context_mentions', 'context_facts', 'context_surfaced'
  ] loop
    execute format('alter table public.%I enable row level security', t);
    execute format(
      'create policy "own rows" on public.%I for all using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);
  end loop;
end $$;

alter table public.memory_media enable row level security;
create policy "own media" on public.memory_media for all
  using (exists (select 1 from public.memories m where m.id = memory_id and m.user_id = auth.uid()))
  with check (exists (select 1 from public.memories m where m.id = memory_id and m.user_id = auth.uid()));

-- Storage ------------------------------------------------------------------
insert into storage.buckets (id, name, public) values
  ('memories', 'memories', true),
  ('gallery-images', 'gallery-images', true),
  ('memory-media', 'memory-media', false)
on conflict (id) do nothing;

create policy "users manage own files" on storage.objects for all
  using (bucket_id in ('memories', 'gallery-images', 'memory-media') and (storage.foldername(name))[1] = auth.uid()::text)
  with check (bucket_id in ('memories', 'gallery-images', 'memory-media') and (storage.foldername(name))[1] = auth.uid()::text);
