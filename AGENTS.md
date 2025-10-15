# Repository Guidelines

## Project Structure & Module Organization

- The active application lives in `JobTracker-new/web-app`, a Vite-powered React + TypeScript project. Install dependencies and run all commands from this directory.
- Feature code is grouped under `src/`: UI primitives in `components/ui`, feature widgets in `components/features`, views in `pages`, shared state in `contexts`, API helpers in `services`, and domain utilities in `lib` and `utils`. Assets and global styles sit in `src/assets` and `src/styles`.
- Tests travel with their features inside `__tests__` folders, with shared scaffolding in `src/test`. Build artifacts live in `dist/`; keep it out of version control.
- Reference material and SQL migrations are in `JobTracker-new/docs` and the root `.sql` files—consult them before touching data flows or Supabase auth.
- Use Context7 and playwright for upto date informations, testing and visual feedback
- use the testing account for login from env.local file

## Build, Test, and Development Commands

- `npm install` – Install project dependencies.
- `npm run dev` – Start the Vite dev server at `http://localhost:5173` with HMR.
- `npm run build` – Type-check via `tsc -b` and emit production assets into `dist/`.
- `npm run preview` – Serve the latest production build for smoke testing.
- `npm run lint` – Run ESLint against all `ts/tsx` sources.
- `npm run test`, `npm run test:ui`, `npm run coverage` – Execute Vitest in CLI, watch the browser-based runner, or inspect coverage summaries.

## Coding Style & Naming Conventions

- Follow the established two-space indentation, single-quote imports, and functional React components. Keep component files in PascalCase (`DashboardHeader.tsx`), hooks in camelCase prefixed with `use`, and utilities in `snake`-free camelCase.
- Use the `@/` path alias for intra-project imports instead of long relatives. Favor Tailwind class names for layout and pair them with CSS modules only when necessary.
- Keep props strongly typed, export only what consumers need, and run `npm run lint` before opening a PR to respect the shared ESLint config.

## Testing Guidelines

- Write Vitest + React Testing Library specs next to the code under test (e.g., `components/ui/__tests__/Button.test.tsx`). Use `src/test/test-utils.tsx` for provider wrappers and `src/test/setup.ts` for global hooks.
- Exercise critical flows (authentication guards, Supabase calls, form validation) and update snapshots or mocks if API contracts evolve.
- Run `npm run test` locally before submitting and ensure the coverage report from `npm run coverage` does not regress noticeably on key modules.

## Commit & Pull Request Guidelines

- Mirror the repository history: short, present-tense summaries such as `Add Supabase profile service` or `Fix application list sorting`. Group related changes; avoid multi-topic commits.
- PRs should include: concise summary, linked issue or doc reference, checklist of commands executed (`npm run lint`, `npm run test`), and UI screenshots or GIFs when visuals change.
- Tag reviewers who own the affected area (UI, data, auth). Note any follow-up tasks or TODOs inline so they are easy to track.

## Security & Configuration Tips

- Never commit Supabase credentials. Store `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_API_BASE_URL`, and feature toggles like `VITE_ENABLE_MOCK_AUTH` in `.env.local`; Vite exposes only `VITE_`-prefixed variables.
- Review `SUPABASE_SETUP.md` and related SQL files before altering schemas. When rotating keys, update local `.env` files and coordinate with deployment secrets simultaneously.
- Sanitize user input at the service layer and prefer centralized fetch wrappers in `src/services` to keep auth headers and error handling consistent.
