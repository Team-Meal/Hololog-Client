# Architecture & shared rules

This project uses **Feature-Sliced Design (FSD)** on top of the Next.js App Router.

## Layers (top → bottom)

`app` → `views` → `widgets` → `features` → `entities` → `shared`

- **app** — global setup. Lives in `src/app/` (Next.js routing) + layout/providers/global styles.
- **views** — page compositions (FSD `pages`, renamed). `src/views/`.
- **widgets** — composite UI blocks (header, sidebar, cards). `src/widgets/`.
- **features** — user interactions with business value (auth/login, post/like). `src/features/`.
- **entities** — business domain models (user, post, counter). `src/entities/`.
- **shared** — framework-agnostic reusable code: `api`, `ui`, `lib`, `config`. `src/shared/`.

> Next.js routing folder `src/app/` is kept **thin** — `page.tsx` re-exports the matching
> view from `@/views/*`. See `pages.md`.

## The import rule (strict)

A module may only import from layers **below** it. Never sideways within the same layer,
never upward. `shared` imports nothing from other layers.

- ✅ `features/auth` → `entities/user` → `shared/api`
- ❌ `entities/user` → `features/auth` (upward)
- ❌ `features/auth` → `features/post` (sideways)

## Slices & segments

- Inside a layer, a **slice** is a folder per domain/feature (e.g. `entities/counter`).
- Inside a slice, **segments** group by purpose: `ui/`, `model/` (state, types), `api/`, `lib/`, `config/`.
- Each slice exposes a **public API** via `index.ts`. Import slices through their barrel
  (`@/entities/counter`), never reach into internals (`@/entities/counter/model/...`).

## Cross-cutting conventions

- **TypeScript**: no `any`; type exported functions and props. Import with `@/*` (→ `src/*`).
- **HTTP**: use the shared `api` instance from `@/shared/api`. Never call `axios` directly in components.
- **State**: Zustand stores live in a slice's `model` segment, named `useXxxStore`.
- **Env**: browser-exposed vars are prefixed `NEXT_PUBLIC_`; document new ones in `.env.example`. Secrets in `.env.local` (gitignored).
- **Checks**: before committing, `npx tsc --noEmit`, `npm run lint`, `npm run format:check` must pass. Prettier also runs on save via the PostToolUse hook.
