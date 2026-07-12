#!/usr/bin/env node
"use strict";

const crypto = require("crypto");
const fs = require("fs");
const os = require("os");
const path = require("path");
const { spawnSync } = require("child_process");
const { ensureDir, readJSONSafe, readTextSafe, writeJson } = require("./lib");

const cli = parseArgs(process.argv.slice(2));
const projectRoot = cli.positionals[0] || process.cwd();
const reportFile = cli.positionals[1] || path.join(process.cwd(), ".context-harness", "shadow-context-library-report.md");
const jsonReportFile = cli["json-report"] || reportFile.replace(/\.md$/u, ".json");
const minimumCoverage = Number(cli["min-coverage"] || 1);
const contextIndex = path.join(__dirname, "context-index.js");
const queries = ["resume current task", "run tests", "deployment", "update context"];

main();

function main() {
  const repos = findRepos(projectRoot);
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "context-library-shadow-"));
  let results = [];
  try {
    results = repos.map((repo) => evaluateRepo(repo, tempRoot));
  } finally {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }

  const report = buildReport(repos, results);
  ensureDir(path.dirname(reportFile));
  fs.writeFileSync(reportFile, renderReport(report));
  writeJson(jsonReportFile, report);
  process.stdout.write(renderReport(report));

  const gateFailed = report.summary.errors > 0
    || report.summary.malformed > 0
    || report.summary.failed > 0
    || report.summary.coverage < minimumCoverage;
  if (gateFailed && (cli.gate || report.summary.errors > 0 || report.summary.failed > 0)) process.exit(1);
}

function findRepos(root) {
  const repos = [];
  walk(root, (dir) => {
    if (isRepoRoot(dir)) {
      repos.push(dir);
      return "prune";
    }
    return "continue";
  });
  return repos.sort();
}

function walk(dir, visit) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return;
  }
  if (visit(dir) === "prune") return;
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if ([".git", ".context-harness", "node_modules", ".cache", ".venv", "venv"].includes(entry.name)) continue;
    walk(path.join(dir, entry.name), visit);
  }
}

function isRepoRoot(dir) {
  return fs.existsSync(path.join(dir, ".git"));
}

function evaluateRepo(repo, tempRoot) {
  const relative = path.relative(projectRoot, repo) || path.basename(repo);
  const id = safeName(relative);
  const provenance = gitProvenance(repo);
  const contextExists = fs.existsSync(path.join(repo, "CONTEXT.md"));
  const harnessIndicators = contextExists
    || fs.existsSync(path.join(repo, "NOW.md"))
    || fs.existsSync(path.join(repo, "AGENTS.md"))
    || fs.existsSync(path.join(repo, ".context-harness"));
  const base = {
    id,
    repo: relative,
    status: "ineligible",
    reason: "no installed context harness",
    provenance,
    copied: [],
    cards: 0,
    chunks: 0,
    warnings: [],
    issues: [],
    commands: {},
    hydrates: [],
  };
  if (!harnessIndicators) return base;
  if (!contextExists) return { ...base, status: "malformed", reason: "harness indicators exist but CONTEXT.md is missing" };

  const required = ["CONTEXT.md", "NOW.md", "AGENTS.md"];
  const missing = required.filter((file) => !fs.existsSync(path.join(repo, file)));
  if (missing.length) return { ...base, status: "malformed", reason: `missing ${missing.join(", ")}` };

  const tempRepo = path.join(tempRoot, id);
  ensureDir(tempRepo);
  let copied;
  try {
    copied = copyContextSources(repo, tempRepo);
  } catch (error) {
    return { ...base, status: "error", reason: `copy failed: ${error.message}` };
  }

  const update = runNode(tempRepo, "update");
  if (update.status !== 0) {
    return { ...base, copied, status: "fail", reason: "update failed", commands: { update }, issues: [`update failed: ${firstLine(update.output)}`] };
  }
  const check = runNode(tempRepo, "check");
  const stats = runNode(tempRepo, "stats");
  const manifest = readJSONSafe(path.join(tempRepo, ".context-harness", "index.json"));
  const hydrates = queries.map((query) => ({ query, ...hydrate(tempRepo, query) }));
  const warnings = stats.output.split("\n").filter((line) => line.startsWith("WARN ") || /consider a .*pass/i.test(line));
  const issues = evaluateHydrates(copied, hydrates);
  if (check.status !== 0 && /(^|\n)FAIL /u.test(check.output)) issues.push(`check failed: ${firstLine(check.output)}`);
  if (!manifest) issues.push("manifest missing after update");
  if (manifest?.cards) issues.push(...cardQualityIssues(manifest.cards));

  return {
    ...base,
    copied,
    status: issues.length ? "fail" : "pass",
    reason: issues.length ? "structural or retrieval checks failed" : "",
    commands: { update, check, stats },
    cards: manifest?.cards?.length || 0,
    chunks: manifest?.cards?.filter((card) => card.chunk_path).length || 0,
    sourceHash: manifest?.source_hash || null,
    warnings,
    issues,
    hydrates,
  };
}

function copyContextSources(repo, tempRepo) {
  const copied = [];
  for (const file of ["AGENTS.md", "CONTEXT.md", "NOW.md", "PLAN.md"]) {
    const source = path.join(repo, file);
    if (!fs.existsSync(source)) continue;
    fs.copyFileSync(source, path.join(tempRepo, file));
    copied.push(file);
  }
  return copied;
}

function hydrate(tempRepo, query) {
  const result = runNode(tempRepo, "hydrate", query, ["--json"]);
  let payload = null;
  try {
    payload = JSON.parse(result.output);
  } catch {
    // Report the parse failure below.
  }
  return {
    status: result.status,
    cards: payload?.selected_cards?.map((card) => card.id) || [],
    excerpts: payload?.selected_cards?.flatMap((card) => card.excerpts || []) || [],
    parseable: Boolean(payload),
  };
}

