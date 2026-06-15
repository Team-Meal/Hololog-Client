---
description: Update the Claude Code harness (commands, rules, settings) for this repo.
argument-hint: [what to add or change]
---

Update this repo's `.claude/` harness based on: $ARGUMENTS

The harness lives in:

- `.claude/commands/*.md` — slash commands (natural-language prompts the model runs)
- `.claude/rules/*.md` — project conventions (`shared`, `components`, `pages`)
- `.claude/hooks/*.mjs` — executable hook scripts (Node ES modules)
- `.claude/settings.json` — permissions and hook registration
- `CLAUDE.md` — top-level project guide (self-contained, no `@` imports)

## Rules for editing the harness

- Harness docs (commands, rules, settings, CLAUDE.md) are written in **English**.
- Generated commit/PR **messages** stay in Korean (see `/commit`, `/pr`).
- Keep each command focused; reference `.claude/rules/*.md` instead of duplicating conventions.
- When changing `settings.json`, validate it parses (`node -e "JSON.parse(require('fs').readFileSync('.claude/settings.json','utf8'))"`).
- When adding a hook, ensure it never blocks the action on failure, and register it under the right `matcher`.
- After changes, summarize what changed and offer to commit via `/commit`.
