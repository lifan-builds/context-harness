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
const modes = ["no-harness", "flat-harness", "progressive-harness"];
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
const privateFileNames = new Set([".netrc", "credentials.json", "cookies.txt"]);
const privateFilePatterns = [/^\.env(?:\..*)?$/u, /\.(?:key|pem|p12|pfx)$/iu];

main();

function main() {
  if (command === "prepare") return prepare();
  if (command === "score") return score();
  if (command === "fill-pending") return fillPending();
  usage();
}

function prepare() {
  const args = parseArgs(process.argv.slice(3));
  const projectRoot = path.resolve(args._[0] || defaultProjectRoot);
  const scenarios = splitList(args.scenarios, defaultScenarios);
  const selectedModes = splitList(args.modes, modes);
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
      for (const mode of selectedModes) {
        const caseId = `${safeName(relative)}__${scenario}__${mode}`;
        const caseDir = path.join(runDir, "cases", caseId);
        const repoCopy = path.join(caseDir, "repo");
        ensureDir(caseDir);
        copyRepo(repo, repoCopy, { mode });
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
          tracePath: path.join(caseDir, "trace.md"),
          scorePath: path.join(caseDir, "score.json"),
          judgePromptPath: path.join(caseDir, "judge-prompt.md"),
        };
        const scenarioExpected = expectedForScenario(expected, scenario, mode);
        writeJson(caseData.expectedPath, scenarioExpected);
        fs.writeFileSync(caseData.promptPath, renderPrompt(caseData, scenarioExpected));
        fs.writeFileSync(caseData.resultPath, "");
        fs.writeFileSync(caseData.tracePath, "");
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
    modes: selectedModes,
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
      tracePath: path.relative(runDir, entry.tracePath),
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
  const args = parseArgs(process.argv.slice(3));
  const runDirArg = args._[0];
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

  const entries = filteredManifestEntries(manifest, args);
  const scopedManifest = { ...manifest, cases: entries };

  const caseScores = [];
  for (const entry of entries) {
    const caseDir = path.join(runDir, entry.caseDir);
    const expected = readJSONSafe(path.join(runDir, entry.expectedPath)) || {};
    const resultPath = path.join(runDir, entry.resultPath);
    const tracePath = entry.tracePath ? path.join(runDir, entry.tracePath) : path.join(caseDir, "trace.md");
    const result = readTextSafe(resultPath);
    const trace = readTextSafe(tracePath);
    const scored = scoreResult(expected, result, trace);
    const scoreData = {
      id: entry.id,
      repo: entry.repo,
      scenario: entry.scenario,
      mode: entry.mode,
      resultPath: entry.resultPath,
      tracePath: entry.tracePath || path.relative(runDir, tracePath),
      ...scored,
    };
    writeJson(path.join(caseDir, "score.json"), scoreData);
    caseScores.push(scoreData);
  }

  const gate = evaluateGate(scopedManifest, caseScores);
  const report = renderScoreReport(scopedManifest, caseScores, gate);
  fs.writeFileSync(path.join(runDir, "report.md"), report);
  process.stdout.write(report);
  if (args.gate === "true" && !gate.pass) process.exit(1);
}

