# Hololog Client

Frontend client for Hololog. Next.js (App Router) + TypeScript + Tailwind CSS v4.

> **Next.js 16 note**: This version has breaking changes — APIs, conventions, and file
> structure may differ from older versions. Read the relevant guide in
> `node_modules/next/dist/docs/` before writing app code. Heed deprecation notices.

## Stack

- **Next.js 16** (App Router, `src/` dir, `@/*` import alias)
- **TypeScript**, **Tailwind CSS v4**
- **Architecture**: Feature-Sliced Design (FSD)
- **State**: Zustand (in each slice's `model` segment)
- **HTTP**: Axios — shared instance in `src/shared/api` (`api`)
- **Lint/Format**: ESLint (`eslint-config-next` + `eslint-config-prettier`) and Prettier

## Architecture — Feature-Sliced Design

Layers, top → bottom (a layer may import only from layers below it):

`app` → `views` → `widgets` → `features` → `entities` → `shared`

```
src/
  app/        # Next.js routing (thin) + global providers/styles
  views/      # page compositions (FSD "pages", renamed)
  widgets/    # composite UI blocks
  features/   # user interactions with business value
  entities/   # business domain models
  shared/     # api, ui, lib, config — framework-agnostic reusables
```

- Each slice exposes a public API via `index.ts`; import through the barrel
  (`@/entities/counter`), never reach into internals.
- `src/app/` is thin: `page.tsx` re-exports the matching view from `@/views/*`.
- See `.claude/rules/shared.md` for the full import rule and slice/segment layout.

## Commands

- `npm run dev` — start dev server
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier write / check
- `npx tsc --noEmit` — type check

## Conventions

- Follow the FSD import rule: only import from lower layers, never sideways or upward.
- Use the shared `api` instance from `@/shared/api` for HTTP; don't call `axios` directly in components.
- Env vars exposed to the browser must be prefixed `NEXT_PUBLIC_`. See `.env.example`; put real values in `.env.local` (gitignored).
- Before committing, ensure `npx tsc --noEmit`, `npm run lint`, and `npm run format:check` pass.

## Git workflow

- Commits follow Conventional Commits with a Korean summary, e.g. `feat: 로그인 폼 추가`. Use `/commit`.
- PRs use `/pr` (Korean title/body). Confirm branch and base before pushing.

## Claude Code harness (`.claude/`)

Slash commands (`.claude/commands/`):

- `/plan <task>` — produce an implementation plan before coding
- `/commit` — logically split, Korean Conventional Commits
- `/pr` — open a PR with `gh` (Korean body)
- `/review` — review the current diff for bugs and convention violations
- `/update-harness <change>` — modify these commands/rules/settings

Detailed conventions live in `.claude/rules/` — read the relevant file before writing code:

- `shared.md` — cross-cutting (TS, HTTP, state, env, checks)
- `components.md` — React component conventions
- `pages.md` — App Router (route files, data fetching, metadata)

Editing aside, harness docs are written in English; generated commit/PR messages stay Korean.
A PostToolUse hook (`.claude/hooks/format.mjs`) runs Prettier on each edited file.
