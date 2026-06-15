---
name: pr
description: Create a GitHub pull request with the gh CLI. Use when the user asks to open a PR, says "PR 올려줘"/"PR 만들어줘", or wants to push a branch and open a PR.
---

# PR skill

Create a pull request with the `gh` CLI. PR title and body are written in Korean.

## Pre-checks

1. Run `gh auth status` to confirm auth and write access. On a 403/permission error, stop and tell the user (this repo has had a permission issue).
2. Check the current branch: `git branch --show-current`.
   - If on `main`/`master`, create a working branch first: `git switch -c <type>/<summary>` (e.g. `feat/login-form`).
3. Ensure commits are clean (use the `commit` skill if needed).

## Procedure

1. Push to remote: `git push -u origin <branch>`.
2. Determine the base branch (usually `main`). If unsure, run `gh repo view --json defaultBranchRef`.
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

- Title uses Conventional Commits format (`feat:`, `fix:` …) with a Korean summary.
- Body is in Korean, based on the template above (요약/변경 사항/테스트).
- Append the `🤖 Generated with` line at the end of the PR body.
- This is an outward-facing action — double-check the head branch and base right before pushing/creating the PR.
