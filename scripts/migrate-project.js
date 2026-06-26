#!/usr/bin/env node
"use strict";

// migrate-project.js — batch migrate context-harness repos to schema v3.
// Dry-run by default. Use --write to apply changes.
// Usage: node scripts/migrate-project.js --root /path/to/projects [--write] [--include-dirty]

const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const sourceDir = __dirname;
const args = parseArgs(process.argv.slice(2));
const projects = findContextProjects(args.root);

let changed = 0;
let skipped = 0;

for (const project of projects) {
  const result = migrateProject(project, args);
  if (result.status === "skipped") skipped += 1;
  if (result.changed) changed += 1;
  printResult(project, result, args.write);
}

console.log(`${args.write ? "Migrated" : "Dry-run"} ${changed} project(s); skipped ${skipped}.`);

// ---------------------------------------------------------------------------

function parseArgs(argv) {
  let root = process.cwd();
  let write = false;
  let includeDirty = false;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "--root") {
      root = argv[i + 1] || "";
      i++;
    } else if (arg === "--write") {
      write = true;
    } else if (arg === "--include-dirty") {
      includeDirty = true;
    } else if (arg === "--help" || arg === "-h") {
      usage(0);
    } else {
      console.error(`Unknown argument: ${arg}`);
      usage(1);
    }
  }

  if (!root) usage(1);
  return { root: path.resolve(root), write, includeDirty };
}

function usage(code) {
  console.error("Usage: node scripts/migrate-project.js --root <path> [--write] [--include-dirty]");
  process.exit(code);
}

