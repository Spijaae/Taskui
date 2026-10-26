import Anthropic from "npm:@anthropic-ai/sdk@1.3.0";

export const CLAUDE_MODEL = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-opus-5-5";

export const claude = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

// Shared request options: on a safety decline the API re-runs the request on
// Anthropic's recommended fallback model instead of returning a refusal.
export const fallbackOptions: { betas: Anthropic.Beta.AnthropicBeta[]; fallbacks: "default" } = {
  betas: ["server-side-fallback-2026-07-01"],
  fallbacks: "default",
};

export function textOf(message: Anthropic.Beta.BetaMessage): string {
  return message.content
    .filter((block): block is Anthropic.Beta.BetaTextBlock => block.type === "text")
    .map((block) => block.text)
    .join("")
    .trim();
}
