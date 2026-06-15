#!/usr/bin/env node
// PostToolUse hook: format the just-edited file with Prettier.
// Reads the tool-call JSON from stdin, never blocks an edit on failure.
import { execFileSync } from "node:child_process";

let raw = "";
process.stdin.on("data", (chunk) => (raw += chunk));
process.stdin.on("end", () => {
  try {
    const data = JSON.parse(raw || "{}");
    const filePath = data.tool_input?.file_path;
    if (!filePath) process.exit(0);
    if (!/\.(ts|tsx|js|jsx|mjs|cjs|css|json|md|mdx|html|ya?ml)$/.test(filePath)) {
      process.exit(0);
    }
    // --ignore-unknown + .prettierignore keep this safe for non-formattable paths.
    execFileSync("npx", ["prettier", "--write", "--ignore-unknown", filePath], {
      stdio: "ignore",
    });
  } catch {
    // Formatting must never block the edit — swallow everything.
  }
  process.exit(0);
});
