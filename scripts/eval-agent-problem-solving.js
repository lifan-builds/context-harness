#!/usr/bin/env node
"use strict";

// eval-agent-problem-solving.js — prepare and score real-world fresh-agent evals.
// The harness compares source-only agents with context-harness agents in isolated
// repo copies. It prepares prompts and deterministic expectations; humans or a
// separate fresh-agent runner can fill result.md, then `score` renders deltas.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const {
  ensureDir,
  readJSONSafe,
  readSection,
  readTextSafe,
  writeJson,
  today,
} = require("./lib");

const command = process.argv[2] || "help";
const contextIndex = path.join(__dirname, "context-index.js");
const defaultProjectRoot = "/Users/lfan/Project";
const defaultEvalRoot = path.join(process.cwd(), ".context-harness", "evals");
const modes = ["no-harness", "progressive-harness"];
const defaultScenarios = ["cold-resume", "next-step", "context-maintenance"];
const skipDirs = new Set([
  ".git",
  ".context-harness",
  "node_modules",
  ".cache",
  ".venv",
  "venv",
  "dist",
  "build",
  ".next",
  "coverage",
  "target",
]);
const contextFiles = new Set(["AGENTS.md", "CONTEXT.md", "NOW.md", "PLAN.md"]);

main();

function main() {
  if (command === "prepare") return prepare();
  if (command === "score") return score();
  usage();
}

function prepare() {
  const args = parseArgs(process.argv.slice(3));
  const projectRoot = path.resolve(args._[0] || defaultProjectRoot);
  const scenarios = splitList(args.scenarios, defaultScenarios);
  const selectedRepos = splitList(args.repos, []);
  const sample = args.sample ? Number(args.sample) : 0;
  const runId = args.runId || `${today()}-${timestampSuffix()}`;
  const runDir = path.resolve(args.output || path.join(defaultEvalRoot, runId));

  const repos = findRepos(projectRoot)
    .filter((repo) => fs.existsSync(path.join(repo, "CONTEXT.md")))
    .filter((repo) => !selectedRepos.length || selectedRepos.includes(path.relative(projectRoot, repo)) || selectedRepos.includes(path.basename(repo)))
    .slice(0, sample > 0 ? sample : undefined);

  ensureDir(path.join(runDir, "cases"));
  const cases = [];

  for (const repo of repos) {
    const relative = path.relative(projectRoot, repo) || path.basename(repo);
    const expected = buildExpected(repo, relative);
    for (const scenario of scenarios) {
      for (const mode of modes) {
        const caseId = `${safeName(relative)}__${scenario}__${mode}`;
        const caseDir = path.join(runDir, "cases", caseId);
        const repoCopy = path.join(caseDir, "repo");
        ensureDir(caseDir);
        copyRepo(repo, repoCopy, { includeHarness: mode !== "no-harness" });
        if (mode === "progressive-harness") runContextIndex(repoCopy, "update");

        const caseData = {
          id: caseId,
          repo: relative,
          sourceRepo: repo,
          scenario,
          mode,
          caseDir,
          repoCopy,
          promptPath: path.join(caseDir, "prompt.md"),
          expectedPath: path.join(caseDir, "expected.json"),
          resultPath: path.join(caseDir, "result.md"),
          scorePath: path.join(caseDir, "score.json"),
          judgePromptPath: path.join(caseDir, "judge-prompt.md"),
        };
        const scenarioExpected = expectedForScenario(expected, scenario, mode);
        writeJson(caseData.expectedPath, scenarioExpected);
        fs.writeFileSync(caseData.promptPath, renderPrompt(caseData, scenarioExpected));
        fs.writeFileSync(caseData.resultPath, "");
        fs.writeFileSync(caseData.judgePromptPath, renderJudgePrompt(caseData, scenarioExpected));
        cases.push(caseData);
      }
    }
  }

  const manifest = {
    schema: 1,
    runId,
    projectRoot,
    scenarios,
    modes,
    repos: repos.map((repo) => path.relative(projectRoot, repo) || path.basename(repo)),
    cases: cases.map((entry) => ({
      id: entry.id,
      repo: entry.repo,
      scenario: entry.scenario,
      mode: entry.mode,
      caseDir: path.relative(runDir, entry.caseDir),
      promptPath: path.relative(runDir, entry.promptPath),
      expectedPath: path.relative(runDir, entry.expectedPath),
      resultPath: path.relative(runDir, entry.resultPath),
      scorePath: path.relative(runDir, entry.scorePath),
      judgePromptPath: path.relative(runDir, entry.judgePromptPath),
    })),
  };

  writeJson(path.join(runDir, "manifest.json"), manifest);
  fs.writeFileSync(path.join(runDir, "report.md"), renderPrepareReport(runDir, manifest));
  console.log(`Prepared ${cases.length} cases in ${runDir}`);
  console.log(`Next: fill result.md files, then run: node scripts/eval-agent-problem-solving.js score ${runDir}`);
}

