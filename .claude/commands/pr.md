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
3. Build the body from the repo's PR template `.github/PULL_REQUEST_TEMPLATE.md`:
   - Keep its sections (💡 PR 요약 / 📋 작업 내용 / 🤝 리뷰 시 참고사항).
   - Replace the `>` guide lines and `{변경사항}` placeholders with the actual content in Korean.
   - Delete any section that doesn't apply (the template says so).
   - Append `🤖 Generated with [Claude Code](https://claude.com/claude-code)` at the end.
4. Create the PR (write the filled body to a temp file and pass it):

```bash
gh pr create --base main --head <branch> --title "<type>: <Korean title>" --body-file /tmp/pr-body.md
```

5. Show the resulting PR URL to the user.

## Rules

- Title uses Conventional Commits format with a Korean summary.
- Body is Korean and **based on `.github/PULL_REQUEST_TEMPLATE.md`** — fill its sections, don't invent a different structure.
- This is outward-facing — double-check head branch and base right before pushing/creating.
