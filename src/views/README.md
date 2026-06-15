# views (FSD `pages` layer, renamed)

Page-level compositions, one slice per route. A view assembles `widgets`, `features`,
and `entities` into a full screen. Next.js route files in `src/app/` should be thin and
re-export the matching view from here (e.g. `src/app/login/page.tsx` → `@/views/login`).

Renamed from FSD's `pages` to avoid confusion with Next.js routing.
