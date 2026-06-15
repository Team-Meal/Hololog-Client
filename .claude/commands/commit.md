---
description: Stage changes in logical units and create Korean Conventional Commits.
---

Create clean commits following this repository's conventions.

## Procedure

1. **Inspect state** — run `git status --short` and `git diff` (staged and unstaged) to understand what changed.
2. **Validate** — these must pass before committing; fix and retry, or tell the user if you cannot fix them:
   - `npx tsc --noEmit`
   - `npm run lint`
   - `npm run format:check` (run `npm run format` to fix)
3. **Split into logical units** — separate unrelated concerns into separate commits. Stage selectively with `git add <path>`; never `git add -A` blindly.
4. **Write the message** — see rules below.
5. **Report** — show created commits with `git log --oneline`. Push only when the user asks (use `/pr`).

## Message rules (Korean Conventional Commits)

- Summary and body are written in **Korean**; the type prefix stays English.
- Format: `<type>: <Korean summary>` — types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`, `perf`, `ci`, `build`.
- Subject: imperative, ~50 chars, no trailing period.
- Append this trailer after one blank line:

```
Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

### Example

```
feat: 로그인 폼에 이메일 검증 추가

zod 스키마로 이메일 형식을 검사하고 에러 메시지를 노출한다.

Co-Authored-By: Claude Opus 4.8 (1M context) <noreply@anthropic.com>
```

## Cautions

- Ensure secret files (`.env.local`) are not staged — only `.env.example` is tracked.
- Confirm the working directory is the repo root (`Hololog-Client`).
