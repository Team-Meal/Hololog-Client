# Hololog Client

Frontend client for Hololog. Next.js (App Router) + TypeScript + Tailwind CSS v4.

> **Next.js 16 note**: This version has breaking changes — APIs, conventions, and file
> structure may differ from older versions. Read the relevant guide in
> `node_modules/next/dist/docs/` before writing app code. Heed deprecation notices.

## Stack

- **Next.js 16** (App Router, `src/` dir, `@/*` import alias)
- **TypeScript**, **Tailwind CSS v4**
- **State**: Zustand (`src/store/`)
- **HTTP**: Axios — shared instance in `src/lib/axios.ts` (`api`)
- **Lint/Format**: ESLint (`eslint-config-next` + `eslint-config-prettier`) and Prettier

## Project layout

- `src/app/` — App Router routes, layouts, pages
- `src/lib/` — shared utilities and clients (e.g. `axios.ts`)
- `src/store/` — Zustand stores (`useXxxStore` naming)
- `public/` — static assets

## Commands

- `npm run dev` — start dev server
- `npm run build` / `npm run start` — production build / serve
- `npm run lint` — ESLint
- `npm run format` / `npm run format:check` — Prettier write / check
- `npx tsc --noEmit` — type check

## Conventions

- Use the shared `api` instance from `src/lib/axios.ts` for HTTP; don't call `axios` directly in components.
- Env vars exposed to the browser must be prefixed `NEXT_PUBLIC_`. See `.env.example`; put real values in `.env.local` (gitignored).
- Before committing, ensure `npx tsc --noEmit`, `npm run lint`, and `npm run format:check` pass.

## Git workflow

- Commits follow Conventional Commits with a Korean summary, e.g. `feat: 로그인 폼 추가`. Use the `/commit` skill.
- PRs use the `/pr` skill (Korean title/body). Confirm branch and base before pushing.
