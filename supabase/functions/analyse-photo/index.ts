// Describes an uploaded photo so it can be searched later.

import type Anthropic from "npm:@anthropic-ai/sdk@1.3.0";

import { claude, CLAUDE_MODEL, fallbackOptions, textOf } from "../_shared/claude.ts";
import { HttpError, json, requireUser, serve } from "../_shared/http.ts";

serve(async (req) => {
  await requireUser(req);
  const { imageUrl } = await req.json();
  if (typeof imageUrl !== "string" || !/^https:\/\//.test(imageUrl)) throw new HttpError(400, "imageUrl must be an https URL");

  const response = await claude.beta.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: 2000,
    output_config: {
      effort: "low",
      format: {
        type: "json_schema",
        schema: {
          type: "object",
          additionalProperties: false,
          required: ["caption", "tags"],
          properties: {
            caption: { type: "string" },
            tags: { type: "array", items: { type: "string" } },
          },
        },
      },
    },
    messages: [
      {
        role: "user",
        content: [
          { type: "image", source: { type: "url", url: imageUrl } },
          {
            type: "text",
            text: "Write a warm one-sentence caption (max 18 words) for this personal photo, and 3-6 short lowercase tags (people, place, activity, season). Don't guess names.",
          },
        ],
      },
    ] as Anthropic.Beta.BetaMessageParam[],
    ...fallbackOptions,
  });
  if (response.stop_reason === "refusal") return json({ caption: "", tags: [] });
  const parsed = JSON.parse(textOf(response) || "{}");
  return json({ caption: String(parsed.caption ?? ""), tags: Array.isArray(parsed.tags) ? parsed.tags.slice(0, 6) : [] });
});
