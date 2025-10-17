# JobTracker Premium Browser Extension

## Vision
Build a premium, AI-assisted capture companion that mirrors the glassmorphism experience of the new JobTracker web app while giving power users a frictionless way to gather, enrich, and manage job applications without ever leaving the career site they are browsing. The extension should feel like a first-class surface of the SaaS platform—not an afterthought—and it must share the same Supabase backend, auth stack, and design language as the Vite application.

## Environment Setup
1. Copy `.env.example` to `.env.local` and fill in the Supabase keys (reuse the values from `web-app/.env.local`).
2. Set `VITE_WEB_APP_URL` to the base URL of the web app you want the popup to open (`http://localhost:5173` for local development).
3. Restart `npm run dev` or rebuild the extension whenever you change these values.

## Product Pillars
- **Zero-Friction Capture** – One-click ingestion from >15 applicant tracking systems (ATS) with universal fallback and inline manual editing when automation is unavailable.
- **Realtime Workspace Sync** – Extension activity instantly appears in the Applications board, Dashboard metrics, and notification system through Supabase realtime updates.
- **AI-Enhanced Guidance** – Contextual insights, resume tweaks, and follow-up nudges powered by Supabase Edge Functions + Claude/GPT integrations.
- **Privacy & Trust** – Honor user consent, provide transparent status indicators, and ship with RLS-secured Supabase access so data never leaves the trusted stack.
- **Unified Brand Experience** – Tailwind tokens, component primitives, and motion curves all match the web app for a seamless multi-surface journey.

## Core User Journeys
1. **Instant Capture**
   - Detect job metadata on ATS pages, preview the parsed data, and let the user confirm or adjust fields.
   - Save to Supabase as `application_source = 'extension'` with tags (`['captured', 'needs-review']`) for easy filtering in the web app.
2. **Quick Status Updates**
   - While revisiting a company site, change application status or add notes without opening the main app; updates propagate through realtime subscriptions.
3. **Follow-Up Scheduling**
   - Add reminders, email follow-up templates, or interview preparation checklists directly from the popup—synced to Supabase so the Dashboard surfaces tasks.
4. **Resume Tailoring**
   - Trigger Edge Function AI suggestions that highlight missing keywords and propose resume adjustments, offered inline from the capture screen.
5. **Workspace Snapshot**
   - See the most recent applications, interviews this week, and outstanding tasks in a trimmed-down Dashboard module that reuses web-app visual components.

## High-Level Architecture
- **Build System**: Vite + React 19 + TypeScript strict mode, packaged for Chrome/Edge (Manifest V3) with future Firefox support via polyfills.
- **UI Layer**: Shared `@jobtracker/ui` primitives (to be extracted) use Tailwind v4 tokens identical to `web-app/tailwind.config.js`.
- **Background Worker**: MV3 service worker orchestrating Supabase auth/session refresh, sync queue, realtime subscriptions, and Edge Function calls.
- **Content Scripts**: Modular ATS handlers with resilient DOM scraping, fallback heuristics, and MutationObserver throttling.
- **Supabase Integration**: Direct CRUD via typed helpers (`TablesInsert`, `TablesUpdate`); offline queue uses IndexedDB to persist pending transactions.
- **Analytics & Telemetry**: PostHog events, Sentry error capture (respecting user consent toggles).

## Integration With Web App
- Shared Supabase project ensures a single source of truth for job applications, profile data, and AI insights.
- Reuse the existing database service contracts (`src/services/database.ts`) by publishing them via a shared workspace package.
- Realtime channel subscriptions update both extension popup UI and web app dashboards when the other surface performs writes.
- Deep links in extension open the exact application detail route (`/applications/:id`) in the web app, with context preserved via query params (e.g., `?source=extension`).

## Roadmap Snapshot
1. **Foundation** – Set up MV3 scaffold, shared config, Supabase client, auth, and design system bridge.
2. **Capture Alpha** – Port ATS parsers, build manual capture form, implement optimistic Supabase insert + offline queue.
3. **Sync & Status** – Add realtime listeners, quick actions, badges, and background retry strategies.
4. **AI & Productivity** – Integrate Claude-driven insights, reminders, and follow-up flows.
5. **Polish & Launch** – Harden telemetry, accessibility, localization, browser store packaging, and legacy user migration scripts.

## Repository Layout (initial draft)
```
browser-extension/
├─ README.md
├─ docs/
│  ├─ Architecture.md
│  ├─ Roadmap.md
│  └─ UX.md
├─ src/
│  ├─ background/
│  ├─ content/
│  ├─ popup/
│  ├─ shared/
│  └─ manifest.json
└─ package.json (to be added in implementation phase)
```

> **Next Steps:** See `docs/Architecture.md` and `docs/Roadmap.md` for detailed implementation guidance and milestone planning.
