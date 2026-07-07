#!/usr/bin/env node
"use strict";

// eval-context-library.js — shadow-test progressive context library behavior.
// Copies only context-harness files from each repo into temp dirs, then runs
// context-index.js update/check/stats/hydrate without mutating originals.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { ensureDir, readJSONSafe, readTextSafe, writeJson } = require("./lib");

const projectRoot = process.argv[2] || "/Users/lfan/Project";
const reportFile = process.argv[3] || path.join(process.cwd(), ".context-harness", "shadow-context-library-report.md");
const contextIndex = path.join(__dirname, "context-index.js");
const queries = ["resume current task", "run tests", "deployment", "update context"];

main();

function main() {
  const repos = findRepos(projectRoot);
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "context-library-shadow-"));
  const results = [];

  for (const repo of repos) results.push(evaluateRepo(repo, tempRoot));

  const report = renderReport(projectRoot, repos, results, tempRoot);
  ensureDir(path.dirname(reportFile));
  fs.writeFileSync(reportFile, report);
  process.stdout.write(report);

  const failures = results.filter((result) => result.status === "fail");
  if (failures.length) process.exit(1);
}

function findRepos(root) {
  const repos = [];
  const seen = new Set();
  walk(root, (dir) => {
    if (seen.has(dir)) return "prune";
    if (isRepoRoot(dir)) {
      seen.add(dir);
      repos.push(dir);
      return "prune";
    }
    return "continue";
  });
  return repos.sort();
}

function walk(dir, visit) {
  let entries = [];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }

  const decision = visit(dir);
  if (decision === "prune") return;

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (entry.name === ".git" || entry.name === "node_modules" || entry.name === ".cache" || entry.name === ".venv") continue;
    walk(path.join(dir, entry.name), visit);
  }
}

function isRepoRoot(dir) {
  return fs.existsSync(path.join(dir, ".git"));
}

function evaluateRepo(repo, tempRoot) {
  const relative = path.relative(projectRoot, repo) || path.basename(repo);
  const tempRepo = path.join(tempRoot, safeName(relative));
  ensureDir(tempRepo);

  const copied = copyContextFiles(repo, tempRepo);
  const base = {
    repo,
    relative,
    tempRepo,
    copied,
    status: "skip",
    skipReason: "missing CONTEXT.md",
    cards: 0,
    chunks: 0,
    warnings: [],
    issues: [],
    hydrates: [],
  };

  if (!copied.includes("CONTEXT.md")) return base;
  if (!copied.includes("NOW.md")) return { ...base, skipReason: "missing NOW.md" };
  if (!copied.includes("AGENTS.md")) base.issues.push("missing AGENTS.md");

  const update = runNode(tempRepo, "update");
  if (update.status !== 0) return { ...base, status: "fail", update, skipReason: "", issues: [...base.issues, `update failed: ${firstLine(update.output)}`] };

  const check = runNode(tempRepo, "check");
  const stats = runNode(tempRepo, "stats");
  const manifest = readJSONSafe(path.join(tempRepo, ".context-harness", "index.json"));
  const hydrates = queries.map((query) => ({ query, ...hydrate(tempRepo, query) }));
  const warnings = stats.output.split("\n").filter((line) => line.startsWith("- ") && /warn|consider|large|lines/i.test(line));
  const issues = [...base.issues, ...evaluateHydrates(copied, hydrates)];

  if (check.status !== 0) issues.push(`check failed: ${firstLine(check.output)}`);
  if (!manifest) issues.push("manifest missing after update");
  if (manifest?.cards) issues.push(...duplicateCardIssues(manifest.cards));

  return {
    ...base,
    status: check.status === 0 && issues.length === 0 ? "pass" : "warn",
    skipReason: "",
    check,
    stats,
    cards: manifest?.cards?.length || 0,
    chunks: manifest?.cards?.filter((card) => card.chunk_path).length || 0,
    warnings,
    issues,
    hydrates,
  };
}

function copyContextFiles(repo, tempRepo) {
  const files = ["AGENTS.md", "CONTEXT.md", "NOW.md", "PLAN.md"];
  const copied = [];
  for (const file of files) {
    const source = path.join(repo, file);
    if (!fs.existsSync(source)) continue;
    fs.copyFileSync(source, path.join(tempRepo, file));
    copied.push(file);
  }

  const existingLibrary = path.join(repo, ".context-harness");
  if (fs.existsSync(existingLibrary)) copyDirectory(existingLibrary, path.join(tempRepo, ".context-harness"));
  return copied;
}

