#!/usr/bin/env node
"use strict";

// eval-agent-problem-solving.js — prepare and score real-world fresh-agent evals.
// The harness compares source-only agents with context-harness agents in isolated
// repo copies. It prepares prompts and deterministic expectations; humans or a
// separate fresh-agent runner can fill result.md, then `score` renders deltas.

const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");
const crypto = require("crypto");
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
const privateFileNames = new Set([".netrc", ".npmrc", ".pypirc", "credentials.json", "cookies.txt", "secrets.yaml", "secrets.yml"]);
const privateFilePatterns = [/^\.env(?:\..*)?$/u, /\.(?:key|pem|p12|pfx|sqlite|sqlite3|db|wal|apk|ipa|dmp)$/iu];
const privatePathParts = new Set([".aws", ".ssh", ".gnupg", ".config", ".vercel", "browser-data", "logs"]);
const maxCopyFileBytes = 5 * 1024 * 1024;
const maxRepoCopyBytes = 100 * 1024 * 1024;
const maxRunCopyBytes = 500 * 1024 * 1024;
const mutationScenarios = new Set(["context-maintenance", "closeout-reversal", "same-session-resume", "successor-recovery"]);
const secretContentPatterns = [
  { name: "private-key", pattern: new RegExp(["-----BEGIN ", "(?:RSA |EC |OPENSSH |DSA )?", "PRIVATE KEY-----"].join(""), "u") },
  { name: "aws-access-key", pattern: /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/u },
  { name: "github-token", pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}\b/u },
  { name: "generic-secret", pattern: /\b(?:api[_-]?key|secret|token|password)\s*[:=]\s*["']?[A-Za-z0-9_./+=-]{16,}/iu },
];

main();

function main() {
  if (command === "prepare") return prepare();
  if (command === "preflight") return preflight();
  if (command === "score") return score();
  if (command === "fill-pending") return fillPending();
  if (command === "list" || command === "inspect") return listRuns();
  if (command === "finalize") return finalizeRun();
  if (command === "prune") return pruneRuns();
  usage();
}

function prepare() {
  const args = parseArgs(process.argv.slice(3));
  const config = prepareConfig(args);
  const inventories = inspectRepos(config);
  if (inventories.some((item) => item.overBudget)) throw new Error("Preflight failed: one or more repositories exceed --max-repo-bytes");
  ensureDir(path.join(config.runDir, "cases"));
  ensureDir(path.join(config.runDir, "snapshots"));
  const cases = [];
  const snapshots = [];
  let copiedBytes = 0;

  for (const inventory of inventories) {
    const expected = buildExpected(inventory.repo, inventory.relative);
    const snapshotByMode = new Map();
    for (const mode of config.selectedModes) {
      const snapshot = path.join(config.runDir, "snapshots", safeName(inventory.relative), mode);
      const copy = copyRepo(inventory.repo, snapshot, { mode, inventory, remainingBytes: config.maxRunBytes - copiedBytes });
      copiedBytes += copy.bytes;
      if (mode === "progressive-harness") runContextIndex(snapshot, "update");
      makeTreeReadOnly(snapshot);
      snapshotByMode.set(mode, snapshot);
      snapshots.push({ repo: inventory.relative, mode, path: path.relative(config.runDir, snapshot), files: copy.files, bytes: copy.bytes, excluded: copy.excluded, sourceHash: copy.sourceHash });
    }
    for (const scenario of config.scenarios) {
      for (const mode of config.selectedModes) {
        const caseId = `${safeName(inventory.relative)}__${scenario}__${mode}`;
        const caseDir = path.join(config.runDir, "cases", caseId);
        const repoCopy = path.join(caseDir, "repo");
        ensureDir(caseDir);
        const mutable = mutationScenarios.has(scenario);
        if (mutable) {
          fs.cpSync(snapshotByMode.get(mode), repoCopy, { recursive: true, dereference: true });
          makeTreeWritable(repoCopy);
          const privateBytes = treeBytes(repoCopy);
          copiedBytes += privateBytes;
          if (copiedBytes > config.maxRunBytes) throw new Error(`Eval run budget exceeded ${config.maxRunBytes} bytes`);
        } else {
          fs.symlinkSync(path.relative(caseDir, snapshotByMode.get(mode)), repoCopy, "dir");
        }
        const caseData = {
          id: caseId, repo: inventory.relative, scenario, mode, mutable, caseDir, repoCopy,
          promptPath: path.join(caseDir, "prompt.md"), expectedPath: path.join(caseDir, "expected.json"),
          resultPath: path.join(caseDir, "result.md"), tracePath: path.join(caseDir, "trace.md"),
          eventsPath: path.join(caseDir, "events.jsonl"), scorePath: path.join(caseDir, "score.json"),
          judgePromptPath: path.join(caseDir, "judge-prompt.md"),
        };
        const scenarioExpected = expectedForScenario(expected, scenario, mode);
        scenarioExpected.provenance = { repoId: inventory.relative, sourceHash: inventory.sourceHash };
        scenarioExpected.expectationHash = hashObject({ ...scenarioExpected, expectationHash: undefined });
        writeJson(caseData.expectedPath, scenarioExpected);
        fs.writeFileSync(caseData.promptPath, renderPrompt(caseData, scenarioExpected));
        fs.writeFileSync(caseData.resultPath, "");
        fs.writeFileSync(caseData.tracePath, "");
        fs.writeFileSync(caseData.eventsPath, "");
        fs.writeFileSync(caseData.judgePromptPath, renderJudgePrompt(caseData, scenarioExpected));
        caseData.fixtureHash = hashObject({ id: caseId, sourceHash: inventory.sourceHash, expectationHash: scenarioExpected.expectationHash, mutable });
        cases.push(caseData);
      }
    }
  }

  const manifest = {
    schema: 3, runId: config.runId, projectRootId: path.basename(config.projectRoot),
    scenarios: config.scenarios, modes: config.selectedModes, repos: inventories.map((item) => item.relative), snapshots,
    provenance: { includeUntracked: config.includeUntracked, inventoryHash: hashObject(inventories.map((item) => ({ repo: item.relative, sourceHash: item.sourceHash }))) },
    preflight: preflightSummary(inventories, config, copiedBytes),
    retention: { containsRepoCopies: true, snapshotBytes: copiedBytes, cleanupStatus: "active" },
    cases: cases.map((entry) => ({
      id: entry.id, repo: entry.repo, scenario: entry.scenario, mode: entry.mode, mutable: entry.mutable, fixtureHash: entry.fixtureHash,
      caseDir: path.relative(config.runDir, entry.caseDir), promptPath: path.relative(config.runDir, entry.promptPath),
      expectedPath: path.relative(config.runDir, entry.expectedPath), resultPath: path.relative(config.runDir, entry.resultPath),
      tracePath: path.relative(config.runDir, entry.tracePath), eventsPath: path.relative(config.runDir, entry.eventsPath),
      scorePath: path.relative(config.runDir, entry.scorePath), judgePromptPath: path.relative(config.runDir, entry.judgePromptPath),
    })),
  };
  writeJson(path.join(config.runDir, "manifest.json"), manifest);
  fs.writeFileSync(path.join(config.runDir, "report.md"), renderPrepareReport(config.runDir, manifest));
  console.log(`Prepared ${cases.length} cases in ${config.runDir}`);
  console.log(`Next: fill result.md files, then run: node scripts/eval-agent-problem-solving.js score ${config.runDir}`);
}

function preflight() {
  const config = prepareConfig(parseArgs(process.argv.slice(3)));
  const inventories = inspectRepos(config);
  const summary = preflightSummary(inventories, config, 0);
  process.stdout.write(renderPreflightReport(summary));
  if (inventories.some((item) => item.overBudget) || summary.estimatedRunBytes > config.maxRunBytes) process.exitCode = 1;
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
    const eventsPath = entry.eventsPath ? path.join(runDir, entry.eventsPath) : path.join(caseDir, "events.jsonl");
    const events = readEvents(eventsPath);
    const persistence = verifyPersistence(events, path.join(caseDir, "repo"), expected);
    const scored = scoreResult(expected, result, trace, events, manifest.schema || 1, persistence);
    const scoreData = {
      id: entry.id,
      repo: entry.repo,
      scenario: entry.scenario,
      mode: entry.mode,
      resultPath: entry.resultPath,
      tracePath: entry.tracePath || path.relative(runDir, tracePath),
      eventsPath: entry.eventsPath || path.relative(runDir, eventsPath),
      schema: 2,
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

function listRuns() {
  const args = parseArgs(process.argv.slice(3));
  const root = path.resolve(args._[0] || defaultEvalRoot);
  if (!fs.existsSync(root)) return console.log("No eval runs found.");
  for (const entry of fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const manifest = readJSONSafe(path.join(root, entry.name, "manifest.json"));
    if (!manifest) continue;
    const bytes = manifest.retention?.snapshotBytes ?? "unknown";
    const cleanup = manifest.retention?.cleanupStatus || "legacy-unknown";
    console.log(`${entry.name}\tcases=${manifest.cases?.length || 0}\tsnapshot_bytes=${bytes}\t${cleanup}`);
  }
}

function finalizeRun() {
  const args = parseArgs(process.argv.slice(3));
  const runDirArg = args._[0];
  if (!runDirArg) throw new Error("Provide an eval run directory.");
  const runDir = path.resolve(runDirArg);
  assertSafeManagedPath(runDir, path.dirname(runDir));
  const manifestPath = path.join(runDir, "manifest.json");
  const manifest = readJSONSafe(manifestPath);
  if (!manifest) throw new Error(`No manifest.json found in ${runDir}`);
  const pending = (manifest.cases || []).filter((entry) => isPendingEntry(runDir, entry));
  if (pending.length && args.force !== "true") throw new Error(`Refusing to finalize ${pending.length} pending case(s); pass --force to override`);
  const snapshotsPath = path.join(runDir, "snapshots");
  if (fs.existsSync(snapshotsPath)) makeTreeWritable(snapshotsPath);
  const disposable = [snapshotsPath];
  for (const entry of manifest.cases || []) disposable.push(path.join(runDir, entry.caseDir, "repo"));
  for (const disposablePath of disposable) {
    assertSafeManagedPath(disposablePath, runDir);
    fs.rmSync(disposablePath, { recursive: true, force: true });
  }
  manifest.retention = { ...(manifest.retention || {}), containsRepoCopies: false, cleanupStatus: "finalized", finalizedAt: new Date().toISOString() };
  writeJson(manifestPath, manifest);
  console.log(`Finalized ${runDir}; disposable snapshots removed.`);
}

function pruneRuns() {
  const args = parseArgs(process.argv.slice(3));
  const root = path.resolve(args._[0] || defaultEvalRoot);
  assertSafeManagedPath(root, path.dirname(root));
  const days = numericArg(args["older-than"], 14, "older-than");
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  if (!fs.existsSync(root)) return console.log("No eval runs found.");
  for (const entry of fs.readdirSync(root, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    if (!entry.isDirectory()) continue;
    const runDir = path.join(root, entry.name);
    const manifest = readJSONSafe(path.join(runDir, "manifest.json"));
    if (!manifest || fs.statSync(runDir).mtimeMs >= cutoff) continue;
    const pending = (manifest.cases || []).some((caseEntry) => isPendingEntry(runDir, caseEntry));
    if (pending && args.force !== "true") {
      console.log(`SKIP ${entry.name}: pending cases`);
      continue;
    }
    if (args.yes === "true") {
      assertSafeManagedPath(runDir, root);
      makeTreeWritable(runDir);
      fs.rmSync(runDir, { recursive: true, force: true });
      console.log(`REMOVED ${entry.name}`);
    } else console.log(`WOULD REMOVE ${entry.name}`);
  }
}

function assertSafeManagedPath(candidate, parent) {
  const resolved = path.resolve(candidate);
  const resolvedParent = path.resolve(parent);
  if (resolved === path.parse(resolved).root || resolved === resolvedParent || !resolved.startsWith(`${resolvedParent}${path.sep}`)) {
    throw new Error(`Refusing unsafe retention path: ${resolved}`);
  }
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
    eventsPath: entry.eventsPath ? path.join(runDir, entry.eventsPath) : path.join(caseDir, "events.jsonl"),
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
    eventsPath: paths.eventsPath,
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

function prepareConfig(args) {
  const projectRoot = path.resolve(args._[0] || defaultProjectRoot);
  const scenarios = splitList(args.scenarios, defaultScenarios);
  const selectedModes = splitList(args.modes, modes);
  const selectedRepos = splitList(args.repos, []);
  const sample = numericArg(args.sample, 0, "sample");
  const runId = args.runId || `${today()}-${timestampSuffix()}`;
  const runDir = path.resolve(args.output || path.join(defaultEvalRoot, runId));
  const repos = findRepos(projectRoot)
    .filter((repo) => fs.existsSync(path.join(repo, "CONTEXT.md")))
    .filter((repo) => !selectedRepos.length || selectedRepos.includes(path.relative(projectRoot, repo)) || selectedRepos.includes(path.basename(repo)))
    .slice(0, sample > 0 ? sample : undefined);
  return {
    projectRoot, scenarios, selectedModes, runId, runDir, repos,
    includeUntracked: args["include-untracked"] === "true",
    maxFileBytes: numericArg(args["max-file-bytes"], maxCopyFileBytes, "max-file-bytes"),
    maxRepoBytes: numericArg(args["max-repo-bytes"], maxRepoCopyBytes, "max-repo-bytes"),
    maxRunBytes: numericArg(args["max-run-bytes"], maxRunCopyBytes, "max-run-bytes"),
  };
}

function inspectRepos(config) {
  return config.repos.map((repo) => inventoryRepo(repo, path.relative(config.projectRoot, repo) || path.basename(repo), config));
}

function inventoryRepo(repo, relativeRepo, config) {
  const gitArgs = ["ls-files", "-c", "-z"];
  if (config.includeUntracked) gitArgs.splice(2, 0, "-o", "--exclude-standard");
  const listed = spawnSync("git", gitArgs, { cwd: repo, encoding: "buffer" });
  if (listed.status !== 0) throw new Error(`Cannot inventory Git files for ${relativeRepo}`);
  const entries = [];
  const exclusions = {};
  for (const relative of [...new Set(listed.stdout.toString("utf8").split("\0").filter(Boolean))].sort()) {
    const from = path.join(repo, relative);
    let stat;
    try { stat = fs.statSync(from); } catch { continue; }
    let reason = null;
    if (!stat.isFile()) reason = "not-file";
    else if (shouldSkipCopyPath(relative, "progressive-harness")) reason = "private-or-generated-path";
    else if (stat.size > config.maxFileBytes) reason = "max-file-bytes";
    else if (scanSecretContent(from, stat.size)) reason = "secret-content";
    if (reason) exclusions[reason] = (exclusions[reason] || 0) + 1;
    entries.push({ relative, size: stat.size, excluded: reason, hash: reason ? null : hashFile(from) });
  }
  const included = entries.filter((entry) => !entry.excluded);
  const bytes = included.reduce((sum, entry) => sum + entry.size, 0);
  return {
    repo, relative: relativeRepo, entries, bytes, files: included.length, exclusions,
    largest: [...included].sort((a, b) => b.size - a.size || a.relative.localeCompare(b.relative)).slice(0, 5).map(({ relative, size }) => ({ path: relative, bytes: size })),
    sourceHash: hashObject(included.map(({ relative, size, hash }) => ({ path: relative, bytes: size, hash }))),
    overBudget: bytes > config.maxRepoBytes,
  };
}

function copyRepo(source, target, options) {
  ensureDir(target);
  let bytes = 0;
  let files = 0;
  let excluded = 0;
  for (const entry of options.inventory.entries) {
    if (entry.excluded || shouldSkipCopyPath(entry.relative, options.mode)) { excluded += 1; continue; }
    bytes += entry.size;
    if (bytes > options.remainingBytes) throw new Error(`Eval run budget exceeded while copying ${options.inventory.relative}`);
    const to = path.join(target, entry.relative);
    ensureDir(path.dirname(to));
    fs.copyFileSync(path.join(source, entry.relative), to);
    files += 1;
  }
  return { bytes, files, excluded, sourceHash: options.inventory.sourceHash };
}

function scanSecretContent(file, size) {
  if (size === 0 || size > 1024 * 1024) return null;
  const buffer = fs.readFileSync(file);
  if (buffer.includes(0)) return null;
  const text = buffer.toString("utf8");
  return secretContentPatterns.find((item) => item.pattern.test(text))?.name || null;
}

function hashFile(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

function hashObject(value) {
  return crypto.createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function numericArg(value, fallback, name) {
  if (value === undefined) return fallback;
  const number = Number(value);
  if (!Number.isSafeInteger(number) || number < 0) throw new Error(`--${name} must be a non-negative integer`);
  return number;
}

function makeTreeReadOnly(root) {
  forEachTreePath(root, (entryPath, stat) => fs.chmodSync(entryPath, stat.isDirectory() ? 0o555 : 0o444));
}

function makeTreeWritable(root) {
  forEachTreePath(root, (entryPath, stat) => fs.chmodSync(entryPath, stat.isDirectory() ? 0o755 : 0o644), true);
}

function forEachTreePath(root, visit, parentsFirst = false) {
  const entries = [];
  const collect = (current) => {
    const stat = fs.lstatSync(current);
    entries.push([current, stat]);
    if (stat.isDirectory()) for (const name of fs.readdirSync(current).sort()) collect(path.join(current, name));
  };
  collect(root);
  for (const [entryPath, stat] of parentsFirst ? entries : entries.reverse()) visit(entryPath, stat);
}

function treeBytes(root) {
  let bytes = 0;
  forEachTreePath(root, (_entryPath, stat) => { if (stat.isFile()) bytes += stat.size; }, true);
  return bytes;
}

function preflightSummary(inventories, config, actualRunBytes) {
  const snapshotBytes = inventories.reduce((sum, item) => sum + (item.bytes * config.selectedModes.length), 0);
  const mutableCopies = config.scenarios.filter((scenario) => mutationScenarios.has(scenario)).length;
  const privateBytes = inventories.reduce((sum, item) => sum + (item.bytes * config.selectedModes.length * mutableCopies), 0);
  return {
    includeUntracked: config.includeUntracked,
    limits: { maxFileBytes: config.maxFileBytes, maxRepoBytes: config.maxRepoBytes, maxRunBytes: config.maxRunBytes },
    repos: inventories.map(({ relative, bytes, files, exclusions, largest, overBudget }) => ({ repo: relative, bytes, files, exclusions, largest, overBudget })),
    reuse: { sharedSnapshots: inventories.length * config.selectedModes.length, readOnlyCases: inventories.length * config.selectedModes.length * config.scenarios.filter((item) => !mutationScenarios.has(item)).length, privateMutationCopies: inventories.length * config.selectedModes.length * mutableCopies },
    estimatedRunBytes: snapshotBytes + privateBytes,
    actualRunBytes,
  };
}

function renderPreflightReport(summary) {
  const lines = [
    "# Eval Preflight", "", `Untracked files: ${summary.includeUntracked ? "included by opt-in" : "excluded"}`,
    `Estimated run bytes: ${summary.estimatedRunBytes} / ${summary.limits.maxRunBytes}`,
    `Reuse: ${summary.reuse.sharedSnapshots} shared read-only snapshots; ${summary.reuse.readOnlyCases} linked read-only cases; ${summary.reuse.privateMutationCopies} private mutation copies`, "",
    "## Repositories", "",
  ];
  for (const repo of summary.repos) {
    lines.push(`- ${repo.repo}: ${repo.files} files, ${repo.bytes} bytes${repo.overBudget ? " (OVER REPO BUDGET)" : ""}`);
    lines.push(`  exclusions: ${Object.entries(repo.exclusions).map(([name, count]) => `${name}=${count}`).join(", ") || "none"}`);
    lines.push(`  largest: ${repo.largest.map((item) => `${item.path} (${item.bytes})`).join(", ") || "none"}`);
  }
  return `${lines.join("\n")}\n`;
}

function shouldSkipCopyPath(relative, mode) {
  const parts = relative.split(/[\\/]/u);
  const name = parts[parts.length - 1];
  if (parts.some((part) => skipDirs.has(part) || privatePathParts.has(part))) return true;
  if (shouldSkipPrivateCopy(name)) return true;
  if (mode === "no-harness" && parts.length === 1 && contextFiles.has(name)) return true;
  if (mode !== "progressive-harness" && parts[0] === ".context-harness") return true;
  return false;
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
    schema: 2,
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
    caseData.mutable ? "- This scenario uses a private writable fixture; make only the context changes required by the task." : "- Do not modify repository source files for this read-only eval.",
    caseData.mutable ? "- Record structured file-change and command evidence in events.jsonl, including hashes needed to verify persistence." : "- If you need to run commands, use read-only inspection commands only.",
    "- Be concrete: cite files, next actions, blockers, and verification commands.",
  ];

  if (caseData.mode === "progressive-harness") {
    lines.push(
      "- Use context-harness progressively: read `NOW.md` first and concise `CONTEXT.md` as the always-read layer.",
      "- Run `node scripts/context-index.js hydrate \"" + expected.goal + "\"` before opening `PLAN.md`, chunks, or bulky/task-specific context.",
      "- Use selected cards before raw bulky sections; open raw chunks only when a selected card says they are needed.",
      "- If `CONTEXT.md` is small, direct `CONTEXT.md` use is expected; if it is large, use hydrate-selected cards/sections instead of reading it wholesale.",
      "- If context-harness files, generated indexes, or commands look stale or broken, mention that as a follow-up unless it blocks this read-only task; do not let harness maintenance replace the requested project understanding or planning task.",
      "- Include a `Context Evidence` section for explanation. Runner-observed execution belongs in `" + path.relative(caseData.repoCopy, caseData.eventsPath) + "` as ordered JSONL events; prose in `" + path.relative(caseData.repoCopy, caseData.tracePath) + "` is claimed evidence only."
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

function scoreResult(expected, result, trace = "", events = [], runSchema = 1, persistence = null) {
  const hasResult = Boolean(result.trim());
  if (!hasResult) {
    return {
      status: "pending",
      total: 0,
      max: 10,
      answerScore: 0,
      retrievalScore: 0,
      routingKnowledgeScore: 0,
      contextEfficiencyScore: 0,
      missing: [],
      avoided: [],
      evidence: evidenceSummary(expected, result, trace, events, runSchema, persistence),
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
  const evidence = evidenceSummary(expected, result, trace, events, runSchema, persistence);
  const retrievalScore = retrievalEvidenceScore(expected, evidence);
  const routingKnowledgeScore = routingKnowledgeEvidenceScore(expected, evidence);
  const contextEfficiencyScore = contextEfficiencyEvidenceScore(expected, evidence);
  const penalty = avoided.length * 2;
  const total = Math.max(0, Math.min(10, Math.round((answerScore * 0.6) + (retrievalScore * 0.2) + (routingKnowledgeScore * 0.1) + (contextEfficiencyScore * 0.1)) - penalty));
  const gap = primaryGap(expected, missing, avoided, evidence);
  const status = total >= 9 && gap === "none" ? "pass" : "needs-review";
  return {
    status,
    total,
    max: 10,
    answerScore,
    retrievalScore,
    routingKnowledgeScore,
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

function evidenceSummary(expected, result, trace, events = [], runSchema = 1, persistence = null) {
  const combined = `${trace}\n${result}`;
  const eventValidation = validateEvents(events);
  const lower = combined.toLowerCase();
  const ordered = events.map((event, index) => ({ ...event, order: Number.isFinite(event.seq) ? event.seq : index + 1 }));
  const successfulCommands = ordered.filter((event) => event.type === "command" && event.exitCode === 0);
  const hydrateEvent = successfulCommands.find((event) => Array.isArray(event.argv) && event.argv.includes("hydrate"));
  const hydrateResult = ordered.find((event) => event.type === "hydrate_result" && Array.isArray(event.selectedCardIds));
  const reads = ordered.filter((event) => event.type === "file_read");
  const cardRead = reads.find((event) => String(event.path || "").startsWith(".context-harness/cards/"));
  const planRead = reads.find((event) => event.path === "PLAN.md");
  const chunkRead = reads.find((event) => String(event.path || "").startsWith(".context-harness/chunks/"));
  const contextRead = reads.find((event) => event.path === "CONTEXT.md");
  const legacy = runSchema < 2;
  const claimedHydrate = firstIndex(lower, ["context-index.js hydrate", "hydrate_query:", "hydrate \""]) !== -1;
  const claimedCard = firstIndex(lower, [".context-harness/cards", "selected_cards:", "ctx-"]) !== -1;
  const verifiedHydrate = Boolean(hydrateEvent && hydrateResult);
  const verifiedCard = Boolean(cardRead || hydrateResult?.selectedCardIds?.length);
  const selectedCards = hydrateResult?.selectedCardIds || [];
  return {
    hasTrace: Boolean(trace.trim()) || events.length > 0,
    hasContextEvidence: events.length > 0 || /context evidence/i.test(result) || Boolean(trace.trim()),
    traceVerification: events.length ? "verified" : legacy && trace.trim() ? "legacy-unverified" : trace.trim() ? "claimed" : "absent",
    claimedHydrate,
    claimedCard,
    verifiedHydrate,
    verifiedCard,
    hydrate: verifiedHydrate || (legacy && claimedHydrate),
    card: verifiedCard || (legacy && (claimedCard || (expected.expectedCards || []).some((card) => lower.includes(card.toLowerCase())))),
    selectedExpectedCards: (expected.expectedCards || []).filter((card) => selectedCards.includes(card) || (legacy && lower.includes(card.toLowerCase()))),
    plan: Boolean(planRead) || (legacy && firstIndex(lower, ["plan.md", "read plan"]) !== -1),
    chunk: Boolean(chunkRead) || (legacy && firstIndex(lower, [".context-harness/chunks", "raw detail on demand"]) !== -1),
    context: Boolean(contextRead) || (legacy && firstIndex(lower, ["context.md", "read context"]) !== -1),
    hydrateBeforePlan: Boolean(hydrateEvent) && (!planRead || hydrateEvent.order < planRead.order),
    hydrateBeforeChunk: Boolean(hydrateEvent) && (!chunkRead || hydrateEvent.order < chunkRead.order),
    hasAlwaysReadContext: Boolean(contextRead) || /always[-_ ]read|concise context|small context|context\.md/i.test(combined),
    taskLocalToPlan: /task-local|findings|progress|decisions/i.test(combined) && /plan\.md/i.test(combined),
    durableToContext: /durable|terms|rules|invariants|lessons/i.test(combined) && /context\.md/i.test(combined),
    nowLast: /now\.md.*last|rewrite.*now\.md|refresh.*now\.md|update.*now\.md|now\.md.*update|now\.md.*rewrite|now\.md.*refresh|resume packet/i.test(combined),
    indexUpdate: /context-index\.js update/i.test(combined),
    eventsValid: eventValidation.valid,
    eventErrors: eventValidation.errors,
    persistenceVerified: Boolean(persistence?.verified),
    persistence,
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

function routingKnowledgeEvidenceScore(expected, evidence) {
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
  if (mutationScenarios.has(expected.scenario) && (!evidence.eventsValid || !evidence.persistenceVerified)) return "eval-instrumentation-gap";
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
    `Project root ID: \`${manifest.projectRootId || path.basename(manifest.projectRoot || "unknown")}\``,
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
    `Modes: ${(manifest.modes || []).join(", ")}`,
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
    const deltaNo = scoreDelta(progressive, noHarness);
    const deltaFlat = scoreDelta(progressive, flat);
    const gap = progressive?.gap && progressive.gap !== "none" ? progressive.gap : "none";
    lines.push(`| \`${repo}\` | ${scenario} | ${scoreLabel(noHarness)} | ${scoreLabel(flat)} | ${scoreLabel(progressive)} | ${deltaNo} | ${deltaFlat} | ${evidenceLabel(progressive)} | ${gap} |`);
  }

  lines.push("", "## Gate Checks", "");
  for (const check of gate.checks) lines.push(`- ${check.status.toUpperCase()}: ${check.name} (${check.value})`);

  lines.push("", "## Actionable Gaps", "");
  const gaps = groupGaps(scores);
  if (!gaps.length) lines.push("No release-blocking gaps found by deterministic scoring.");
  else for (const gap of gaps) lines.push(`- ${gap.gap}: ${gap.count} case(s); likely area: ${gap.area}`);

  lines.push("", "## Case Details", "");
  for (const score of scores) {
    const routing = score.routingKnowledgeScore ?? score.saveRoutingScore ?? 0;
    lines.push(`- \`${score.id}\`: ${score.status}, ${score.total}/${score.max}; answer ${score.answerScore}/10; retrieval ${score.retrievalScore}/10; routing knowledge ${routing}/10; efficiency ${score.contextEfficiencyScore}/10; evidence ${score.evidence?.traceVerification || "absent"}; missing: ${score.missing.join("; ") || "none"}; avoided: ${score.avoided.join("; ") || "none"}`);
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
  const groups = [...grouped.values()];
  const noPairs = groups.filter((group) => group["progressive-harness"] && group["no-harness"]);
  const flatPairs = groups.filter((group) => group["progressive-harness"] && group["flat-harness"]);
  const regressions = noPairs.filter((group) => group["progressive-harness"].total < group["no-harness"].total).length;
  const beatsFlat = flatPairs.filter((group) => group["progressive-harness"].total >= group["flat-harness"].total).length;
  const hydrate = ratio(progressive, (score) => score.evidence?.verifiedHydrate || (manifest.schema < 2 && score.evidence?.hydrate));
  const routingCases = progressive.filter((score) => score.scenario === "context-maintenance");
  const routing = ratio(routingCases, (score) => (score.routingKnowledgeScore ?? score.saveRoutingScore ?? 0) >= 8);
  const flatRate = ratio(flatPairs, (group) => group["progressive-harness"].total >= group["flat-harness"].total);
  const pending = scores.filter((score) => score.status === "pending").length;
  const progressiveGaps = progressive.filter((score) => score.gap && score.gap !== "none").length;
  const cardOrderViolations = progressive.filter((score) => score.evidence?.chunk && !score.evidence?.hydrateBeforeChunk).length;
  const overuseViolations = progressive.filter((score) => score.evidence?.flatOveruse).length;
  const driftHijacks = scores.filter((score) => score.avoided?.length).length;
  const expectedProgressive = groups.filter((group) => group["progressive-harness"]).length;
  const checks = [
    check("all cases completed", pending === 0, `${pending} pending`),
    check("no progressive actionable gaps", progressiveGaps === 0, `${progressiveGaps} gap(s)`),
    comparisonCheck("no-harness matched-pair coverage", (manifest.modes || []).includes("no-harness"), noPairs.length === expectedProgressive, `${noPairs.length}/${expectedProgressive} pairs`),
    comparisonCheck("no progressive regressions vs no-harness", noPairs.length > 0, regressions === 0, `${regressions}/${noPairs.length} regressions`),
    comparisonCheck("progressive beats/ties flat in >=90%", flatRate.applicable, flatRate.value >= 0.9, flatRate.applicable ? `${beatsFlat}/${flatPairs.length} (${Math.round(flatRate.value * 100)}%)` : "n/a"),
    comparisonCheck("verified hydrate evidence >=90%", hydrate.applicable, hydrate.value >= 0.9, hydrate.applicable ? `${hydrate.hits}/${hydrate.total} (${Math.round(hydrate.value * 100)}%)` : "n/a"),
    check("card/chunk order violations = 0", cardOrderViolations === 0, `${cardOrderViolations}`),
    check("flat overuse violations = 0", overuseViolations === 0, `${overuseViolations}`),
    comparisonCheck("routing knowledge >=90%", routing.applicable, routing.value >= 0.9, routing.applicable ? `${routing.hits}/${routing.total} (${Math.round(routing.value * 100)}%)` : "n/a"),
    check("harness drift hijacks = 0", driftHijacks === 0, `${driftHijacks}`),
  ];
  return { pass: checks.every((item) => item.status !== "fail"), checks };
}

function check(name, pass, value) {
  return { name, status: pass ? "pass" : "fail", pass, value };
}

function comparisonCheck(name, applicable, pass, value) {
  return applicable ? check(name, pass, value) : { name, status: "not-applicable", pass: null, value: "n/a" };
}

function ratio(items, predicate) {
  if (!items.length) return { applicable: false, value: null, hits: 0, total: 0 };
  const hits = items.filter(predicate).length;
  return { applicable: true, value: hits / items.length, hits, total: items.length };
}

function scoreDelta(candidate, baseline) {
  if (!candidate || !baseline || !Number.isFinite(candidate.total) || !Number.isFinite(baseline.total)) return "n/a";
  return String(candidate.total - baseline.total);
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
    return "A task just completed. Update the appropriate context files, keep information in the correct durable or task-local layer, refresh the context index, and verify the changes persisted.";
  }
  if (mutationScenarios.has(scenario)) return `Complete the ${scenario.replace(/-/g, " ")} context workflow in this private fixture, persist the required changes, and verify the final context index state.`;
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
  const fixtureIndex = path.join(cwd, "scripts", "context-index.js");
  const child = spawnSync(process.execPath, [fs.existsSync(fixtureIndex) ? fixtureIndex : contextIndex, subcommand], { cwd, encoding: "utf8" });
  if (child.status !== 0) {
    const detail = String(child.stderr || child.stdout || "").trim();
    throw new Error(`context-index ${subcommand} failed in fixture${detail ? `: ${truncate(detail, 300)}` : ""}`);
  }
}

function validateEvents(events) {
  const errors = [];
  let previousSeq = 0;
  for (const [index, event] of events.entries()) {
    if (!Number.isSafeInteger(event.seq) || event.seq <= previousSeq) errors.push(`event ${index + 1}: seq must be a strictly increasing integer`);
    else previousSeq = event.seq;
    if (!event.type || event.type === "invalid") errors.push(`event ${index + 1}: invalid type or JSON`);
    if (event.type === "command" && (!Array.isArray(event.argv) || !event.argv.every((item) => typeof item === "string") || !Number.isInteger(event.exitCode))) errors.push(`event ${index + 1}: command requires argv[] and integer exitCode`);
    if (event.type === "file_read" && !safeEventPath(event.path)) errors.push(`event ${index + 1}: file_read requires a relative path`);
    if (event.type === "file_changed" && (!safeEventPath(event.path) || !validHash(event.beforeHash) || !validHash(event.afterHash) || event.beforeHash === event.afterHash)) errors.push(`event ${index + 1}: file_changed requires path and distinct SHA-256 hashes`);
    if (event.type === "source_hash" && (!safeEventPath(event.path) || !validHash(event.hash))) errors.push(`event ${index + 1}: source_hash requires path and SHA-256 hash`);
    if (event.type === "hydrate_result" && !Array.isArray(event.selectedCardIds)) errors.push(`event ${index + 1}: hydrate_result requires selectedCardIds[]`);
  }
  return { valid: errors.length === 0 && events.length > 0, errors };
}

function verifyPersistence(events, repoCopy, expected) {
  if (!mutationScenarios.has(expected.scenario)) return { applicable: false, verified: false };
  const ordered = events.map((event, index) => ({ ...event, order: Number.isFinite(event.seq) ? event.seq : index + 1 }));
  const expectedPaths = expected.scenario === "context-maintenance" ? new Set(["NOW.md", "PLAN.md", "CONTEXT.md", "AGENTS.md"]) : contextFiles;
  const changed = ordered.filter((event) => event.type === "file_changed" && expectedPaths.has(event.path));
  const update = ordered.find((event) => event.type === "command" && event.exitCode === 0 && Array.isArray(event.argv) && event.argv.some((item) => /context-index\.js$/u.test(item)) && event.argv.includes("update"));
  const finalHash = [...ordered].reverse().find((event) => event.type === "source_hash" && expectedPaths.has(event.path));
  let actualHash = null;
  if (finalHash && safeEventPath(finalHash.path)) {
    const file = path.join(repoCopy, finalHash.path);
    if (fs.existsSync(file) && fs.statSync(file).isFile()) actualHash = hashFile(file);
  }
  const changedBeforeUpdate = Boolean(update && changed.some((event) => event.order < update.order));
  const finalAfterUpdate = Boolean(update && finalHash && finalHash.order > update.order);
  return {
    applicable: true,
    verified: validateEvents(events).valid && changedBeforeUpdate && finalAfterUpdate && actualHash === finalHash?.hash,
    changedBeforeUpdate,
    successfulUpdate: Boolean(update),
    finalHashMatches: Boolean(actualHash && actualHash === finalHash?.hash),
    finalPath: finalHash?.path || null,
  };
}

function safeEventPath(value) {
  return typeof value === "string" && value.length > 0 && !path.isAbsolute(value) && !value.split(/[\\/]/u).includes("..");
}

function validHash(value) {
  return typeof value === "string" && /^[a-f0-9]{64}$/u.test(value);
}

function readEvents(file) {
  const text = readTextSafe(file);
  if (!text.trim()) return [];
  const events = [];
  for (const [index, line] of text.split("\n").entries()) {
    if (!line.trim()) continue;
    try {
      const event = JSON.parse(line);
      if (event && typeof event === "object" && typeof event.type === "string") events.push(event);
    } catch {
      events.push({ type: "invalid", seq: index + 1 });
    }
  }
  return events;
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
  node scripts/eval-agent-problem-solving.js preflight [project-root] [--include-untracked] [--max-file-bytes N] [--max-repo-bytes N] [--max-run-bytes N]
  node scripts/eval-agent-problem-solving.js prepare [project-root] [--sample N] [--repos a,b] [--scenarios cold-resume,next-step,context-maintenance] [--modes progressive-harness] [--output dir] [--include-untracked] [--max-file-bytes N] [--max-repo-bytes N] [--max-run-bytes N]
  node scripts/eval-agent-problem-solving.js fill-pending <eval-run-dir> [--scenarios cold-resume] [--modes progressive-harness] [--limit N] [--dry-run] [--command "..."] [--stop-on-fail]
  node scripts/eval-agent-problem-solving.js score <eval-run-dir> [--scenarios cold-resume] [--modes progressive-harness] [--gate]
  node scripts/eval-agent-problem-solving.js list [eval-root]
  node scripts/eval-agent-problem-solving.js finalize <eval-run-dir> [--force]
  node scripts/eval-agent-problem-solving.js prune [eval-root] [--older-than days] [--yes] [--force]
`);
}
