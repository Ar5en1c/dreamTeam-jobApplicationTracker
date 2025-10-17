# UX Guidelines for the Premium Extension

## Design Principles
- **Consistency**: Mirror the aesthetic and motion language of the web app—glassmorphism cards, soft shadows, spring animations, and the same iconography set (Lucide).
- **Focus**: Single-task surfaces. Each view (Capture, Timeline, Tasks) should emphasize one core outcome with minimal distractions.
- **Clarity**: Surface confidence indicators for auto-captured fields and highlight required user input in a friendly, non-alarming way.
- **Speed**: Provide visible feedback (progress bars, skeleton states) during scraping, sync, or AI calls to maintain perceived performance.
- **Trust**: Make data flows explicit (“Saved to your JobTracker Workspace”) and provide quick access to privacy controls and sync status.

## Key Screens
1. **Onboarding & Login**
   - Two-step flow: welcome screen with benefits and permissions checklist, then Supabase-auth login form.
   - Offer “Learn how it works” link to Docs (opens web app route).

2. **Capture Overlay**
   - Appears as a slide-in panel on supported ATS pages (optional, user-toggle).
   - Sections: Job Summary, Requirements, Metadata (location, salary), Personal Notes.
   - Confidence chips (High/Medium/Low) next to auto-filled fields; clicking opens edit drawer.
   - Primary CTA: “Save to Workspace”; secondary: “Review in JobTracker” (opens web detail view).

3. **Popup Home**
   - Snapshot cards: “Captured Today”, “Upcoming Interviews”, “Follow-ups Due”.
   - Recent applications list with status color dots and quick-action menu (status change, add note, view details).
   - Top-right: sync indicator (Live / Offline with tooltip) and account avatar.

4. **Tasks & Reminders**
   - Kanban-style mini board (Today, Upcoming, Snoozed) with drag-and-drop if feasible; fallback to list.
   - Integration hooks for calendar export (phase 2).

5. **Settings**
   - Preferences: auto-open overlay toggle, AI suggestions toggle, analytics opt-in.
   - Accounts: manage Supabase session, switch workspace (future), view connected services.
   - Troubleshooting: logs, support link, version info, “Send feedback” button.

## Interaction Patterns
- **Micro-animations**: replicate framer-motion variants from web app (e.g., `sectionVariants` in `src/pages/Settings.tsx:34-48`).
- **Command Palette**: optional keyboard shortcut (`Cmd/Ctrl+Shift+K`) to change status, add note, or log reminder quickly.
- **Toast System**: reuse web app toast design; appear in bottom center of popup, auto-dismiss with undo option.
- **Error Handling**: Inline alerts for field validation; modal dialogs only for destructive actions (delete capture).

## Accessibility Checklist
- Minimum contrast ratio 4.5:1 for text; provide high-contrast theme toggle.
- Full keyboard support: tab order, ARIA roles on interactive elements, focus rings matching brand colors.
- Screen reader labels for all controls; dynamic updates announced via `aria-live`.
- Motion sensitivity: allow users to disable certain animations (respect OS “Reduce motion” setting).

## Copy & Tone
- Friendly, professional, confidence-inspiring.
- Use action-oriented CTAs: “Review Application”, “Schedule Follow-Up”.
- Avoid jargon; explain features succinctly (“AI suggestions analyze job description and highlight keywords”).

## Assets & Resources
- Shared icon set from `@/components/icons` (to be extracted).
- Tailwind token usage guide: align with values defined in `web-app/tailwind.config.js`.
- Screenshot specs for store listing: 1280×800 for desktop highlight, 640×400 for feature callouts.

## Future Enhancements
- Contextual tips that surface when detection confidence is low (“Add salary info if available to improve AI guidance”).
- Collaboration hints (share capture with coach) once web app supports team workspaces.
- Localization framework ready for Phase 2 (start with English, stage support for Spanish/French).
