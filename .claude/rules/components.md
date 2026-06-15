# UI / component rules

How to build React components within the FSD structure.

## Where components live

- **Primitive, domain-agnostic UI** (Button, Input, Modal) → `src/shared/ui/`.
- **Domain/feature UI** → the `ui/` segment of its slice (e.g. `src/features/auth/ui/LoginForm.tsx`).
- Never put a domain component in `shared` — `shared` must not know about business entities.
- Expose a slice's components through its `index.ts`; import via the barrel (`@/features/auth`), not internals.

## Naming

- One component per file. Component and file use `PascalCase` (e.g. `LoginForm.tsx`).
- Hooks are `useXxx`, placed in the slice's `lib/` or `model/` segment (or `src/shared/lib/` if generic).

## Server vs Client

- Components are **Server Components by default**. Add `"use client"` only when the component
  needs state, effects, event handlers, or browser APIs.
- Keep `"use client"` at the leaves — push interactivity down so as much stays server-rendered as possible.

## Props & styling

- Type props with an explicit `interface`/`type`; no implicit `any`. Prefer composition (`children`) over many boolean flags.
- Use Tailwind utility classes; the Prettier Tailwind plugin sorts class order automatically.
- Avoid inline `style` unless the value is dynamic and can't be a class. Extract repeated class strings into a component.

## Data & state

- Fetch via the `api` instance from `@/shared/api`; don't call `axios` directly.
- Local UI state with `useState`; shared/domain state via a Zustand store in the slice's `model` segment.
- Always handle loading and error states for async data.
