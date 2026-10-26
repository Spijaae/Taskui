// ALMA's conversational agent. Saves the turn, recalls related memories,
// lets Claude create reminders, and streams the reply back as SSE in the
// OpenAI-style delta format the web client reads.

import type Anthropic from "npm:@anthropic-ai/sdk@1.3.0";

import { claude, CLAUDE_MODEL, fallbackOptions, textOf } from "../_shared/claude.ts";
import { corsHeaders, HttpError, requireUser, serve } from "../_shared/http.ts";

const STOP_WORDS = new Set(
  "a an and are at be but by did do does for from had has have how i in is it me my of on or that the this to was we were what when where which who why will with you your about".split(" "),
);

const tools: Anthropic.Beta.BetaTool[] = [
  {
    name: "create_reminder",
    description:
      "Create a reminder for the user. Use whenever the user asks to be reminded of something or schedules a task. Resolve relative dates against the current time and timezone given in the system prompt.",
    strict: true,
    input_schema: {
      type: "object",
      additionalProperties: false,
      required: ["title", "remind_at"],
      properties: {
        title: { type: "string", description: "Short imperative description, e.g. 'Call Dad'" },
        remind_at: { type: "string", description: "ISO 8601 date-time with offset when the reminder should fire" },
        details: { type: "string", description: "Optional extra context from the conversation" },
      },
    },
  },
];

function keywords(text: string): string[] {
  return (text.toLowerCase().match(/[a-z0-9']+/g) ?? []).filter((w) => w.length > 2 && !STOP_WORDS.has(w)).slice(0, 8);
}

serve(async (req) => {
  const { user, admin } = await requireUser(req);
  const { conversationId, message, attachments = [], userTimezone = "UTC" } = await req.json();
  if (!conversationId || typeof message !== "string") throw new HttpError(400, "conversationId and message are required");

  const { data: conversation } = await admin
    .from("conversations")
    .select("id, title")
    .eq("id", conversationId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!conversation) throw new HttpError(404, "Conversation not found");

  await admin.from("chat_messages").insert({
    user_id: user.id,
    conversation_id: conversationId,
    role: "user",
    content: message,
    metadata: attachments.length ? { attachments } : null,
  });

  const [{ data: history }, { data: profile }] = await Promise.all([
    admin
      .from("chat_messages")
      .select("role, content")
      .eq("conversation_id", conversationId)
      .order("created_at", { ascending: false })
      .limit(20),
    admin.from("profiles").select("display_name, preferences").eq("user_id", user.id).maybeSingle(),
  ]);

  // Recall: the most relevant earlier memories for this message.
  const terms = keywords(message);
  let recalled: { content: string; timestamp: string }[] = [];
  if (terms.length) {
    const { data } = await admin
      .from("memories")
      .select("content, timestamp")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .or(terms.map((t) => `content.ilike.%${t.replace(/[%,()]/g, "")}%`).join(","))
      .order("timestamp", { ascending: false })
      .limit(12);
    recalled = (data ?? []).filter((m) => m.content.trim() !== message.trim());
  }

  const language = profile?.preferences?.language === "ar" ? "Arabic" : "English";
  const system = [
    "You are ALMA, a calm, warm memory companion. People tell you about their lives (notes, photos, voice notes) and you keep it safe and hand it back when they ask.",
    "Every message the user sends is already saved to their private Memory Vault; acknowledge briefly instead of repeating it back.",
    "Answer questions only from the memories provided below or the conversation. If the answer is not there, say you don't have it yet; never invent a memory.",
    "Keep replies short (1-4 sentences) and plain-text: no markdown headings or bold.",
    `Reply in ${language} unless the user writes in another language.`,
    `The user's name is ${profile?.display_name ?? "unknown"}. Current time: ${new Date().toISOString()} (user timezone ${userTimezone}).`,
    recalled.length
      ? `Relevant memories:\n${recalled.map((m) => `- [${m.timestamp.slice(0, 10)}] ${m.content}`).join("\n")}`
      : "No related memories were found for this message.",
  ].join("\n\n");

  const messages: Anthropic.Beta.BetaMessageParam[] = (history ?? [])
    .reverse()
    .filter((m) => m.role === "user" || m.role === "assistant")
    .map((m) => ({ role: m.role as "user" | "assistant", content: m.content || "(empty)" }));

  let reply = "";
  for (let turn = 0; turn < 4; turn++) {
    const response = await claude.beta.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 16000,
      system,
      tools,
      messages,
      output_config: { effort: "low" },
      ...fallbackOptions,
    });
    if (response.stop_reason === "refusal") {
      reply = "I can't help with that one, but I'm here for anything else you want to keep or find.";
      break;
    }
    const toolUses = response.content.filter((b): b is Anthropic.Beta.BetaToolUseBlock => b.type === "tool_use");
    if (response.stop_reason !== "tool_use" || toolUses.length === 0) {
      reply = textOf(response);
      break;
    }
    messages.push({ role: "assistant", content: response.content });
    const results: Anthropic.Beta.BetaToolResultBlockParam[] = [];
    for (const call of toolUses) {
      const input = call.input as { title?: string; remind_at?: string; details?: string };
      const when = new Date(input.remind_at ?? "");
      if (!input.title || Number.isNaN(when.getTime())) {
        results.push({ type: "tool_result", tool_use_id: call.id, is_error: true, content: "Invalid title or remind_at" });
        continue;
      }
      const { error } = await admin.from("reminders").insert({
        user_id: user.id,
        event_name: input.title,
        event_description: input.details ?? message,
        event_date: when.toISOString().slice(0, 10),
        reminder_time: when.toISOString(),
        tags: ["reminder"],
      });
      results.push({
        type: "tool_result",
        tool_use_id: call.id,
        is_error: !!error,
        content: error ? error.message : `Reminder saved for ${when.toISOString()}`,
      });
    }
    messages.push({ role: "user", content: results });
  }
  if (!reply) reply = "Kept that safe.";

  await admin.from("chat_messages").insert({
    user_id: user.id,
    conversation_id: conversationId,
    role: "assistant",
    content: reply,
  });

  let newTitle: string | null = null;
  if (!conversation.title || conversation.title === "New Conversation") {
    newTitle = message.replace(/\s+/g, " ").trim().split(" ").slice(0, 6).join(" ").replace(/[.,!?;:]+$/, "") || null;
  }
  await admin
    .from("conversations")
    .update(newTitle ? { title: newTitle, updated_at: new Date().toISOString() } : { updated_at: new Date().toISOString() })
    .eq("id", conversationId);

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      for (const piece of reply.match(/\S+\s*|\s+/g) ?? []) send({ choices: [{ delta: { content: piece } }] });
      if (newTitle) send({ type: "title_update", title: newTitle, conversationId });
      controller.enqueue(encoder.encode("data: [DONE]\n\n"));
      controller.close();
    },
  });
  return new Response(stream, { headers: { ...corsHeaders, "Content-Type": "text/event-stream" } });
});
