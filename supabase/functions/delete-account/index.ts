// Permanently deletes the caller's account, files and every row they own.

import { HttpError, json, requireUser, serve } from "../_shared/http.ts";

serve(async (req) => {
  const { user, admin } = await requireUser(req);
  const { confirm } = await req.json().catch(() => ({}));
  if (!confirm) throw new HttpError(400, "Confirmation is required");

  for (const bucket of ["memories", "gallery-images", "memory-media"]) {
    const { data: files } = await admin.storage.from(bucket).list(user.id, { limit: 1000 });
    if (files?.length) await admin.storage.from(bucket).remove(files.map((f) => `${user.id}/${f.name}`));
  }
  // Every table references auth.users with ON DELETE CASCADE.
  const { error } = await admin.auth.admin.deleteUser(user.id);
  if (error) return json({ ok: false, error: error.message }, 500);
  return json({ ok: true });
});
