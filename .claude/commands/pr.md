---
description: Open a GitHub pull request with the gh CLI (Korean title/body).
---

Create a pull request with `gh`. PR title and body are written in Korean.

## Pre-checks

1. `gh auth status` — confirm auth and write access. On a 403/permission error, stop and tell the user (this repo has had a permission issue).
2. `git branch --show-current` — if on `main`/`master`, create a working branch first: `git switch -c <type>/<summary>` (e.g. `feat/login-form`).
3. Ensure commits are clean (use `/commit` if needed).

## Procedure

1. Push: `git push -u origin <branch>`.
2. Determine base branch (usually `main`); if unsure, `gh repo view --json defaultBranchRef`.
3. Create the PR:

```bash
gh pr create --base main --head <branch> --title "<type>: <Korean title>" --body "$(cat <<'EOF'
## 요약
- 무엇을 왜 바꿨는지 한국어로 1~3줄.

## 변경 사항
- 핵심 변경 항목 나열

## 테스트
- [ ] `npx tsc --noEmit`
- [ ] `npm run lint`
- [ ] 로컬 동작 확인

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

4. Show the resulting PR URL to the user.

## Rules

- Title uses Conventional Commits format with a Korean summary.
- Body is Korean, based on the template above (요약/변경 사항/테스트).
- This is outward-facing — double-check head branch and base right before pushing/creating.
