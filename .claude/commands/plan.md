---
description: Produce an implementation plan before writing code.
argument-hint: [feature or task description]
---

Plan the implementation for: $ARGUMENTS

Do **not** write code yet. Produce a concrete plan:

1. **Understand** — restate the goal in one or two lines. Note any ambiguity worth clarifying.
2. **Survey** — find the files, routes, components, and stores this touches. Read the relevant `.claude/rules/*.md` for conventions (`shared`, `components`, `pages`).
3. **Design** — outline the approach:
   - New/changed files (with paths) and what each does
   - State (Zustand) and data flow (`api` from `src/lib/axios.ts`)
   - Edge cases, loading/error states, and types
4. **Steps** — an ordered, checkable task list small enough to review.
5. **Risks** — anything uncertain, or that needs a product/design decision.

Keep it tight and skimmable. End by asking whether to proceed or adjust.
