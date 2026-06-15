---
name: commit
description: Stage changes in logical units and create Korean Conventional Commits. Use when the user asks to commit changes, says "커밋해줘"/"commit", or wants logically split commits.
---

# Commit skill

Create clean commits that follow this repository's conventions.

## Procedure

1. **Inspect state** — run `git status --short` and `git diff` (both staged and unstaged) to understand what changed.
2. **Validate before committing** — the following must pass. Fix issues and retry, or tell the user if you cannot fix them.
   - `npx tsc --noEmit` (type check)
   - `npm run lint`
   - `npm run format:check` (run `npm run format` to fix when needed)
3. **Split into logical units** — separate unrelated concerns into separate commits. Stage selectively with `git add <path>`. Never mix unrelated changes in one commit.
4. **Write the commit message** — follow the rules below.
5. **Report** — show the created commits with `git log --oneline`. Push only when the user asks (use the `pr` skill or `git push`).

## Message rules (Korean Conventional Commits)

- The commit message body and summary are written in **Korean**, but the type prefix stays in English.
- Format: `<type>: <Korean summary>`.
- Types: `feat`, `fix`, `chore`, `refactor`, `docs`, `style`, `test`, `perf`, `ci`, `build`.
- Subject: imperative, concise (~50 chars), no trailing period.
- If a body is needed, add a blank line then explain what/why in Korean.
- Append this trailer to every commit message (after one blank line):

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

- Do not blanket-stage with `git add -A`; stage only the intended files.
- Make sure secret files (e.g. `.env.local`) are not staged — only `.env.example` is tracked.
- Always confirm the working directory is the repo root (`Hololog-Client`).