function fillPending() {
  const args = parseArgs(process.argv.slice(3));
  const runDirArg = args._[0];
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

  const limit = args.limit ? Number(args.limit) : 0;
  const entries = filteredManifestEntries(manifest, args).filter((entry) => isPendingEntry(runDir, entry));
  const selected = limit > 0 ? entries.slice(0, limit) : entries;
  const dryRun = args["dry-run"] === "true";
  const commandTemplate = args.command || "";
  const failures = [];

  console.log(`Pending cases: ${entries.length}`);
  if (limit > 0) console.log(`Batch limit: ${limit}`);

  for (const entry of selected) {
    const paths = casePaths(runDir, entry);
    console.log(`- ${entry.id}`);
    console.log(`  prompt: ${path.relative(process.cwd(), paths.promptPath)}`);
    console.log(`  result: ${path.relative(process.cwd(), paths.resultPath)}`);
    if (dryRun || !commandTemplate) continue;

    const expanded = expandTemplate(commandTemplate, { entry, paths });
    const completedBeforeRun = readTextSafe(paths.resultPath).trim();
    if (completedBeforeRun) continue;
    const child = spawnSync(expanded, { cwd: paths.repoCopy, encoding: "utf8", shell: true, stdio: "inherit" });
    if (child.status !== 0) {
      failures.push({ id: entry.id, status: child.status });
      if (args["stop-on-fail"] === "true") break;
    }
  }

  const remaining = filteredManifestEntries(manifest, args).filter((entry) => isPendingEntry(runDir, entry)).length;
  if (failures.length) {
    console.error(`fill-pending completed with ${failures.length} failure(s); ${remaining} pending case(s) remain.`);
    for (const failure of failures) console.error(`- ${failure.id}: exit ${failure.status}`);
    process.exit(1);
  }
  console.log(`fill-pending complete; ${remaining} pending case(s) remain.`);
  if (remaining === 0) console.log(`Next: node scripts/eval-agent-problem-solving.js score ${runDir} --gate`);
}

function filteredManifestEntries(manifest, args) {
  const filterScenarios = splitList(args.scenarios, []);
  const filterModes = splitList(args.modes, []);
  return (manifest.cases || [])
    .filter((entry) => !filterScenarios.length || filterScenarios.includes(entry.scenario))
    .filter((entry) => !filterModes.length || filterModes.includes(entry.mode));
}

function isPendingEntry(runDir, entry) {
  return !readTextSafe(path.join(runDir, entry.resultPath)).trim();
}

function casePaths(runDir, entry) {
  const caseDir = path.join(runDir, entry.caseDir);
  return {
    caseDir,
    repoCopy: path.join(caseDir, "repo"),
    promptPath: path.join(runDir, entry.promptPath),
    resultPath: path.join(runDir, entry.resultPath),
    tracePath: entry.tracePath ? path.join(runDir, entry.tracePath) : path.join(caseDir, "trace.md"),
  };
}

function expandTemplate(template, { entry, paths }) {
  const values = {
    id: entry.id,
    caseDir: paths.caseDir,
    repoCopy: paths.repoCopy,
    promptPath: paths.promptPath,
    resultPath: paths.resultPath,
    tracePath: paths.tracePath,
  };
  return Object.entries(values).reduce((text, [key, value]) => text.replaceAll(`{${key}}`, shellQuote(value)), template);
}