function findContextProjects(root) {
  const out = [];
  const skip = new Set([
    ".git",
    ".agent",
    ".agents",
    ".claude",
    ".codex",
    ".cursor",
    ".gemini",
    ".nexus",
    "node_modules",
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

  walk(root);
  return out.sort();

  function walk(dir) {
    let entries;
    try {
      entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch {
      return;
    }

    const names = new Set(entries.map((entry) => entry.name));
    if (names.has("CONTEXT.md") && (names.has("AGENTS.md") || names.has("NOW.md"))) {
      out.push(dir);
    }

    for (const entry of entries) {
      if (!entry.isDirectory() || skip.has(entry.name)) continue;
      walk(path.join(dir, entry.name));
    }
  }
}

function migrateProject(project, options) {
  if (!options.includeDirty && isDirtyGitWorktree(project)) {
    return { status: "skipped", reason: "dirty git worktree", changed: false, actions: [] };
  }

  const contextFile = path.join(project, "CONTEXT.md");
  const agentsFile = path.join(project, "AGENTS.md");
  const context = readText(contextFile);
  if (!hasSupportedSchema(context)) {
    return { status: "skipped", reason: "missing supported schema marker", changed: false, actions: [] };
  }

  const actions = [];
  let nextContext = context.replace(/context-harness:schema v2/g, "context-harness:schema v3");
  const objectiveResult = migrateObjectives(nextContext);
  nextContext = objectiveResult.context;
  actions.push(...objectiveResult.actions);

  let nextAgents = readText(agentsFile);
  if (nextAgents) {
    const upgraded = nextAgents.replace(/context-harness:schema v2/g, "context-harness:schema v3");
    if (upgraded !== nextAgents) {
      nextAgents = upgraded;
      actions.push("upgrade AGENTS.md schema marker to v3");
    }
  }

  if (nextContext !== context) actions.unshift("upgrade CONTEXT.md schema/content to v3");

  if (!actions.length) {
    return { status: "ok", changed: false, actions: ["already up to date"] };
  }

  if (options.write) {
    fs.writeFileSync(contextFile, ensureTrailingNewline(nextContext));
    if (nextAgents) fs.writeFileSync(agentsFile, ensureTrailingNewline(nextAgents));
    refreshAgents(project);
    const install = installCoreScripts(project);
    actions.push(`install core scripts: ${install.copied} copied, ${install.skipped} skipped`);
  }

  return { status: "ok", changed: true, actions };
}

function migrateObjectives(context) {
  const lines = context.split("\n");
  const out = [];
  const actions = [];
  const verificationEntries = [];
  let manualCount = 0;
  let migrated = false;

  for (let i = 0; i < lines.length; i++) {
    if (!/^###\s+Objectives\s*$/.test(lines[i])) {
      out.push(lines[i]);
      continue;
    }

    migrated = true;
    const body = [];
    let j = i + 1;
    while (j < lines.length && !/^#{2,3}\s+/.test(lines[j])) {
      body.push(lines[j]);
      j++;
    }

    const manual = [];
    const commandCountBefore = verificationEntries.length;
    for (const raw of body) {
      const line = raw.trim();
      if (!line || line.startsWith("<!--")) continue;
      const objective = line.replace(/^\d+\.\s*/, "").trim();
      if (!objective) continue;
      const command = parseCommandObjective(objective);
      if (command) verificationEntries.push(command);
      else manual.push(objective);
    }

    if (manual.length) {
      manualCount += manual.length;
      out.push("### Legacy Objectives");
      out.push("<!-- Deprecated in schema v3. Preserve as project intent; use PLAN.md Done Criteria and Workflow Verification for active checks. -->");
      manual.forEach((entry, index) => out.push(`${index + 1}. ${entry}`));
      out.push("");
      actions.push(`preserve ${manual.length} manual Objective(s) as Legacy Objectives`);
    }

    const movedCommands = verificationEntries.length - commandCountBefore;
    if (movedCommands > 0) {
      actions.push(`move ${movedCommands} command Objective(s) to Workflow Verification`);
    }

    i = j - 1;
  }

  let next = out.join("\n");
  if (verificationEntries.length) next = addVerificationEntries(next, verificationEntries);
  if (migrated && !verificationEntries.length && manualCount === 0) {
    actions.push("remove empty Objective section");
  }
  return { context: next, actions };
}

function parseCommandObjective(objective) {
  const match = objective.match(/^(.*?)\s*\((.+)\s+exits\s+(\d+)\)\s*$/);
  if (!match) return null;
  return {
    text: match[1].trim(),
    command: match[2].trim(),
    expected: match[3].trim(),
  };
}

function addVerificationEntries(context, entries) {
  const lines = context.split("\n");
  const workflowIndex = lines.findIndex((line) => /^##\s+Workflow\s*$/.test(line));
  const entryLines = entries.map((entry) => `- ${entry.text} (\`${entry.command}\` exits ${entry.expected})`);

  if (workflowIndex === -1) {
    const insertAt = firstH2Index(lines, "Language");
    const block = ["## Workflow", "### Verification", ...entryLines, ""];
    if (insertAt === -1) return [...lines, "", ...block].join("\n");
    return [...lines.slice(0, insertAt), ...block, ...lines.slice(insertAt)].join("\n");
  }

  const workflowEnd = nextH2Index(lines, workflowIndex + 1);
  const verificationIndex = findHeadingBetween(lines, "Verification", workflowIndex + 1, workflowEnd);
  const newLines = [...lines];

  if (verificationIndex === -1) {
    const insertAt = workflowEnd === -1 ? newLines.length : workflowEnd;
    newLines.splice(insertAt, 0, "", "### Verification", ...entryLines);
    return newLines.join("\n");
  }

  const verificationEnd = nextHeadingIndex(newLines, verificationIndex + 1, 3);
  let insertAt = verificationEnd === -1 ? newLines.length : verificationEnd;
  for (const line of entryLines) {
    if (!newLines.includes(line)) {
      newLines.splice(insertAt, 0, line);
      insertAt += 1;
    }
  }
  return newLines.join("\n");
}

function firstH2Index(lines, title) {
  return lines.findIndex((line) => line === `## ${title}`);
}

function nextH2Index(lines, start) {
  for (let i = start; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) return i;
  }
  return -1;
}

function findHeadingBetween(lines, title, start, end) {
  const limit = end === -1 ? lines.length : end;
  const re = new RegExp(`^###\\s+${escapeRegExp(title)}\\s*$`);
  for (let i = start; i < limit; i++) {
    if (re.test(lines[i])) return i;
  }
  return -1;
}

function nextHeadingIndex(lines, start, maxDepth) {
  for (let i = start; i < lines.length; i++) {
    const match = lines[i].match(/^(#{2,6})\s+/);
    if (match && match[1].length <= maxDepth) return i;
  }
  return -1;
}

function installCoreScripts(project) {
  const scriptNames = [
    "codex-context-hook.js",
    "context-gen.js",
    "context-index.js",
    "format-on-edit.js",
    "guard.js",
    "install-project.js",
    "lib.js",
    "session-end.js",
    "task.js",
  ];
  const targetDir = path.join(project, "scripts");
  fs.mkdirSync(targetDir, { recursive: true });

  let copied = 0;
  let skipped = 0;
  for (const name of scriptNames) {
    const source = path.join(sourceDir, name);
    const target = path.join(targetDir, name);
    if (!fs.existsSync(source)) continue;
    const next = readText(source);
    const current = readText(target);
    if (!current || current === next || isContextHarnessRuntime(current, name)) {
      fs.writeFileSync(target, next);
      copied += 1;
    } else {
      skipped += 1;
    }
  }
  const packageJsonTarget = path.join(targetDir, "package.json");
  const packageJsonContent = `${JSON.stringify({
    private: true,
    type: "commonjs",
    description: "context-harness runtime scripts"
  }, null, 2)}\n`;
  const existingPackage = readText(packageJsonTarget);
  if (!existingPackage || readPackageType(existingPackage) !== "commonjs") {
    fs.writeFileSync(packageJsonTarget, packageJsonContent);
    copied += 1;
  }
  return { copied, skipped };
}

function refreshAgents(project) {
  execFileSync(process.execPath, [path.join(sourceDir, "context-index.js"), "update"], {
    cwd: project,
    stdio: "ignore",
  });
}

function isDirtyGitWorktree(project) {
  if (!fs.existsSync(path.join(project, ".git"))) return false;
  try {
    const out = execFileSync("git", ["-C", project, "status", "--short"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    return out.trim().length > 0;
  } catch {
    return true;
  }
}

function printResult(project, result, write) {
  const prefix = result.status === "skipped" ? "SKIP" : write ? "WRITE" : "DRY-RUN";
  const suffix = result.reason ? ` (${result.reason})` : "";
  console.log(`${prefix} ${project}${suffix}`);
  for (const action of result.actions || []) console.log(`  - ${action}`);
}

function hasSupportedSchema(text) {
  return /<!--\s*context-harness:schema\s+v[23]\s*-->/.test(text);
}

function readText(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function readPackageType(text) {
  try {
    return JSON.parse(text).type || "";
  } catch {
    return "";
  }
}

function isContextHarnessRuntime(text, name) {
  return text.includes("context-harness")
    || text.includes(`${name} —`)
    || text.includes(`${name} -`);
}

function ensureTrailingNewline(text) {
  return `${text.trimEnd()}\n`;
}

function escapeRegExp(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
