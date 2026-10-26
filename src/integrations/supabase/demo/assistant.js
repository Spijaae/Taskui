// Offline stand-in for ALMA's `chat` edge function. It keeps the same
// contract (SSE stream of OpenAI-style deltas plus title updates) and
// answers from the user's own memories with simple keyword recall.

import { commit, table, uuid } from "./store";

const STOP_WORDS = new Set(
  "a an and are at be but by did do does for from had has have how i i'm in is it its me my of on or our so that the their them then there they this to us was we were what when where which who why will with you your about remember remind tell show find any".split(
    " ",
  ),
);

const WEEKDAYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];

function keywords(text) {
  return (text.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter((w) => w.length > 2 && !STOP_WORDS.has(w));
}

function formatWhen(date) {
  return date.toLocaleString(undefined, {
    weekday: "long",
    day: "numeric",
    month: "long",
    hour: "numeric",
    minute: "2-digit",
  });
}

function parseClock(text) {
  const match = text.match(/\b(?:at\s+)?(\d{1,2})(?::(\d{2}))?\s*(am|pm)\b|\bat\s+(\d{1,2})(?::(\d{2}))?\b/i);
  if (!match) return null;
  let hours = Number(match[1] ?? match[4]);
  const minutes = Number(match[2] ?? match[5] ?? 0);
  const meridiem = match[3]?.toLowerCase();
  if (meridiem === "pm" && hours < 12) hours += 12;
  if (meridiem === "am" && hours === 12) hours = 0;
  if (!meridiem && hours < 7) hours += 12;
  return { hours, minutes, text: match[0] };
}

// Understands "tomorrow at 5pm", "on friday", "in 2 hours", "tonight", "next week".
export function parseWhen(text, now = new Date()) {
  const lower = text.toLowerCase();
  const when = new Date(now);
  let matched = [];
  const inMatch = lower.match(/\bin\s+(\d+|an?|one|two|three)\s+(minute|hour|day|week)s?\b/);
  if (inMatch) {
    const n = { a: 1, an: 1, one: 1, two: 2, three: 3 }[inMatch[1]] ?? Number(inMatch[1]);
    const unit = { minute: 60e3, hour: 3600e3, day: 86400e3, week: 7 * 86400e3 }[inMatch[2]];
    return { date: new Date(now.getTime() + n * unit), phrase: inMatch[0] };
  }
  let dayChosen = false;
  if (/\btomorrow\b/.test(lower)) {
    when.setDate(when.getDate() + 1);
    matched.push("tomorrow");
    dayChosen = true;
  } else if (/\bnext week\b/.test(lower)) {
    when.setDate(when.getDate() + 7);
    matched.push("next week");
    dayChosen = true;
  } else {
    const day = WEEKDAYS.findIndex((d) => new RegExp(`\\b(on\\s+|next\\s+)?${d}\\b`).test(lower));
    if (day >= 0) {
      const diff = (day - when.getDay() + 7) % 7 || 7;
      when.setDate(when.getDate() + diff);
      const m = lower.match(new RegExp(`\\b(on\\s+|next\\s+)?${WEEKDAYS[day]}\\b`));
      matched.push(m[0]);
      dayChosen = true;
    }
  }
  if (/\btonight\b/.test(lower)) {
    when.setHours(20, 0, 0, 0);
    matched.push("tonight");
  }
  const clock = parseClock(text);
  if (clock) {
    when.setHours(clock.hours, clock.minutes, 0, 0);
    matched.push(clock.text);
    if (!dayChosen && when <= now) when.setDate(when.getDate() + 1);
  } else if (!/\btonight\b/.test(lower)) {
    if (!dayChosen) when.setDate(when.getDate() + 1);
    when.setHours(9, 0, 0, 0);
  }
  return { date: when, phrase: matched.join(" ") };
}

function memoryTitle(memory) {
  const text = (memory.title || memory.content || "").trim();
  const first = text.split(/\n|(?<=[.!?])\s/)[0] ?? "";
  return first.length > 70 ? `${first.slice(0, 69)}…` : first || "A memory";
}

function recall(userId, query, excludeId) {
  const terms = keywords(query);
  if (terms.length === 0) return [];
  const asked = query.trim();
  return table("memories")
    .filter(
      (m) =>
        m.user_id === userId &&
        !m.deleted_at &&
        m.id !== excludeId &&
        (m.content ?? "").trim() !== asked &&
        !/\?\s*$/.test(m.content ?? ""),
    )
    .map((m) => {
      const hay = `${m.title ?? ""} ${m.content ?? ""} ${(m.tags ?? []).join(" ")}`.toLowerCase();
      const score = terms.reduce((acc, term) => acc + (hay.includes(term) ? 1 : 0), 0);
      return { memory: m, score };
    })
    .filter((hit) => hit.score > 0)
    .sort((a, b) => b.score - a.score || new Date(b.memory.timestamp) - new Date(a.memory.timestamp))
    .slice(0, 3);
}

function firstImage(memory) {
  const attachments = memory.metadata?.attachments ?? [];
  return attachments.find((a) => a?.type?.startsWith("image/"))?.url;
}

function compose({ userId, message, attachments }) {
  const text = message.trim();
  const lower = text.toLowerCase();
  const latestMemory = table("memories")
    .filter((m) => m.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];

  const remind = text.match(/^(?:please\s+)?remind me\s+(?:to\s+)?(.+)$/i);
  if (remind) {
    const { date, phrase } = parseWhen(remind[1]);
    let task = remind[1];
    if (phrase) task = task.replace(new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i"), "");
    task =
      task
        .replace(/\s+(on|at|in|by)\s*$/i, "")
        .replace(/[.!\s]+$/, "")
        .trim() || "that";
    table("reminders").push({
      id: uuid(),
      user_id: userId,
      event_name: task.charAt(0).toUpperCase() + task.slice(1),
      event_description: text,
      event_date: date.toISOString().slice(0, 10),
      reminder_time: date.toISOString(),
      reminder_sent: false,
      google_event_id: null,
      tags: ["reminder"],
      created_at: new Date().toISOString(),
    });
    commit();
    return {
      reply: `Done. I'll remind you to ${task} on ${formatWhen(date)}. You'll find it on your calendar too.`,
      suggestions: [
        { label: "Show my calendar", hint: "see what's coming up" },
        { label: "Remind me to call home tomorrow at 6pm" },
      ],
    };
  }

  const isQuestion =
    /\?\s*$/.test(text) ||
    /^(what|when|where|who|why|how|did|do|does|have|has|was|were|is|are|can|could|tell me|show me|find)\b/i.test(text);
  if (isQuestion) {
    const hits = recall(userId, text, latestMemory?.id);
    if (hits.length === 0) {
      return {
        reply:
          "I don't have anything about that yet, and I won't guess. If you tell me about it, I'll keep it so I can answer next time.",
        suggestions: [{ label: "Remember that ", hint: "keep something now", recommended: true }],
      };
    }
    const lines = hits.map(({ memory }) => {
      const at = new Date(memory.event_date ? `${memory.event_date}T12:00:00` : memory.timestamp);
      const date = at.toLocaleDateString(undefined, { day: "numeric", month: "long", year: "numeric" });
      return `• ${date}: ${memoryTitle(memory)}`;
    });
    const top = hits[0].memory;
    return {
      reply: `Here's what you've told me:\n\n${lines.join("\n")}\n\nWant me to pull up anything else around then?`,
      vaultRef: {
        title: memoryTitle(top),
        subtitle: new Date(top.timestamp).toLocaleDateString(undefined, {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        thumbnailUrl: firstImage(top),
      },
    };
  }

  if (/^help me reflect on\b/i.test(text)) {
    const topic = text.replace(/^help me reflect on\s*/i, "").replace(/[.?!]+$/, "") || "that";
    return {
      reply: `Let's take ${topic} slowly. What part of it is still on your mind today, and how did it feel at the time? Say as much or as little as you like. I'll keep it with your other memories.`,
    };
  }

  const related = recall(userId, text, latestMemory?.id)[0];
  const kept = attachments?.length
    ? `Kept ${attachments.length === 1 ? "that" : `those ${attachments.length} files`} safe in your Memory Vault.`
    : "Kept that safe in your Memory Vault.";
  const echo = related
    ? ` It connects to something from ${new Date(related.memory.timestamp).toLocaleDateString(undefined, {
        month: "long",
        year: "numeric",
      })}: "${memoryTitle(related.memory)}".`
    : "";
  return {
    reply: `${kept}${echo} Ask me about it any time${lower.startsWith("today") ? ", even years from now" : ""}.`,
    vaultRef: latestMemory
      ? {
          title: memoryTitle(latestMemory),
          subtitle: "Just now · Memory Vault",
          thumbnailUrl: firstImage(latestMemory),
        }
      : undefined,
  };
}

function titleFrom(message) {
  const words = message.replace(/\s+/g, " ").trim().split(" ").slice(0, 6).join(" ");
  const title = words.replace(/[.,!?;:]+$/, "");
  return title ? title.charAt(0).toUpperCase() + title.slice(1) : "New Conversation";
}

export function runChat({ userId, conversationId, message, attachments = [] }) {
  const now = new Date().toISOString();
  table("chat_messages").push({
    id: uuid(),
    user_id: userId,
    conversation_id: conversationId,
    role: "user",
    content: message,
    metadata: attachments.length ? { attachments } : null,
    created_at: now,
  });
  const { reply, suggestions, vaultRef } = compose({ userId, message, attachments });
  const conversation = table("conversations").find((c) => c.id === conversationId);
  let titleUpdate = null;
  if (conversation) {
    conversation.updated_at = now;
    if (!conversation.title || conversation.title === "New Conversation") {
      conversation.title = titleFrom(message);
      titleUpdate = conversation.title;
    }
  }
  table("chat_messages").push({
    id: uuid(),
    user_id: userId,
    conversation_id: conversationId,
    role: "assistant",
    content: reply,
    metadata: suggestions || vaultRef ? { suggestions, vault_ref: vaultRef } : null,
    created_at: new Date(Date.now() + 1).toISOString(),
  });
  commit();

  const encoder = new TextEncoder();
  const tokens = reply.match(/\S+\s*|\s+/g) ?? [];
  return new ReadableStream({
    async start(controller) {
      const send = (payload) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      await new Promise((r) => setTimeout(r, 450));
      for (const token of tokens) {
        send({ choices: [{ delta: { content: token } }] });
        await new Promise((r) => setTimeout(r, 18));
      }
      if (titleUpdate) send({ type: "title_update", title: titleUpdate, conversationId });
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
}