function shellQuote(value) {
  return `'${String(value).replace(/'/g, `'\\''`)}'`;
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
    if (shouldSkipPrivateCopy(entry.name)) continue;
    if (options.mode === "no-harness" && contextFiles.has(entry.name)) continue;
    if (options.mode === "flat-harness" && entry.name === ".context-harness") continue;
    const from = path.join(source, entry.name);
    const to = path.join(target, entry.name);
    if (entry.isDirectory()) copyDirectory(from, to, options);
    else if (entry.isFile()) fs.copyFileSync(from, to);
  }
}

function shouldSkipPrivateCopy(name) {
  return privateFileNames.has(name) || privateFilePatterns.some((pattern) => pattern.test(name));
}

function buildExpected(repo, relative) {
  const context = readTextSafe(path.join(repo, "CONTEXT.md"));
  const now = readTextSafe(path.join(repo, "NOW.md"));
  const plan = readTextSafe(path.join(repo, "PLAN.md"));
  const workflow = cleanBlock(readSection(context, "Workflow"));
  const rules = cleanBlock(readSection(context, "Operating Constraints"));
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
    failureTaxonomy: [
      "retrieval-order-gap",
      "card-salience-gap",
      "flat-core-overuse-gap",
      "save-routing-gap",
      "context-freshness-gap",
      "harness-drift-priority-gap",
      "answer-quality-gap",
      "eval-instrumentation-gap",
    ],
  };

  if (base.focus) expected.mustMention.push(firstSentence(base.focus));
  if (base.nextStep) expected.mustMention.push(firstSentence(base.nextStep));
  if (base.verification) expected.mustMention.push(base.verification);

  if (scenario === "cold-resume") {
    expected.mustMention.push("current understanding", "active blockers", "immediate next step");
    if (mode === "progressive-harness") expected.expectedCards.push("ctx-context-workflow");
  } else if (scenario === "next-step") {
    expected.mustMention.push("next step", "constraints", "verification");
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
      "- Use context-harness progressively: read `NOW.md` first and concise `CONTEXT.md` as the always-read layer.",
      "- Run `node scripts/context-index.js hydrate \"" + expected.goal + "\"` before opening `PLAN.md`, chunks, or bulky/task-specific context.",
      "- Use selected cards before raw bulky sections; open raw chunks only when a selected card says they are needed.",
      "- If `CONTEXT.md` is small, direct `CONTEXT.md` use is expected; if it is large, use hydrate-selected cards/sections instead of reading it wholesale.",
      "- If context-harness files, generated indexes, or commands look stale or broken, mention that as a follow-up unless it blocks this read-only task; do not let harness maintenance replace the requested project understanding or planning task.",
      "- Include a `Context Evidence` section listing files/commands used in order, including hydrate output or selected card IDs. Also copy tool trace notes to `" + path.relative(caseData.repoCopy, caseData.tracePath) + "` if possible."
    );
  } else if (caseData.mode === "flat-harness") {
    lines.push(
      "- Use only the flat context-harness markdown files: read `NOW.md`, `CONTEXT.md`, `AGENTS.md`, and relevant `PLAN.md` sections if present.",
      "- Do not use `.context-harness/cards`, `.context-harness/chunks`, or `node scripts/context-index.js hydrate`; this mode measures flat context behavior."
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
    "- Context Evidence",
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

function scoreResult(expected, result, trace = "") {
  const hasResult = Boolean(result.trim());
  if (!hasResult) {
    return {
      status: "pending",
      total: 0,
      max: 10,
      answerScore: 0,
      retrievalScore: 0,
      saveRoutingScore: 0,
      contextEfficiencyScore: 0,
      missing: [],
      avoided: [],
      evidence: evidenceSummary(expected, result, trace),
      deterministicChecks: {
        mustMention: expected.mustMention.length,
        mentioned: 0,
        mustAvoid: expected.mustAvoid.length,
        avoided: 0,
      },
      gap: "eval-instrumentation-gap",
    };
  }

  const mustMention = effectiveMustMention(expected);
  const missing = mustMention.filter((item) => !containsExpectedSnippet(result, item));
  const avoided = expected.mustAvoid.filter((item) => containsNormalizedPhrase(result, item));
  const mentioned = mustMention.length - missing.length;
  const answerScore = mustMention.length ? Math.round((mentioned / mustMention.length) * 10) : 10;
  const evidence = evidenceSummary(expected, result, trace);
  const retrievalScore = retrievalEvidenceScore(expected, evidence);
  const saveRoutingScore = saveRoutingEvidenceScore(expected, evidence);
  const contextEfficiencyScore = contextEfficiencyEvidenceScore(expected, evidence);
  const penalty = avoided.length * 2;
  const total = Math.max(0, Math.min(10, Math.round((answerScore * 0.6) + (retrievalScore * 0.2) + (saveRoutingScore * 0.1) + (contextEfficiencyScore * 0.1)) - penalty));
  const rawGap = primaryGap(expected, missing, avoided, evidence);
  const answerOnlyReviewNote = rawGap === "answer-quality-gap" && retrievalScore >= 8 && saveRoutingScore >= 8 && contextEfficiencyScore >= 8;
  const gap = answerOnlyReviewNote ? "none" : rawGap;
  const status = total >= 9 && gap === "none" ? "pass" : "needs-review";
  return {
    status,
    total,
    max: 10,
    answerScore,
    retrievalScore,
    saveRoutingScore,
    contextEfficiencyScore,
    missing,
    avoided,
    evidence,
    deterministicChecks: {
      mustMention: mustMention.length,
      mentioned,
      mustAvoid: expected.mustAvoid.length,
      avoided: avoided.length,
    },
    gap,
  };
}

function evidenceSummary(expected, result, trace) {
  const combined = `${trace}\n${result}`;
  const lower = combined.toLowerCase();
  const contextIndex = firstIndex(lower, ["context.md", "read context"]);
  const hydrateIndex = firstIndex(lower, ["context-index.js hydrate", "hydrate_query:", "hydrate \""]);
  const planIndex = firstIndex(lower, ["plan.md", "read plan"]);
  const chunkIndex = firstIndex(lower, [".context-harness/chunks", "raw detail on demand"]);
  const cardIndex = firstIndex(lower, [".context-harness/cards", "selected_cards:", "ctx-"]);
  return {
    hasTrace: Boolean(trace.trim()),
    hasContextEvidence: /context evidence/i.test(result) || Boolean(trace.trim()),
    hydrate: hydrateIndex !== -1,
    card: cardIndex !== -1 || (expected.expectedCards || []).some((card) => lower.includes(card.toLowerCase())),
    selectedExpectedCards: (expected.expectedCards || []).filter((card) => lower.includes(card.toLowerCase())),
    plan: planIndex !== -1,
    chunk: chunkIndex !== -1,
    context: contextIndex !== -1,
    hydrateBeforePlan: hydrateIndex !== -1 && (planIndex === -1 || hydrateIndex < planIndex),
    hydrateBeforeChunk: hydrateIndex !== -1 && (chunkIndex === -1 || hydrateIndex < chunkIndex),
    hasAlwaysReadContext: /always[-_ ]read|concise context|small context|context\.md/i.test(combined),
    taskLocalToPlan: /task-local|findings|progress|decisions/i.test(combined) && /plan\.md/i.test(combined),
    durableToContext: /durable|terms|rules|invariants|lessons/i.test(combined) && /context\.md/i.test(combined),
    nowLast: /now\.md.*last|rewrite.*now\.md|refresh.*now\.md|update.*now\.md|now\.md.*update|now\.md.*rewrite|now\.md.*refresh|resume packet/i.test(combined),
    indexUpdate: /context-index\.js update/i.test(combined),
    flatOveruse: /read (all|whole|entire) (of )?(plan\.md|large context\.md)|whole-file plan|wholesale plan/i.test(lower),
  };
}

function retrievalEvidenceScore(expected, evidence) {
  if (expected.mode !== "progressive-harness") return 10;
  let score = 0;
  if (evidence.hasContextEvidence) score += 2;
  if (evidence.hydrate) score += 3;
  if (evidence.card) score += 3;
  if (evidence.hydrateBeforePlan) score += 1;
  if (evidence.hydrateBeforeChunk) score += 1;
  return Math.min(10, score);
}

function saveRoutingEvidenceScore(expected, evidence) {
  if (expected.scenario !== "context-maintenance") return 10;
  let score = 0;
  if (evidence.taskLocalToPlan) score += 3;
  if (evidence.durableToContext) score += 3;
  if (evidence.nowLast) score += 2;
  if (evidence.indexUpdate) score += 2;
  return Math.min(10, score);
}

function contextEfficiencyEvidenceScore(expected, evidence) {
  if (expected.mode === "progressive-harness") {
    let score = 10;
    if (evidence.flatOveruse) score -= 5;
    if (evidence.chunk && !evidence.hydrateBeforeChunk) score -= 5;
    return Math.max(0, score);
  }
  if (expected.mode === "flat-harness") return evidence.hydrate || evidence.card ? 0 : 10;
  return 10;
}

function primaryGap(expected, missing, avoided, evidence) {
  if (avoided.length) return "harness-drift-priority-gap";
  if (missing.length) return "answer-quality-gap";
  if (expected.mode === "progressive-harness" && !evidence.hydrate) return "retrieval-order-gap";
  if (expected.mode === "progressive-harness" && !evidence.card) return "card-salience-gap";
  if (expected.mode === "progressive-harness" && evidence.flatOveruse) return "flat-core-overuse-gap";
  if (expected.mode === "progressive-harness" && evidence.chunk && !evidence.hydrateBeforeChunk) return "retrieval-order-gap";
  if (expected.scenario === "context-maintenance" && (!evidence.taskLocalToPlan || !evidence.durableToContext || !evidence.nowLast || !evidence.indexUpdate)) return "save-routing-gap";
  if (!evidence.hasContextEvidence && expected.mode === "progressive-harness") return "eval-instrumentation-gap";
  return "none";
}

function firstIndex(haystack, needles) {
  const indexes = needles.map((needle) => haystack.indexOf(needle)).filter((index) => index !== -1);
  return indexes.length ? Math.min(...indexes) : -1;
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
    "For each case, open `prompt.md` in a fresh agent session, run it in that case's `repo/` directory, and write the final answer to `result.md` plus tool/evidence notes to `trace.md` when available.",
    "Use `fill-pending --dry-run` to list unfinished cases, or pass `--command` with `{promptPath}`, `{resultPath}`, `{tracePath}`, and `{repoCopy}` placeholders to resume a batch without overwriting completed results.",
    "Then score the run:",
    "",
    "```bash",
    `node scripts/eval-agent-problem-solving.js score ${runDir} --gate`,
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

function renderScoreReport(manifest, scores, gate = evaluateGate(manifest, scores)) {
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
    "Modes: no-harness, flat-harness, progressive-harness",
    `Gate: ${gate.pass ? "pass" : "fail"}`,
    "",
    "| Repo | Scenario | No harness | Flat | Progressive | Δ vs none | Δ vs flat | Evidence | Main gap |",
    "|---|---|---:|---:|---:|---:|---:|---|---|",
  ];

  for (const [key, grouped] of byKey) {
    const [repo, scenario] = key.split("::");
    const noHarness = grouped["no-harness"];
    const flat = grouped["flat-harness"];
    const progressive = grouped["progressive-harness"];
    const noScore = noHarness ? noHarness.total : 0;
    const flatScore = flat ? flat.total : 0;
    const progressiveScore = progressive ? progressive.total : 0;
    const deltaNo = progressiveScore - noScore;
    const deltaFlat = progressiveScore - flatScore;
    const gap = progressive?.gap && progressive.gap !== "none" ? progressive.gap : "none";
    lines.push(`| \`${repo}\` | ${scenario} | ${scoreLabel(noHarness)} | ${scoreLabel(flat)} | ${scoreLabel(progressive)} | ${deltaNo} | ${deltaFlat} | ${evidenceLabel(progressive)} | ${gap} |`);
  }

  lines.push("", "## Gate Checks", "");
  for (const check of gate.checks) lines.push(`- ${check.pass ? "PASS" : "FAIL"}: ${check.name} (${check.value})`);

  lines.push("", "## Actionable Gaps", "");
  const gaps = groupGaps(scores);
  if (!gaps.length) lines.push("No release-blocking gaps found by deterministic scoring.");
  else for (const gap of gaps) lines.push(`- ${gap.gap}: ${gap.count} case(s); likely area: ${gap.area}`);

  lines.push("", "## Case Details", "");
  for (const score of scores) {
    lines.push(`- \`${score.id}\`: ${score.status}, ${score.total}/${score.max}; answer ${score.answerScore}/10; retrieval ${score.retrievalScore}/10; save ${score.saveRoutingScore}/10; efficiency ${score.contextEfficiencyScore}/10; missing: ${score.missing.join("; ") || "none"}; avoided: ${score.avoided.join("; ") || "none"}`);
  }
  lines.push("");
  return `${lines.join("\n")}\n`;
}

function evaluateGate(manifest, scores) {
  const progressive = scores.filter((score) => score.mode === "progressive-harness" && score.status !== "pending");
  const grouped = new Map();
  for (const score of scores) {
    const key = `${score.repo}::${score.scenario}`;
    if (!grouped.has(key)) grouped.set(key, {});
    grouped.get(key)[score.mode] = score;
  }
  const pairs = [...grouped.values()];
  const noScores = pairs.map((group) => group["no-harness"]?.total).filter((value) => Number.isFinite(value));
  const progressiveScores = pairs.map((group) => group["progressive-harness"]?.total).filter((value) => Number.isFinite(value));
  const avgNo = average(noScores);
  const avgProgressive = average(progressiveScores);
  const regressions = pairs.filter((group) => group["progressive-harness"] && group["no-harness"] && group["progressive-harness"].total < group["no-harness"].total).length;
  const flatPairs = pairs.filter((group) => group["progressive-harness"] && group["flat-harness"]);
  const beatsFlat = flatPairs.filter((group) => group["progressive-harness"].total >= group["flat-harness"].total).length;
  const hydrateRate = rate(progressive, (score) => score.evidence?.hydrate);
  const cardOrderViolations = progressive.filter((score) => score.evidence?.chunk && !score.evidence?.hydrateBeforeChunk).length;
  const overuseViolations = progressive.filter((score) => score.evidence?.flatOveruse).length;
  const maintenance = progressive.filter((score) => score.scenario === "context-maintenance");
  const saveRoutingRate = rate(maintenance, (score) => score.saveRoutingScore >= 8);
  const driftHijacks = scores.filter((score) => score.avoided?.length).length;
  const pending = scores.filter((score) => score.status === "pending").length;
  const progressiveGaps = progressive.filter((score) => score.gap && score.gap !== "none").length;
  const flatRate = flatPairs.length ? beatsFlat / flatPairs.length : 1;
  const checks = [
    { name: "all cases completed", pass: pending === 0, value: `${pending} pending` },
    { name: "no progressive actionable gaps", pass: progressiveGaps === 0, value: `${progressiveGaps} gap(s)` },
    { name: "progressive average delta vs no-harness", pass: true, value: `${(avgProgressive - avgNo).toFixed(1)} (${avgProgressive.toFixed(1)} vs ${avgNo.toFixed(1)})` },
    { name: "no progressive regressions vs no-harness", pass: regressions === 0, value: `${regressions} regression(s)` },
    { name: "progressive beats/ties flat in >=90%", pass: flatRate >= 0.9, value: `${Math.round(flatRate * 100)}%` },
    { name: "hydrate evidence >=90%", pass: hydrateRate >= 0.9, value: `${Math.round(hydrateRate * 100)}%` },
    { name: "card/chunk order violations = 0", pass: cardOrderViolations === 0, value: `${cardOrderViolations}` },
    { name: "flat overuse violations = 0", pass: overuseViolations === 0, value: `${overuseViolations}` },
    { name: "save routing evidence >=90%", pass: saveRoutingRate >= 0.9, value: `${Math.round(saveRoutingRate * 100)}%` },
    { name: "harness drift hijacks = 0", pass: driftHijacks === 0, value: `${driftHijacks}` },
  ];
  return { pass: checks.every((check) => check.pass), checks };
}

function average(values) {
  return values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
}

function rate(items, predicate) {
  if (!items.length) return 1;
  return items.filter(predicate).length / items.length;
}

function evidenceLabel(score) {
  if (!score?.evidence) return "n/a";
  const bits = [];
  if (score.evidence.hydrate) bits.push("hydrate");
  if (score.evidence.card) bits.push("card");
  if (score.evidence.taskLocalToPlan && score.evidence.durableToContext) bits.push("save");
  if (score.evidence.flatOveruse) bits.push("overuse");
  return bits.join(", ") || "none";
}

function groupGaps(scores) {
  const areas = {
    "retrieval-order-gap": "scripts/context-index.js or progressive prompt wording",
    "card-salience-gap": "hydrate packet/card wording or eval prompt",
    "flat-core-overuse-gap": "contract wording or context compaction policy",
    "save-routing-gap": "context-maintain/SKILL.md",
    "context-freshness-gap": "index update contract or session-end.js",
    "harness-drift-priority-gap": "catch-up guardrails",
    "answer-quality-gap": "context quality or task prompt",
    "eval-instrumentation-gap": "eval-agent-problem-solving.js",
  };
  const counts = new Map();
  for (const score of scores) {
    if (score.mode !== "progressive-harness") continue;
    if (!score.gap || score.gap === "none") continue;
    counts.set(score.gap, (counts.get(score.gap) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([gap, count]) => ({ gap, count, area: areas[gap] || "unknown" }));
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
  const candidates = [now, readSection(plan, "Verification"), workflow]
    .join("\n")
    .split("\n")
    .map((line) => cleanMarkdown(line.trim()))
    .filter(Boolean)
    .filter((line) => !/^setup:/i.test(line))
    .filter((line) => !/project-specific/i.test(line));
  const hit = candidates.find((line) => /test|verify|check|lint|run-all|npm|pytest|cargo|go test|doctor|smoke/i.test(line));
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

function effectiveMustMention(expected) {
  const items = expected.mustMention || [];
  return items
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .filter((item) => !/^setup:/i.test(item))
    .filter((item) => !/^(none|n\/a|\(?none\)?\.?|no known blockers?)$/i.test(item))
    .filter((item) => !/project-specific/i.test(item))
    .filter((item) => expected.scenario !== "next-step" || isNextStepScoringSignal(item));
}

function isNextStepScoringSignal(item) {
  return /^(next step|constraints|verification|blockers?)$/i.test(item)
    || /test|verify|check|lint|run-all|npm|pytest|cargo|go test|doctor|smoke/i.test(item);
}

function containsExpectedSnippet(haystack, needle) {
  if (/^current focus$/i.test(needle)) return /current (understanding|focus)/i.test(haystack);
  if (/^blockers?$/i.test(needle)) return /blockers?|blocked|risks?|uncertaint(?:y|ies)|caveats?/i.test(haystack);
  if (/^constraints$/i.test(needle)) return /constraints?|guardrails?|boundar(?:y|ies)|caveats?|do not|must not|avoid/i.test(haystack);
  if (/^verification$/i.test(needle)) return /verification|verify|test|check|build|typecheck|lint|doctor|smoke/i.test(haystack);
  if (/^next step$/i.test(needle)) return /next step|immediate next|recommended next|next action|closeout|implementation step/i.test(haystack);
  return containsMeaningfulSnippet(haystack, needle);
}

function containsMeaningfulSnippet(haystack, needle) {
  const terms = semanticTerms(needle);
  if (!terms.length) return false;
  const normalized = ` ${normalize(haystack)} `;
  const normalizedTerms = semanticTerms(haystack);
  const haystackTerms = new Set(normalizedTerms);
  const commandTerms = terms.filter(isCommandTerm);
  const needed = commandTerms.length
    ? Math.max(1, Math.ceil(commandTerms.length * 0.8))
    : terms.length <= 3 ? terms.length : Math.ceil(terms.length * 0.6);
  const hits = terms.filter((term) => haystackTerms.has(term) || normalized.includes(` ${term} `)).length;
  return hits >= needed;
}

function semanticTerms(text) {
  return normalize(text)
    .split(/\s+/u)
    .filter((term) => term.length > 2 || /^(js|go|sh|py|ci)$/u.test(term));
}

function isCommandTerm(term) {
  return /^(node|npm|pnpm|yarn|pytest|cargo|doctor|nexus|scripts|run|all|check|test|tests|sh|js)$/u.test(term)
    || /^(?:[a-z]+\d*|\d+)$/u.test(term);
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
  node scripts/eval-agent-problem-solving.js prepare [project-root] [--sample N] [--repos a,b] [--scenarios cold-resume,next-step,context-maintenance] [--modes progressive-harness] [--output dir]
  node scripts/eval-agent-problem-solving.js fill-pending <eval-run-dir> [--scenarios cold-resume] [--modes progressive-harness] [--limit N] [--dry-run] [--command "..."] [--stop-on-fail]
  node scripts/eval-agent-problem-solving.js score <eval-run-dir> [--scenarios cold-resume] [--modes progressive-harness] [--gate]
`);
}
