# ALMA AI (replica)

A full replica of the ALMA AI web app (`alma-ai-khaki.vercel.app`): the marketing site, phone/Google/email
sign-in, onboarding, and every signed-in screen (Today, Chat, Memories, Memory detail, Calendar, Gallery,
Memory Vault, What Alma knows, Analytics, Settings, More), in English and Arabic (RTL).

The UI was rebuilt from the live app's production bundle, so the markup, Tailwind classes, copy, icons and
images match the original.

## Quick look (no install)

Download `standalone/ALMA-AI.html` and double-click it. It's the whole app in one file and runs in the demo mode
described below. Rebuild it with `npm run build:standalone`.

## Run it

```bash
npm install
npm run dev          # http://localhost:8080
```

With no environment variables set, the app runs against a **built-in demo backend**. Everything works in the
browser and data is saved to `localStorage`:

- **Sign in:** use any phone number with any 6-digit code (e.g. `123456`), "Continue with Google", or
  email sign-up. New accounts get sample memories, photos, people, lists and reminders so every screen has
  content.
- **Chat:** keeps every message as a memory, answers questions from your memories, and creates reminders
  from "Remind me to … tomorrow at 7pm".
- **Calendar:** connect Google (simulated), add events, mark reminders done.
- **Gallery:** upload photos (they're downscaled and stored in the browser), file them into vaults, and mark
  favourites.
- **Settings:** language switch, check-ins, export your data as JSON, delete your account.

The demo backend lives in `src/integrations/supabase/demo/`. It mimics the parts of `supabase-js` the app
uses (query builder with filters, joins, counts and RLS; auth; storage; edge functions).

## Going live (real Supabase project)

1. Create a Supabase project and apply the schema:
   ```bash
   supabase link --project-ref <ref>
   supabase db push                      # supabase/migrations/*.sql
   ```
2. Set the function secrets from `supabase/functions/.env.example`, then deploy:
   ```bash
   supabase secrets set --env-file supabase/functions/.env
   supabase functions deploy
   ```
   | Function | Uses |
   |---|---|
   | `chat` | Claude (`claude-opus-5-5`): memory recall + `create_reminder` tool, SSE reply |
   | `analyse-photo` | Claude vision: caption + tags |
   | `transcribe-audio`, `tts` | ElevenLabs speech-to-text / text-to-speech |
   | `wa-otp-send`, `wa-otp-verify`, `send-welcome` | WhatsApp Cloud API sign-in codes |
   | `google-oauth-init`, `google-oauth-callback`, `get-calendar-events`, `create-calendar-event` | Google Calendar |
   | `delete-account` | Removes files, rows and the auth user |
3. In Supabase Auth, enable the Google provider (for "Continue with Google") and email sign-ups.
4. Copy `.env.example` to `.env` and fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY`.

Once those two variables are set, the app talks to Supabase instead of the demo backend.

## Project layout

```
src/
  pages/            one file per route (Index = marketing site)
  components/       AppSidebar, SearchPalette (⌘K), auth art, settings parts, shadcn/ui
  i18n/             English + Arabic dictionaries and LanguageProvider
  lib/              memory, calendar, journey and profile helpers
  integrations/supabase/
    client.js       real client when env vars are set, demo client otherwise
    demo/           in-browser backend
supabase/
  migrations/       tables, RLS policies, storage buckets
  functions/        Deno edge functions
```

## Deploy the frontend

It's a static Vite app: `npm run build` outputs `dist/`. `vercel.json` rewrites every route to `index.html`.
