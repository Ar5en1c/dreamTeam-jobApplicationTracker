# Browser Extension Roadmap

## Phase 0 — Discovery & Alignment (Week 0)
- Stakeholder workshops to prioritize extension use cases vs. web app roadmap.
- Competitive audit (Sonara, Simplify, Teal) to benchmark capture UX, AI assist, and onboarding friction.
- Document success metrics: capture-to-review rate, time-to-save, sync latency, AI suggestion adoption.
- Finalize shared design tokens packaging plan with web-app team.

## Phase 1 — Platform Foundation (Weeks 1-2)
- Scaffold MV3 project with Vite, CRX plugin, Tailwind, React 19, TS strict.
- Extract shared packages:
  - `@jobtracker/design-tokens`
  - `@jobtracker/ui` (Button, Card, Input, Badge, Toast, Skeleton)
  - `@jobtracker/supabase-client` (singleton session manager that both surfaces can import)
- Implement Supabase auth handshake (email/password + OAuth), session persistence, and popup login screen.
- Set up IndexedDB storage layer and base sync queue skeleton.
- Deliver automated tests for auth flows and store initialization.

## Phase 2 — Capture Alpha (Weeks 3-4)
- Port ATS detection + extraction handlers (Lever, Greenhouse, Workday, SmartRecruiters, Oracle, Jobvite, Ashby, Taleo, Eightfold, iCIMS); refactor to TypeScript with confidence scoring.
- Build capture preview UI with manual edit form and validation using shared components.
- Implement direct Supabase inserts with optimistic UI and offline queue fallback.
- Tag captured applications with `application_source = 'extension'` and `tags = ['captured', 'needs-review']`.
- Ship internal dogfood build to core team; capture telemetry baseline.

## Phase 3 — Sync & Productivity (Weeks 5-6)
- Add realtime channel subscriptions to receive updates from Supabase and surface in popup.
- Implement quick actions: status change, add note, mark as follow-up.
- Display mini-dashboard (recent applications, upcoming interviews, reminders) using shared card components.
- Build notification system (badge counts, toast alerts) tied to Supabase updates and background events.
- Harden offline queue with retry & conflict resolution; write Vitest + Playwright coverage.

## Phase 4 — AI Assistance (Weeks 7-8)
- Integrate Supabase Edge Functions for keyword suggestions, resume tailoring, and follow-up email drafts.
- Add AI insights section in capture confirmation, with option to sync suggestions into the main application record.
- Introduce smart reminders: recommend follow-up dates based on status transitions and AI confidence.
- Implement user-level usage tracking and feature flag toggles via PostHog.

## Phase 5 — Polish & Launch Prep (Weeks 9-10)
- Accessibility/UX polish (keyboard navigation, localization scaffolding, high-contrast mode).
- Ship comprehensive telemetry dashboards (per provider success rates, AI usage).
- Implement migration flow for legacy users (import existing AWS data, guide through Supabase signup).
- Prepare store listings: screenshots, promo video, privacy policy, support docs.
- Finalize GitHub Actions workflow to build, package, and upload release artifacts.

## Post-Launch Iterations
- Add Firefox support (Manifest V3 adjustments, polyfills).
- Expand ATS support coverage based on telemetry (e.g., brassring, rippling).
- Introduce collaboration features (share capture with coach, comment threads).
- Explore mobile deep links and push notifications for reminders.

## Success Metrics
- **Activation**: ≥70% of new web app sign-ups install extension within 7 days.
- **Capture Efficiency**: Median time from page detection to saved application ≤ 20 seconds.
- **Sync Reliability**: 99.5% of captures appear in web app within 5 seconds (online condition).
- **AI Engagement**: ≥40% of captures trigger at least one AI suggestion interaction.
- **Retention**: 4-week extension retention ≥ 65% among active web users.