function evaluateHydrates(copied, hydrates) {
  const issues = [];
  const byQuery = Object.fromEntries(hydrates.map((entry) => [entry.query, entry]));
  if (copied.includes("NOW.md") && !byQuery["resume current task"]?.cards.includes("ctx-now-now")) {
    issues.push("resume hydrate did not include NOW card");
  }
  if (!byQuery["run tests"]?.cards.includes("ctx-context-workflow")) issues.push("test hydrate did not include Workflow card");
  for (const entry of hydrates) {
    if (entry.status !== 0) issues.push(`hydrate failed for '${entry.query}'`);
    if (!entry.parseable) issues.push(`hydrate JSON was invalid for '${entry.query}'`);
    if (!entry.cards.length) issues.push(`hydrate returned no cards for '${entry.query}'`);
  }
  return issues;
}

function cardQualityIssues(cards) {
  const issues = [];
  const ids = new Set();
  for (const card of cards) {
    if (ids.has(card.id)) issues.push(`duplicate card id ${card.id}`);
    ids.add(card.id);
    const summary = normalize(card.summary);
    const facts = new Set();
    for (const fact of card.key_facts || []) {
      const normalized = normalize(fact);
      if (normalized === summary || normalized.startsWith(summary) || summary.startsWith(normalized)) issues.push(`summary/fact duplication in ${card.id}`);
      if (facts.has(normalized)) issues.push(`duplicate fact in ${card.id}`);
      facts.add(normalized);
    }
    if ((card.read_when || []).some((cue) => /update context (after|with|safely)/i.test(cue))) issues.push(`generic read_when cue in ${card.id}`);
  }
  return [...new Set(issues)];
}

function runNode(cwd, command, arg = "", extra = []) {
  const args = [contextIndex, command];
  if (arg) args.push(arg);
  args.push(...extra);
  const result = spawnSync(process.execPath, args, { cwd, encoding: "utf8" });
  return { status: result.status ?? 1, output: `${result.stdout || ""}${result.stderr || ""}`.trim() };
}

function gitProvenance(repo) {
  const revision = runGit(repo, ["rev-parse", "HEAD"]);
  const status = runGit(repo, ["status", "--porcelain"]);
  return {
    revision: revision.status === 0 ? revision.output : null,
    dirty: status.status === 0 ? Boolean(status.output) : null,
    statusReadable: status.status === 0,
  };
}

function runGit(cwd, args) {
  const result = spawnSync("git", args, { cwd, encoding: "utf8" });
  return { status: result.status ?? 1, output: `${result.stdout || ""}`.trim() };
}

function buildReport(repos, results) {
  const eligible = results.filter((result) => !["ineligible"].includes(result.status)).length;
  const evaluated = results.filter((result) => ["pass", "fail"].includes(result.status)).length;
  const count = (status) => results.filter((result) => result.status === status).length;
  return {
    schema: 2,
    evaluator: { sha256: sha256(readTextSafe(__filename)), contextIndexSha256: sha256(readTextSafe(contextIndex)) },
    queries,
    summary: {
      discovered: repos.length,
      eligible,
      evaluated,
      coverage: eligible ? evaluated / eligible : 1,
      passed: count("pass"),
      failed: count("fail"),
      malformed: count("malformed"),
      ineligible: count("ineligible"),
      errors: count("error"),
    },
    results,
    temporaryCopiesRemoved: true,
  };
}

function renderReport(report) {
  const s = report.summary;
  const lines = [
    "# Shadow Context Library Report",
    "",
    `Repos discovered: ${s.discovered}`,
    `Eligible: ${s.eligible} · Evaluated: ${s.evaluated} · Coverage: ${(s.coverage * 100).toFixed(1)}%`,
    `Pass: ${s.passed} · Fail: ${s.failed} · Malformed: ${s.malformed} · Ineligible: ${s.ineligible} · Error: ${s.errors}`,
    "",
    "| Repo | Status | Cards | Chunks | Hydrate cards | Issues |",
    "|---|---:|---:|---:|---|---|",
  ];
  for (const result of report.results) {
    const hydrateSummary = result.hydrates.length
      ? result.hydrates.map((entry) => `${entry.query}: ${entry.cards.slice(0, 3).join(", ") || "none"}`).join("<br>")
      : "n/a";
    const issues = result.issues.length ? result.issues.join("<br>") : (result.reason || "none");
    lines.push(`| \`${result.repo}\` | ${result.status} | ${result.cards} | ${result.chunks} | ${hydrateSummary} | ${issues} |`);
  }
  const actionable = report.results.filter((result) => !["pass", "ineligible"].includes(result.status));
  lines.push("", "## Actionable Gaps", "");
  if (!actionable.length) lines.push("No structural, coverage, or retrieval gaps were found.");
  else for (const result of actionable) lines.push(`- \`${result.repo}\` (${result.status}): ${result.issues.join("; ") || result.reason}`);
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function parseArgs(args) {
  const parsed = { positionals: [] };
  for (let i = 0; i < args.length; i += 1) {
    const value = args[i];
    if (!value.startsWith("--")) {
      parsed.positionals.push(value);
      continue;
    }
    const key = value.slice(2);
    if (["gate"].includes(key)) parsed[key] = true;
    else parsed[key] = args[++i];
  }
  return parsed;
}

function safeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "__") || "repo";
}

function normalize(value) {
  return String(value || "").toLowerCase().replace(/[^a-z0-9]+/gu, " ").trim();
}

function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

function firstLine(text) {
  return String(text || "").split("\n").find(Boolean) || "no output";
}