function copyDirectory(source, target) {
  ensureDir(target);
  for (const entry of fs.readdirSync(source, { withFileTypes: true })) {
    if (entry.name === "DREAM.md") continue;
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

function hydrate(tempRepo, query) {
  const result = runNode(tempRepo, "hydrate", query);
  return {
    status: result.status,
    cards: parseHydrateCards(result.output),
    output: result.output,
  };
}

function parseHydrateCards(output) {
  const cards = [];
  for (const line of output.split("\n")) {
    const listed = line.match(/^\s*(?:-|\d+\.)\s+(ctx-[^\s,(]+)/);
    if (listed) cards.push(listed[1]);
    const selected = line.match(/^\s*-\s*selected_cards:\s*(.+)$/);
    if (selected) {
      cards.push(...selected[1].split(",").map((item) => item.trim()).filter((item) => item.startsWith("ctx-")));
    }
  }
  return [...new Set(cards)];
}

function evaluateHydrates(copied, hydrates) {
  const issues = [];
  const resume = hydrates.find((entry) => entry.query === "resume current task");
  const tests = hydrates.find((entry) => entry.query === "run tests");
  const deploy = hydrates.find((entry) => entry.query === "deployment");
  const maintain = hydrates.find((entry) => entry.query === "update context");

  if (copied.includes("NOW.md") && resume && !resume.cards.includes("ctx-now-now")) {
    issues.push("resume hydrate did not include NOW card");
  }
  if (tests && !tests.cards.includes("ctx-context-workflow")) {
    issues.push("test hydrate did not include Workflow card");
  }
  if (deploy && !deploy.cards.includes("ctx-context-workflow")) {
    issues.push("deployment hydrate did not include Workflow card");
  }
  if (maintain && !maintain.cards.some((card) => card === "ctx-context-operating-constraints" || card === "ctx-context-rules" || card === "ctx-context-learned-patterns" || card === "ctx-now-now")) {
    issues.push("context maintenance hydrate lacked operating constraints, learned patterns, or NOW card");
  }
  for (const entry of hydrates) {
    if (entry.status !== 0) issues.push(`hydrate failed for '${entry.query}'`);
    if (!entry.cards.length) issues.push(`hydrate returned no cards for '${entry.query}'`);
  }
  return issues;
}

function duplicateCardIssues(cards) {
  const seen = new Set();
  const duplicates = new Set();
  for (const card of cards) {
    if (seen.has(card.id)) duplicates.add(card.id);
    seen.add(card.id);
  }
  return [...duplicates].map((id) => `duplicate card id ${id}`);
}

function runNode(cwd, command, arg = "") {
  const args = [contextIndex, command];
  if (arg) args.push(arg);
  const result = spawnSync(process.execPath, args, { cwd, encoding: "utf8" });
  return {
    status: result.status ?? 1,
    output: `${result.stdout || ""}${result.stderr || ""}`.trim(),
  };
}

function renderReport(root, repos, results, tempRoot) {
  const pass = results.filter((result) => result.status === "pass").length;
  const warn = results.filter((result) => result.status === "warn").length;
  const fail = results.filter((result) => result.status === "fail").length;
  const skip = results.filter((result) => result.status === "skip").length;
  const lines = [
    "# Shadow Context Library Report",
    "",
    `Root: \`${root}\``,
    `Temporary copies: \`${tempRoot}\``,
    "",
    `Repos found: ${repos.length}`,
    `Pass: ${pass} · Warn: ${warn} · Fail: ${fail} · Skip: ${skip}`,
    "",
    "| Repo | Status | Cards | Chunks | Hydrate cards | Issues |",
    "|---|---:|---:|---:|---|---|",
  ];

  for (const result of results) {
    const hydrateSummary = result.hydrates.length
      ? result.hydrates.map((entry) => `${entry.query}: ${entry.cards.slice(0, 3).join(", ") || "none"}`).join("<br>")
      : "n/a";
    const issues = result.status === "skip" ? result.skipReason : (result.issues.join("<br>") || "none");
    lines.push(`| \`${result.relative}\` | ${result.status} | ${result.cards} | ${result.chunks} | ${hydrateSummary} | ${issues} |`);
  }

  const actionable = results.filter((result) => result.status === "warn" || result.status === "fail");
  lines.push("", "## Actionable Gaps", "");
  if (!actionable.length) {
    lines.push("No easy-to-fix gaps identified by this shadow run.");
  } else {
    for (const result of actionable) {
      lines.push(`- \`${result.relative}\`: ${result.issues.join("; ") || result.skipReason}`);
    }
  }

  lines.push("");
  return `${lines.join("\n")}\n`;
}

function safeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "__") || "repo";
}

function firstLine(text) {
  return String(text || "").split("\n").find(Boolean) || "no output";
}
