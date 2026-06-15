# Routing & views

How the Next.js App Router maps onto the FSD `views` layer.

> Next.js 16 has breaking changes. Check `node_modules/next/dist/docs/` when unsure about an API.

## app/ is thin — views hold the composition

- `src/app/` contains **routing only**. A `page.tsx` should re-export the matching view:

  ```tsx
  // src/app/login/page.tsx
  export { LoginPage as default } from "@/views/login";
  export { metadata } from "@/views/login";
  ```

- The real page composition lives in `src/views/<route>/` — it assembles `widgets`,
  `features`, and `entities`. Views must not be imported by anything below them.

## App Router file conventions

- `page.tsx` (route UI), `layout.tsx` (shared shell), `loading.tsx` (suspense fallback),
  `error.tsx` (error boundary, `"use client"`), `not-found.tsx` (404).
- Route folders are lowercase; use route groups `(group)` and dynamic segments `[id]` as needed.

## Server-first data fetching

- Views/pages are Server Components — fetch on the server (`async` component) instead of client effects when possible.
- Use the `api` instance from `@/shared/api` on the server too; keep auth/token handling consistent.
- Reserve `"use client"` for genuinely interactive views.

## Metadata & UX states

- Export `metadata` (or `generateMetadata`) for per-route title/description — don't hardcode `<title>`.
- Provide `loading.tsx` / `error.tsx` for routes that fetch data; handle empty/error states explicitly.

## Async params

- In Next.js 16, `params` and `searchParams` are async — `await` them. Confirm the exact signature in the docs.