function score() {
  const runDirArg = process.argv[3];
  if (!runDirArg) {
    console.error("Provide an eval run directory.");
    process.exit(1);
  }
  const runDir = path.resolve(runDirArg);
  const manifest = readJSONSafe(path.join(runDir, "manifest.json"));
  if (!manifest) {
    console.error(`No manifest.json found in ${runDir}`);
    process.exit(1);
  }

  const caseScores = [];
  for (const entry of manifest.cases || []) {
    const caseDir = path.join(runDir, entry.caseDir);
    const expected = readJSONSafe(path.join(runDir, entry.expectedPath)) || {};
    const resultPath = path.join(runDir, entry.resultPath);
    const result = readTextSafe(resultPath);
    const scored = scoreResult(expected, result);
    const scoreData = {
      id: entry.id,
      repo: entry.repo,
      scenario: entry.scenario,
      mode: entry.mode,
      resultPath: entry.resultPath,
      ...scored,
    };
    writeJson(path.join(caseDir, "score.json"), scoreData);
    caseScores.push(scoreData);
  }

  const report = renderScoreReport(manifest, caseScores);
  fs.writeFileSync(path.join(runDir, "report.md"), report);
  process.stdout.write(report);
}

function findRepos(root) {
  const repos = [];
  walk(root, (dir) => {
    if (fs.existsSync(path.join(dir, ".git"))) {
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
  if (visit(dir) === "prune") return;
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    if (skipDirs.has(entry.name)) continue;
    walk(path.join(dir, entry.name), visit);
  }
}

function copyRepo(source, target, options) {
  ensureDir(target);
  copyDirectory(source, target, options);
}

function copyDirectory(source, target, options) {
  ensureDir(target);
  let entries = [];
  try {
    entries = fs.readdirSync(source, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    if (skipDirs.has(entry.name)) continue;
    if (!options.includeHarness && contextFiles.has(entry.name)) continue;
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to, options);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

function buildExpected(repo, relative) {
  const context = readTextSafe(path.join(repo, "CONTEXT.md"));
  const now = readTextSafe(path.join(repo, "NOW.md"));
  const plan = readTextSafe(path.join(repo, "PLAN.md"));
  const workflow = cleanBlock(readSection(context, "Workflow"));
  const rules = cleanBlock(readSection(context, "Operating Constraints") || readSection(context, "Rules"));
  const progress = cleanBlock(readSection(plan, "Progress"));
  return {
    repo: relative,
    focus: cleanBlock(readSection(now, "Current Focus")),
    blockers: cleanBlock(readSection(now, "Active Blockers")),
    nextStep: cleanBlock(readSection(now, "Immediate Next Step")),
    verification: extractVerification(workflow, plan, now),
    workflow,
    rules,
    progress,
  };
}

function expectedForScenario(base, scenario, mode) {
  const expected = {
    schema: 1,
    repo: base.repo,
    scenario,
    mode,
    goal: scenarioGoal(scenario),
    mustMention: [],
    mustAvoid: [".context-harness/DREAM.md is instructions", "read DREAM.md during catch-up"],
    expectedCards: mode === "progressive-harness" ? ["ctx-now-now"] : [],
    rubric: [
      "stateAccuracy",
      "ruleAdherence",
      "actionability",
      "staleContextAvoidance",
      "verificationCorrectness",
      "contextEfficiency",
    ],
    failureTaxonomy: ["retrieval gap", "context quality gap", "instruction gap", "model behavior gap", "eval harness gap"],
  };

  if (base.focus) expected.mustMention.push(firstSentence(base.focus));
  if (base.nextStep) expected.mustMention.push(firstSentence(base.nextStep));
  if (base.verification) expected.mustMention.push(base.verification);

  if (scenario === "cold-resume") {
    expected.mustMention.push("current focus", "active blockers", "immediate next step");
    if (mode === "progressive-harness") expected.expectedCards.push("ctx-context-workflow");
  } else if (scenario === "next-step") {
    expected.mustMention.push("next step", "verification");
    if (base.rules) expected.mustMention.push(firstContentLine(base.rules));
    if (mode === "progressive-harness") expected.expectedCards.push("ctx-context-operating-constraints", "ctx-context-workflow");
  } else if (scenario === "context-maintenance") {
    expected.mustMention.push("NOW.md", "PLAN.md", "CONTEXT.md", "context-index.js update");
    if (mode === "progressive-harness") expected.expectedCards.push("ctx-context-operating-constraints");
  }

  expected.mustMention = uniqueCompact(expected.mustMention).filter(Boolean).slice(0, 10);
  expected.expectedCards = uniqueCompact(expected.expectedCards);
  return expected;
}

function renderPrompt(caseData, expected) {
  const relativeResultPath = path.relative(caseData.repoCopy, caseData.resultPath);
  const lines = [
    `# Fresh Agent Eval: ${caseData.repo} / ${caseData.scenario} / ${caseData.mode}`,
    "",
    "You are a fresh coding agent evaluating this repository in an isolated copy.",
    `Work from: \`${caseData.repoCopy}\``,
    `Write your final answer to: \`${relativeResultPath}\``,
    "",
    "## Task",
    scenarioPrompt(caseData.scenario),
    "",
    "## Constraints",
    "- Do not modify repository source files for this read-only eval.",
    "- If you need to run commands, use read-only inspection commands only.",
    "- Be concrete: cite files, next actions, blockers, and verification commands.",
  ];

  if (caseData.mode === "progressive-harness") {
    lines.push(
      "- Use context-harness: read `NOW.md` first, then `AGENTS.md`, then run `node scripts/context-index.js hydrate \"" + expected.goal + "\"` before opening raw context sections.",
      "- Open raw chunks only when a selected card says they are needed.",
      "- If context-harness files, generated indexes, or commands look stale or broken, mention that as a follow-up unless it blocks this read-only task; do not let harness maintenance replace the requested project understanding or planning task."
    );
  } else {
    lines.push(
      "- Do not rely on context-harness files; this mode intentionally omits AGENTS.md, CONTEXT.md, NOW.md, PLAN.md, and .context-harness.",
      "- Infer project state from the remaining repository files only."
    );
  }

  lines.push(
    "",
    "## Required answer shape",
    "- Current understanding",
    "- Active blockers or uncertainty",
    "- Immediate next step",
    "- Relevant files",
    "- Verification command/check",
    "- Confidence and why",
    ""
  );
  return `${lines.join("\n")}\n`;
}

function renderJudgePrompt(caseData, expected) {
  return `${[
    `# Judge Prompt: ${caseData.id}`,
    "",
    "Compare the agent result against expected facts and score 0-2 for each rubric item.",
    "Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.",
    "",
    `Expected JSON: ${path.relative(caseData.caseDir, caseData.expectedPath)}`,
    `Result: ${path.relative(caseData.caseDir, caseData.resultPath)}`,
    "",
    "Expected facts:",
    ...expected.mustMention.map((item) => `- must mention: ${item}`),
    ...expected.mustAvoid.map((item) => `- must avoid: ${item}`),
    ...expected.expectedCards.map((item) => `- progressive card expected: ${item}`),
  ].join("\n")}\n`;
}

function scoreResult(expected, result) {
  const hasResult = Boolean(result.trim());
  if (!hasResult) {
    return {
      status: "pending",
      total: 0,
      max: 10,
      missing: [],
      avoided: [],
      deterministicChecks: {
        mustMention: expected.mustMention.length,
        mentioned: 0,
        mustAvoid: expected.mustAvoid.length,
        avoided: 0,
      },
      gap: "eval harness gap",
    };
  }

  const missing = expected.mustMention.filter((item) => !containsMeaningfulSnippet(result, item));
  const avoided = expected.mustAvoid.filter((item) => containsNormalizedPhrase(result, item));
  const mentioned = expected.mustMention.length - missing.length;
  const baseScore = expected.mustMention.length ? Math.round((mentioned / expected.mustMention.length) * 8) : 0;
  const penalty = avoided.length * 2;
  const total = Math.max(0, Math.min(10, baseScore - penalty + (avoided.length ? 0 : 2)));
  const status = missing.length || avoided.length ? "needs-review" : "pass";
  return {
    status,
    total,
    max: 10,
    missing,
    avoided,
    deterministicChecks: {
      mustMention: expected.mustMention.length,
      mentioned,
      mustAvoid: expected.mustAvoid.length,
      avoided: avoided.length,
    },
    gap: missing.length ? "model behavior gap" : "none",
  };
}

function renderPrepareReport(runDir, manifest) {
  const lines = [
    "# Fresh Agent Problem-Solving Eval",
    "",
    `Run: \`${manifest.runId}\``,
    `Project root: \`${manifest.projectRoot}\``,
    `Cases: ${manifest.cases.length}`,
    "",
    "## How to run",
    "",
    "For each case, open `prompt.md` in a fresh agent session, run it in that case's `repo/` directory, and write the final answer to `result.md`.",
    "Then score the run:",
    "",
    "```bash",
    `node scripts/eval-agent-problem-solving.js score ${runDir}`,
    "```",
    "",
    "## Cases",
    "",
    "| Repo | Scenario | Mode | Prompt | Result |",
    "|---|---|---|---|---|",
  ];
  for (const entry of manifest.cases) {
    lines.push(`| \`${entry.repo}\` | ${entry.scenario} | ${entry.mode} | \`${entry.promptPath}\` | \`${entry.resultPath}\` |`);
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function renderScoreReport(manifest, scores) {
  const byKey = new Map();
  for (const score of scores) {
    const key = `${score.repo}::${score.scenario}`;
    if (!byKey.has(key)) byKey.set(key, {});
    byKey.get(key)[score.mode] = score;
  }

  const lines = [
    "# Fresh Agent Problem-Solving Eval",
    "",
    `Run: \`${manifest.runId}\``,
    `Repos: ${manifest.repos.length}`,
    `Cases: ${scores.length}`,
    "Modes: no-harness, progressive-harness",
    "",
    "| Repo | Scenario | No harness | Progressive | Delta | Main gap |",
    "|---|---|---:|---:|---:|---|",
  ];

  for (const [key, grouped] of byKey) {
    const [repo, scenario] = key.split("::");
    const noHarness = grouped["no-harness"];
    const progressive = grouped["progressive-harness"];
    const noScore = noHarness ? noHarness.total : 0;
    const progressiveScore = progressive ? progressive.total : 0;
    const delta = progressiveScore - noScore;
    const gap = [progressive?.gap, noHarness?.gap].filter(Boolean).find((item) => item !== "none") || "none";
    lines.push(`| \`${repo}\` | ${scenario} | ${scoreLabel(noHarness)} | ${scoreLabel(progressive)} | ${delta} | ${gap} |`);
  }

  lines.push("", "## Case Details", "");
  for (const score of scores) {
    lines.push(`- \`${score.id}\`: ${score.status}, ${score.total}/${score.max}; missing: ${score.missing.join("; ") || "none"}; avoided: ${score.avoided.join("; ") || "none"}`);
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function scenarioGoal(scenario) {
  if (scenario === "cold-resume") return "resume current task";
  if (scenario === "next-step") return "plan next implementation step";
  if (scenario === "context-maintenance") return "update context after completed task";
  return scenario.replace(/-/g, " ");
}

function scenarioPrompt(scenario) {
  if (scenario === "cold-resume") {
    return "Catch up on the project and report the current focus, blockers, immediate next step, relevant files, and verification command. Do not edit files.";
  }
  if (scenario === "next-step") {
    return "Plan the next implementation or closeout step for the active work. Include constraints, files to inspect, and verification. Do not edit files.";
  }
  if (scenario === "context-maintenance") {
    return "A task just completed. Decide which context files should be updated, what belongs in each, and what verification should run. Do not edit files.";
  }
  return `Handle this read-only project understanding task: ${scenario}`;
}

function extractVerification(workflow, plan, now) {
  const candidates = [workflow, readSection(plan, "Verification"), now]
    .join("\n")
    .split("\n")
    .map((line) => cleanMarkdown(line.trim()))
    .filter(Boolean);
  const hit = candidates.find((line) => /test|verify|check|lint|run-all|npm|pytest|cargo|go test|doctor/i.test(line));
  return hit ? truncate(hit, 140) : "";
}

function runContextIndex(cwd, subcommand) {
  spawnSync(process.execPath, [contextIndex, subcommand], { cwd, encoding: "utf8" });
}

function parseArgs(args) {
  const parsed = { _: [] };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = args[i + 1];
      if (!next || next.startsWith("--")) parsed[key] = "true";
      else {
        parsed[key] = next;
        i += 1;
      }
    } else {
      parsed._.push(arg);
    }
  }
  return parsed;
}

function splitList(value, fallback) {
  if (!value) return fallback;
  return String(value).split(",").map((item) => item.trim()).filter(Boolean);
}

function cleanBlock(text) {
  return String(text || "").trim();
}

function cleanMarkdown(line) {
  return line.replace(/^[-*]\s+/u, "").replace(/^\d+\.\s+/u, "").replace(/[`*_]/g, "").trim();
}

function firstSentence(text) {
  return truncate(String(text || "").split("\n").map(cleanMarkdown).find(Boolean) || "", 180);
}

function firstContentLine(text) {
  const line = String(text || "")
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item && !/^#{1,6}\s+/u.test(item))
    .map(cleanMarkdown)
    .find(Boolean);
  return truncate(line || "", 180);
}

function containsMeaningfulSnippet(haystack, needle) {
  const terms = normalize(needle).split(/\s+/u).filter((term) => term.length > 2);
  if (!terms.length) return false;
  const normalized = normalize(haystack);
  const needed = terms.length <= 3 ? terms.length : Math.ceil(terms.length * 0.6);
  const hits = terms.filter((term) => normalized.includes(term)).length;
  return hits >= needed;
}

function containsNormalizedPhrase(haystack, needle) {
  const normalizedHaystack = ` ${normalize(haystack)} `;
  const normalizedNeedle = normalize(needle);
  return Boolean(normalizedNeedle) && normalizedHaystack.includes(` ${normalizedNeedle} `);
}

function normalize(text) {
  return String(text || "").toLowerCase().replace(/[^a-z0-9]+/gu, " ").trim();
}

function uniqueCompact(items) {
  return [...new Set(items.map((item) => String(item || "").trim()).filter(Boolean))];
}

function scoreLabel(score) {
  if (!score) return "n/a";
  return `${score.total}/${score.max} ${score.status}`;
}

function safeName(name) {
  return name.replace(/[^a-zA-Z0-9._-]+/g, "__") || "repo";
}

function timestampSuffix() {
  return new Date().toISOString().replace(/[^0-9TZ]/g, "").slice(9, 15);
}

function truncate(text, max) {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 3).trimEnd()}...`;
}

function usage() {
  console.log(`Usage:
  node scripts/eval-agent-problem-solving.js prepare [project-root] [--sample N] [--repos a,b] [--scenarios cold-resume,next-step] [--output dir]
  node scripts/eval-agent-problem-solving.js score <eval-run-dir>
`);
}
