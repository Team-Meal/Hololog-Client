---
description: Review the current diff for bugs and convention violations.
---

Review the current changes. Default to `git diff` (unstaged + staged); if the working tree is clean, review the last commit (`git show`).

## Checks

1. **Correctness** — logic bugs, missing error/loading states, unhandled promise rejections, race conditions, incorrect types (no `any` escape hatches).
2. **Conventions** — verify against `.claude/rules/`:
   - `shared.md` — HTTP via `api`, env var prefixes, imports/aliases
   - `components.md` — client/server boundaries, props typing, Tailwind usage
   - `pages.md` — App Router file conventions, metadata, data fetching
3. **Quality** — dead code, duplication, naming, accessibility on interactive elements.
4. **Safety** — no secrets/tokens committed, no `.env.local` staged.

## Output

Group findings by severity: **Blocking**, **Should fix**, **Nit**. For each, give `file:line`, the problem, and a concrete fix. If clean, say so plainly. Do not modify files unless the user asks.
