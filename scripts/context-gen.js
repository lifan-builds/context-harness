#!/usr/bin/env node
"use strict";

// context-gen.js — auto-detect project metadata and emit CONTEXT.md sections.
// Usage: node scripts/context-gen.js [project-root]
// Output: Project + Structure + Suggested Rules markdown to stdout.

const fs = require("fs");
const path = require("path");
const { detectStack } = require("./lib");

const root = path.resolve(process.argv[2] || ".");
const stack = detectStack(root);

// --- Project section --------------------------------------------------------

const parts = [stack.lang];
if (stack.framework) parts[0] = `${stack.lang} / ${stack.framework}`;
if (stack.tools.length) parts.push(stack.tools.join(", "));
const stackLine = parts.join(" + ");

let projectSentence = `${stack.name} is a ${stackLine} project.`;
if (stack.description) {
  projectSentence = `${stack.name} is a ${stackLine} project. ${stack.description}.`;
}

console.log("## Project");
console.log(projectSentence);
console.log("");

// --- Structure section ------------------------------------------------------

console.log("## Structure");
console.log("```");
for (const line of renderTree(root, 2)) console.log(line);
console.log("```");
console.log("");

// --- Suggested Rules section ------------------------------------------------

const rules = suggestedRules(stack);
console.log("## Suggested Rules");
console.log("");
console.log(`_Detected stack: ${stack.lang}${stack.framework ? ` / ${stack.framework}` : ""}. Present these to the user to confirm or edit._`);
console.log("");
console.log("### Never");
rules.never.forEach((r, i) => console.log(`${i + 1}. ${r}`));
console.log("");
console.log("### Always");
rules.always.forEach((r, i) => console.log(`${i + 1}. ${r}`));
console.log("");
console.log("### Objectives");
rules.objectives.forEach((r, i) => console.log(`${i + 1}. ${r}`));

// ---------------------------------------------------------------------------

function renderTree(dir, maxDepth) {
  const skip = new Set([
    ".git",
    "node_modules",
    "__pycache__",
    ".next",
    "dist",
    "build",
    ".venv",
    "venv",
    "target",
    ".tox",
    ".mypy_cache",
    ".pytest_cache",
    ".turbo",
  ]);
  const lines = ["."];
  walk(dir, 0);
  return lines;

  function walk(current, depth) {
    if (depth >= maxDepth) return;
    let entries;
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      return;
    }
    const dirs = entries
      .filter((e) => e.isDirectory() && !skip.has(e.name))
      .map((e) => e.name)
      .sort();
    for (const name of dirs) {
      lines.push(`${"  ".repeat(depth)}${name}/`);
      walk(path.join(current, name), depth + 1);
    }
  }
}

function suggestedRules(stack) {
  const commonNever = [
    "Never commit directly to main without a PR",
    "Never ignore failing tests",
  ];
  const commonAlways = ["Always handle errors explicitly (no silent catches)"];
  const commonObj = ["Code follows existing patterns in the codebase"];

  const tsLike = (testCmd) => ({
    never: ["Never weaken `strict` mode in tsconfig.json", ...commonNever],
    always: [
      "Always run `tsc --noEmit` before committing",
      "Always write tests for new public functions",
      ...commonAlways,
    ],
    objectives: [
      `All tests pass (${testCmd} exits 0)`,
      "No type errors (npx tsc --noEmit exits 0)",
      ...commonObj,
    ],
  });

  switch (stack.lang) {
    case "TypeScript":
      return tsLike(testCmdForNode(stack));
    case "Node.js":
      return {
        never: [
          "Never use `any` without a TODO justification",
          ...commonNever,
        ],
        always: [
          "Always run the linter before committing",
          "Always write tests for new public functions",
          ...commonAlways,
        ],
        objectives: [
          `All tests pass (${testCmdForNode(stack)} exits 0)`,
          ...commonObj,
        ],
      };
    case "Python":
      return {
        never: ["Never catch bare `Exception` without re-raising", ...commonNever],
        always: [
          "Always type-annotate public functions",
          "Always run `ruff check` before committing",
          ...commonAlways,
        ],
        objectives: [
          "All tests pass (pytest exits 0)",
          "No lint errors (ruff check exits 0)",
          ...commonObj,
        ],
      };
    case "Go":
      return {
        never: ["Never ignore returned errors", ...commonNever],
        always: [
          "Always run `go vet` before committing",
          "Always write table-driven tests",
          ...commonAlways,
        ],
        objectives: [
          "All tests pass (go test ./... exits 0)",
          "No vet errors (go vet ./... exits 0)",
          ...commonObj,
        ],
      };
    case "Rust":
      return {
        never: ["Never use `unwrap()` on untrusted input", ...commonNever],
        always: [
          "Always run `cargo clippy` before committing",
          ...commonAlways,
        ],
        objectives: [
          "All tests pass (cargo test exits 0)",
          "No clippy warnings (cargo clippy -- -D warnings exits 0)",
          ...commonObj,
        ],
      };
    case "Ruby":
      return {
        never: ["Never rescue `StandardError` without re-raising", ...commonNever],
        always: ["Always run `rubocop` before committing", ...commonAlways],
        objectives: [
          "All tests pass (bundle exec rspec exits 0)",
          ...commonObj,
        ],
      };
    default:
      return {
        never: [...commonNever, "Never disable or weaken type checking"],
        always: [
          ...commonAlways,
          "Always run the linter before committing",
          "Always write tests for new public functions",
        ],
        objectives: [...commonObj, "All tests pass", "Code compiles without errors"],
      };
  }
}

function testCmdForNode(stack) {
  if (stack.tools.includes("Vitest")) return "npx vitest run";
  if (stack.tools.includes("Jest")) return "npx jest";
  return "npm test";
}
