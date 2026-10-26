// Column defaults, unique keys and relationships for the demo tables.
// Mirrors supabase/migrations so queries behave the same in both modes.

const now = () => new Date().toISOString();

export const TABLES = {
  profiles: {
    key: "user_id",
    defaults: () => ({
      display_name: null,
      phone: null,
      timezone: null,
      preferences: {},
      created_at: now(),
      updated_at: now(),
    }),
  },
  conversations: { defaults: () => ({ title: "New Conversation", created_at: now(), updated_at: now() }) },
  chat_messages: { defaults: () => ({ metadata: null, created_at: now() }) },
  memories: {
    defaults: () => ({
      title: null,
      summary: null,
      content: "",
      type: "text",
      tags: [],
      metadata: null,
      timestamp: now(),
      event_date: null,
      event_date_is_estimated: false,
      entry_type: "memory",
      is_core: false,
      processing_state: "complete",
      source: "web",
      deleted_at: null,
      created_at: now(),
      updated_at: now(),
    }),
  },
  memory_media: {
    defaults: () => ({
      file_url: null,
      file_type: null,
      file_size: null,
      transcription: null,
      duration_seconds: null,
      storage_path: null,
      created_at: now(),
    }),
  },
  reminders: {
    defaults: () => ({
      event_name: null,
      event_description: null,
      event_date: null,
      reminder_time: null,
      reminder_sent: false,
      google_event_id: null,
      tags: [],
      created_at: now(),
    }),
  },
  gallery_images: {
    defaults: () => ({
      file_name: null,
      file_url: null,
      storage_path: null,
      width: null,
      height: null,
      x: null,
      created_at: now(),
    }),
  },
  vaults: { unique: [["user_id", "name", "ci"]], defaults: () => ({ cover_url: null, created_at: now() }) },
  vault_items: { defaults: () => ({ sort_order: 0, created_at: now() }) },
  user_lists: { defaults: () => ({ list_name: "", created_at: now() }) },
  list_items: { defaults: () => ({ title: "", is_completed: false, sort_order: 0, created_at: now() }) },
  photo_favourites: {
    unique: [["user_id", "item_key"]],
    defaults: () => ({ memory_id: null, gallery_image_id: null, created_at: now() }),
  },
  context_entities: {
    defaults: () => ({
      aliases: [],
      kind: "person",
      canonical_key: null,
      summary: null,
      salience: 0,
      mention_count: 0,
      merged_into: null,
      status: "active",
      first_seen: now(),
      created_at: now(),
    }),
  },
  context_mentions: { defaults: () => ({ created_at: now() }) },
  context_facts: {
    defaults: () => ({ object_entity_id: null, object_text: null, status: "active", created_at: now() }),
  },
  context_surfaced: { defaults: () => ({ created_at: now() }) },
  google_calendar_tokens: { key: "user_id", defaults: () => ({ created_at: now() }) },
};

// embed name -> how to resolve it from a parent row
export const RELATIONS = {
  memories: { memory_media: { table: "memory_media", many: true, foreign: "memory_id" } },
  context_mentions: { context_entities: { table: "context_entities", local: "entity_id" } },
  vault_items: { memories: { table: "memories", local: "memory_id" }, vaults: { table: "vaults", local: "vault_id" } },
  list_items: { user_lists: { table: "user_lists", local: "list_id" } },
};

// child rows removed together with their parent (ON DELETE CASCADE)
export const CASCADES = {
  conversations: [["chat_messages", "conversation_id"]],
  memories: [
    ["memory_media", "memory_id"],
    ["vault_items", "memory_id"],
    ["context_mentions", "memory_id"],
  ],
  vaults: [["vault_items", "vault_id"]],
  user_lists: [["list_items", "list_id"]],
};
