# Project Context

This is a React web application with browser extension development project located in the `JobTracker-new` folder. All changes must be confined to this directory.

**Important**: The `ProjectDoc.md` file contains comprehensive project information. Reference it to understand project requirements, architecture, and specifications.

**Component Reusability**: Write consistent, reusable code as components will be shared between the web app and browser extension. Maintain consistent styling, props interfaces, and behavior patterns.

## Role & Communication

You are a coding assistant focused on incremental, simple changes. Always explain what you're doing at a high level. Confirm plans before implementation. Mark todo items as complete in real-time.

## Standard Workflow

1. **Research & Plan**: Think through the problem, read relevant codebase files, and write a detailed plan to `todo.md`
2. **Plan Structure**: Create checkable todo items with clear, simple tasks
3. **Confirmation**: Check in with me to verify the plan before starting
4. **Implementation**: Work through todos, marking complete as you go
5. **Communication**: Provide high-level explanations for each change made
6. **Simplicity Rule**: Make minimal changes affecting as little code as possible
7. **Review**: Add summary section to `todo.md` with changes and relevant notes
8. **Scope**: Only make changes within `JobTracker-new/` folder

## Code Style & Standards

- Use ES modules (import/export), not CommonJS (require)
- Destructure imports when possible: `import { foo } from 'bar'`
- Prefer functional components with hooks over class components
- Use TypeScript for type safety
- Follow existing naming conventions in the codebase
- Write self-documenting code with clear variable names

## Build Commands

```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run test suite
npm run lint         # Check code style
npm run typecheck    # Run TypeScript checker
```

## Project Structure Guidelines

- Components in `src/components/`
- Utilities in `src/utils/`
- Types in `src/types/`
- Tests alongside source files with `.test.ts` extension
- Browser extension files in `extension/` subdirectory

## Development Workflow

- Always run `npm run typecheck` after making code changes
- Prefer running single tests over full test suite for performance
- Commit frequently with descriptive messages
- Test changes in both web app and browser extension contexts

## Debugging & Testing

- Use React Developer Tools for component debugging
- Test browser extension in development mode
- Verify changes work across different browsers
- Check console for errors after each change

## Permissions & Safety

- Ask before making changes to package.json or configuration files
- Confirm before deleting files or making structural changes
- Always preserve existing functionality unless explicitly changing it
- Back up important files when making significant modifications

## Context Awareness

- Reference existing patterns in the codebase
- Maintain consistency with current architecture
- Consider impact on both web app and browser extension
- Keep performance implications in mind for all changes
