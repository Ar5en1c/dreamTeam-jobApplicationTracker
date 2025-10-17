# Browser Extension Architecture Blueprint

## 1. Technology Baseline
- **Runtime Targets**: Chromium MV3 (Chrome/Edge/Arc), Firefox MV3 (phase 2)
- **Language & Framework**: React 19, TypeScript strict
- **Bundler**: Vite + `@crxjs/vite-plugin` for manifest-driven builds
- **Styling**: TailwindCSS v4 with shared design tokens (import from new `packages/design-tokens`)
- **State Management**: React Query + Zustand hybrid for popup UI, Background uses tiny state machine
- **Testing**: Vitest + React Testing Library (popup), Playwright for E2E extension flows

## 2. Project Structure
```
src/
├─ background/
│  ├─ index.ts             // service worker entry
│  ├─ supabaseSession.ts   // auth handling, refresh, persistence
│  ├─ syncQueue.ts         // offline queue + retry logic
│  ├─ realtime.ts          // subscriptions + event routing
│  └─ analytics.ts         // PostHog + Sentry dispatch
├─ content/
│  ├─ index.ts             // loader to mount per-tab UI bridges
│  ├─ detectors/           // heuristics to detect ATS type
│  ├─ extractors/          // site-specific parsing (Lever, Greenhouse, etc.)
│  └─ overlay/             // optional inline UI when editing in-page
├─ popup/
│  ├─ App.tsx              // micro-dashboard shell
│  ├─ routes/              // capture, status, reminders, settings
│  └─ components/          // re-exports of shared primitives
├─ shared/
│  ├─ api/                 // Supabase typed helpers, Edge Function clients
│  ├─ ui/                  // import from shared design system
│  ├─ storage/             // IndexedDB + chrome.storage wrappers
│  └─ telemetry/           // analytics abstractions
└─ manifest.json           // MV3 manifest generated from TS config
```

## 3. Supabase Integration Strategy
### Auth
- Use `supabase.auth.signInWithPassword` / OAuth handled via browser tabs.
- Persist session in `chrome.storage.session` + memory mirror.
- Background script refreshes tokens at 50% of expiration using `supabase.auth.refreshSession`.
- Popup/content scripts request the current session via `chrome.runtime.sendMessage` to avoid multiple Supabase clients.

### Data Access
- All CRUD operations funnel through background via message passing to centralize security.
- Helpers import `TablesInsert` / `TablesUpdate` types from shared package to maintain schema parity (`web-app/src/lib/supabase.ts`).
- Each write sets:
  - `application_source = 'extension'`
  - `status_history` entry when status changes
  - `metadata.capture_context` JSON (browser, tab URL, detected ATS)

### Offline & Retry
- IndexedDB queue of pending mutations with compact schema:
  ```ts
  type PendingMutation = {
    id: string;
    createdAt: number;
    type: 'insert' | 'update' | 'delete';
    table: 'job_applications' | 'notes' | ...;
    payload: Record<string, unknown>;
    retries: number;
  };
  ```
- Background worker listens for `online` events and flushes queue.
- Exponential backoff with jitter, max retry 5, surfaces errors in popup notifications.

### Realtime Sync
- Subscribe to `supabase.channel('job_applications:user_id')`.
- Broadcast relevant changes to popup instances via `chrome.runtime` messaging.
- Badge counts update when new `status` values enter `interview` or `offer`.

## 4. ATS Extraction Layer
- `detectors/*.ts`: heuristics that map `window.location` + DOM signatures to a handler key.
- `extractors/<provider>.ts`: return strongly typed `CapturedApplication` objects with field confidence scoring.
- Shared pipeline:
  1. Detect provider.
  2. Extract fields with retries + MutationObserver (debounced).
  3. Run field normalization (salary parsing, location standardization).
  4. Flag missing critical fields (title/company) for manual confirmation.
- Maintain provider registry in JSON to quickly toggle support or adjust priority.

## 5. Popup Experience
- **Routing**: Minimal router (React Router) for four views: Capture, Timeline, Tasks, Settings.
- **Global State**: Zustand store hydrated from background-sent snapshots; updates derived from Supabase realtime events.
- **Theming**: Light/dark synced with web app theme; user preference stored in Supabase profile.
- **Accessibility**: Keyboard-first navigation, high-contrast option, ARIA labels aligned with web app components.

## 6. Edge Functions & AI
- Expose Edge Function endpoints for:
  - Keyword enrichment (`/functions/v1/extract_keywords`)
  - Follow-up email drafting (`/functions/v1/generate_email`)
  - Resume tailoring suggestions (`/functions/v1/resume_tailor`)
- Background invokes functions, caches results in Supabase `ai_insights` table, and streams updates to popup via realtime.
- Rate limit invocation per user to prevent abuse (store counters in Supabase `usage_metrics`).

## 7. Telemetry & Observability
- **Analytics**: PostHog with feature flags to remotely toggle components (e.g., beta ATS handler).
- **Error Reporting**: Sentry with MV3-compatible transport, scrubbing personal data.
- **Performance**: Log extraction latency per provider to Supabase `automation_logs`.

## 8. Security Considerations
- Respect Supabase RLS—never embed service key in extension.
- Validate ATS extraction output client-side before sending to Supabase to prevent malformed data.
- Use CSP in manifest to restrict script origins.
- Provide user-visible consent toggles for analytics and AI features; default to off for new EU users.

## 9. Packaging & Deployment
- Build pipeline integrated into existing GitHub Actions workflow with a new job:
  - `npm install` in `browser-extension`
  - `npm run lint`, `npm run build`
  - Upload artifact (`extension.zip`) to GitHub Releases / store submission.
- Include automated MV3 compliance checks and screenshot generation via Playwright.

## 10. Legacy Migration Strategy
- Implement import command in popup to fetch existing AWS-stored records (if available) and push into Supabase.
- Offer one-time notification to legacy users with CTA to sign in and migrate.
- After successful migration, disable old background AWS sync and remove legacy keys.
