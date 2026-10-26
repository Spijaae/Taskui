// Sample memories for a brand-new demo account, so every screen has
// something real to show. Everything here can be edited or deleted.

import bike from "@/assets/bike.webp";
import breakfast from "@/assets/breakfast.webp";
import fox from "@/assets/fox.webp";
import hill from "@/assets/hill.webp";
import tile2 from "@/assets/tile-2.jpg";
import tile3 from "@/assets/tile-3.jpg";

import { commit, table, uuid } from "./store";
import { TABLES } from "./schema";

const absolute = (url) => new URL(url, document.baseURI).toString();

function daysAgo(days, hours = 10, minutes = 0) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hours, minutes, 0, 0);
  return d;
}

function daysAhead(days, hours = 9, minutes = 0) {
  return daysAgo(-days, hours, minutes);
}

export function seedAccount(userId) {
  if (table("memories").some((m) => m.user_id === userId)) return;
  const row = (name, values) => {
    const record = { ...TABLES[name].defaults(), id: uuid(), user_id: userId, ...values };
    if (name === "memory_media") delete record.user_id;
    table(name).push(record);
    return record;
  };

  const photo = (url, name, days, caption, tags, extra = {}) => {
    const at = daysAgo(days, 9 + (days % 8));
    const image = row("gallery_images", {
      file_url: absolute(url),
      file_name: name,
      storage_path: `${userId}/${name}`,
      created_at: at.toISOString(),
    });
    const memory = row("memories", {
      content: caption,
      type: "photo",
      tags,
      timestamp: at.toISOString(),
      created_at: at.toISOString(),
      metadata: {
        attachments: [{ url: absolute(url), type: "image/webp", name }],
        gallery_image_id: image.id,
        source: "whatsapp",
      },
      ...extra,
    });
    row("memory_media", { memory_id: memory.id, file_url: absolute(url), file_type: "image/webp" });
    return memory;
  };

  const note = (days, content, tags = [], extra = {}) => {
    const at = daysAgo(days, 8 + (days % 12), (days * 7) % 60);
    return row("memories", {
      content,
      type: "text",
      tags,
      timestamp: at.toISOString(),
      created_at: at.toISOString(),
      ...extra,
    });
  };

  const voice = (days, content, seconds) => {
    const at = daysAgo(days, 21, 40);
    const memory = row("memories", {
      content,
      type: "voice",
      tags: ["voice"],
      timestamp: at.toISOString(),
      created_at: at.toISOString(),
      metadata: { source: "whatsapp", transcript: content },
    });
    row("memory_media", {
      memory_id: memory.id,
      file_type: "audio/ogg",
      duration_seconds: seconds,
      transcription: content,
    });
    return memory;
  };

  const breakfastMemory = photo(
    breakfast,
    "sunday-breakfast.webp",
    2,
    "Sunday breakfast at Maya's. She finally made her grandmother's shakshuka.",
    ["food", "family"],
    { is_core: true },
  );
  const bikeMemory = photo(
    bike,
    "first-ride.webp",
    18,
    "Leo rode without stabilisers for the first time, all the way to the park gate.",
    ["leo", "milestone"],
    { is_core: true },
  );
  const foxMemory = photo(
    fox,
    "fox-garden.webp",
    33,
    "A fox sat in the garden for ten minutes this morning, completely unbothered.",
    ["garden", "nature"],
  );
  const hillMemory = photo(
    hill,
    "ridge-walk.webp",
    61,
    "Walked the ridge above the village with Dad. He named every hill.",
    ["dad", "walks"],
    { event_date: daysAgo(61).toISOString().slice(0, 10) },
  );
  photo(tile2, "market-stall.jpg", 95, "The flower stall by the station is back for spring.", ["spring"]);
  photo(tile3, "window-light.jpg", 140, "Late light through the kitchen window.", ["home"]);

  note(0, "Remember that Maya's birthday dinner is at Olive & Fig, she wants the corner table.", ["maya", "birthday"]);
  note(
    5,
    "Dad's blood pressure tablets: half a dose in the morning now, full dose at night. Dr Shah said review in June.",
    ["dad", "health"],
    { is_core: true },
  );
  note(9, "Today I finished the first draft of the grant proposal. Felt lighter walking home than I have in weeks.", [
    "work",
  ]);
  note(12, "Leo's new favourite word is 'actually'. Used it eleven times at dinner.", ["leo", "funny"]);
  note(26, "The Wi-Fi password at Mum's is on the fridge: Lavender2019", ["home"]);
  note(47, "Gave the opening toast at Sam's wedding. Kept it under three minutes like I promised.", ["friends"]);
  note(80, "First swim of the year at the lido. 14 degrees. Never again (until next week).", ["swimming"]);
  voice(
    3,
    "Note to self: the plumber said the boiler pressure should sit between one and one and a half bar. Top it up from the silver tap under the sink.",
    24,
  );
  voice(21, "Leo singing the whole of 'Here Comes the Sun' in the bath, with his own words for the second verse.", 71);
  voice(54, "Dad telling the story about the night the power went out at the shop in 1987.", 186);

  const maya = row("context_entities", {
    name: "Maya",
    canonical_key: "person:maya",
    kind: "person",
    summary: "Close friend; makes a famous shakshuka.",
    aliases: ["May"],
    salience: 0.9,
    mention_count: 6,
  });
  const dad = row("context_entities", {
    name: "Dad",
    canonical_key: "person:dad",
    kind: "person",
    summary: "Loves hill walks and long stories.",
    aliases: ["Father"],
    salience: 0.95,
    mention_count: 9,
  });
  const leo = row("context_entities", {
    name: "Leo",
    canonical_key: "person:leo",
    kind: "person",
    summary: "Son, five years old.",
    salience: 0.97,
    mention_count: 11,
  });
  const village = row("context_entities", {
    name: "the village",
    canonical_key: "place:village",
    kind: "place",
    salience: 0.4,
    mention_count: 2,
  });
  row("context_mentions", { memory_id: breakfastMemory.id, entity_id: maya.id });
  row("context_mentions", { memory_id: hillMemory.id, entity_id: dad.id });
  row("context_mentions", { memory_id: hillMemory.id, entity_id: village.id });
  row("context_mentions", { memory_id: bikeMemory.id, entity_id: leo.id });
  row("context_facts", { subject_entity_id: maya.id, predicate: "birthday dinner at", object_text: "Olive & Fig" });
  row("context_facts", {
    subject_entity_id: dad.id,
    predicate: "takes",
    object_text: "blood pressure tablets, reviewed in June",
  });
  row("context_facts", {
    subject_entity_id: leo.id,
    predicate: "learned to",
    object_text: "ride a bike without stabilisers",
  });
  row("context_surfaced", { subject_key: "person:dad" });

  const family = row("vaults", { name: "Family", cover_url: absolute(breakfast) });
  const outdoors = row("vaults", { name: "Outdoors", cover_url: absolute(hill) });
  row("vault_items", { vault_id: family.id, memory_id: breakfastMemory.id, sort_order: 0 });
  row("vault_items", { vault_id: family.id, memory_id: bikeMemory.id, sort_order: 1 });
  row("vault_items", { vault_id: outdoors.id, memory_id: hillMemory.id, sort_order: 0 });
  row("vault_items", { vault_id: outdoors.id, memory_id: foxMemory.id, sort_order: 1 });

  const groceries = row("user_lists", { list_name: "Groceries" });
  ["Eggs", "Feta", "Tomatoes", "Sourdough", "Oat milk"].forEach((title, i) =>
    row("list_items", { list_id: groceries.id, title, is_completed: i === 1, sort_order: i }),
  );
  const gifts = row("user_lists", { list_name: "Gift ideas" });
  ["Maya: cast-iron pan", "Dad: walking map of the Peaks", "Leo: bike bell"].forEach((title, i) =>
    row("list_items", { list_id: gifts.id, title, sort_order: i }),
  );

  const reminder = (days, hours, name, description, tags = ["reminder"], sent = false) => {
    const at = daysAhead(days, hours);
    row("reminders", {
      event_name: name,
      event_description: description,
      event_date: at.toISOString().slice(0, 10),
      reminder_time: at.toISOString(),
      reminder_sent: sent,
      tags,
    });
  };
  reminder(1, 18, "Call Dad about the June check-up", "Ask if Dr Shah changed the dose");
  reminder(3, 9, "Book the lido lane", null);
  reminder(6, 19, "Maya's birthday dinner", "Olive & Fig, corner table", ["calendar"], true);
  reminder(12, 8, "Renew car insurance", null);

  const convo = (days, title, turns) => {
    const start = daysAgo(days, 20, 15);
    const c = row("conversations", { title, created_at: start.toISOString(), updated_at: start.toISOString() });
    turns.forEach(([role, content, metadata], i) => {
      row("chat_messages", {
        conversation_id: c.id,
        role,
        content,
        metadata: metadata ?? null,
        created_at: new Date(start.getTime() + i * 45000).toISOString(),
      });
    });
    c.updated_at = new Date(start.getTime() + turns.length * 45000).toISOString();
  };
  convo(1, "When is Dad's check-up", [
    ["user", "When is Dad's blood pressure review?"],
    [
      "assistant",
      "You noted that Dr Shah wants to review Dad's dose in June. He's on half a dose in the morning and a full dose at night for now.",
      { vault_ref: { title: "Dad's blood pressure tablets", subtitle: "Kept 5 days ago" } },
    ],
  ]);
  convo(18, "Leo's first bike ride", [
    ["user", "Leo rode without stabilisers today!"],
    [
      "assistant",
      "That's a big one. Kept it in your vault with the photo, so you can come back to it when he's grown.",
      { suggestions: [{ label: "Add it to Family", recommended: true }, { label: "Remind me to buy a bike bell" }] },
    ],
  ]);

  commit();
}
