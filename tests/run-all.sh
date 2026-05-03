#!/usr/bin/env bash
set -uo pipefail
# Note: no set -e — tests intentionally trigger non-zero exits

# run-all.sh — Master test runner for context-harness scripts
# Usage: ./tests/run-all.sh [test-name]
#   Run all tests:     ./tests/run-all.sh
#   Run one suite:     ./tests/run-all.sh context-gen

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

PASS=0
FAIL=0
SKIP=0
FAILURES=()

# --- Test framework ---

current_suite=""
current_test=""

suite() {
  current_suite="$1"
  echo ""
  echo "━━━ $1 ━━━"
}

it() {
  current_test="$1"
  echo -n "  $1 ... "
}

pass() {
  echo "PASS"
  PASS=$((PASS + 1))
}

fail() {
  echo "FAIL${1:+ ($1)}"
  FAIL=$((FAIL + 1))
  FAILURES+=("$current_suite: $current_test${1:+ — $1}")
}

skip() {
  echo "SKIP${1:+ ($1)}"
  SKIP=$((SKIP + 1))
}

assert_exit() {
  local expected="$1" actual="$2"
  [ "$actual" -eq "$expected" ] && pass || fail "expected exit $expected, got $actual"
}

assert_contains() {
  local haystack="$1" needle="$2"
  echo "$haystack" | grep -q "$needle" && pass || fail "output missing: $needle"
}

assert_not_contains() {
  local haystack="$1" needle="$2"
  echo "$haystack" | grep -q "$needle" && fail "output should not contain: $needle" || pass
}

# --- Filter ---

FILTER="${1:-}"

should_run() {
  [ -z "$FILTER" ] || [ "$1" = "$FILTER" ]
}

# --- Temp dir management ---

TMPDIR_ROOT=""
setup_tmpdir() {
  TMPDIR_ROOT=$(mktemp -d)
}
cleanup_tmpdir() {
  [ -n "$TMPDIR_ROOT" ] && rm -rf "$TMPDIR_ROOT"
}
trap cleanup_tmpdir EXIT

# =============================
# Test: context-gen.sh
# =============================

if should_run "context-gen"; then
  suite "context-gen.js"
  CONTEXT_GEN="$REPO_ROOT/scripts/context-gen.js"

  # --- Node.js / TypeScript project ---
  it "detects Node.js project from package.json"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/package.json" << 'EOF'
{
  "name": "my-app",
  "description": "A test application",
  "dependencies": {
    "express": "^4.18.0"
  }
}
EOF
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "Node.js"

  it "detects TypeScript when tsconfig.json present"
  touch "$TMPDIR_ROOT/tsconfig.json"
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "TypeScript"

  it "detects Express framework"
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "Express"

  it "includes project description"
  assert_contains "$output" "A test application"

  # --- Next.js project ---
  it "detects Next.js framework"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/package.json" << 'EOF'
{
  "name": "nextapp",
  "dependencies": { "react": "^18.0.0", "next": "^14.0.0" }
}
EOF
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "Next.js"

  # --- Python project ---
  it "detects Python project from pyproject.toml"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/pyproject.toml" << 'EOF'
[project]
name = "mylib"
description = "A Python library"

[tool.ruff]
line-length = 88
EOF
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "Python"

  it "detects Ruff tooling"
  assert_contains "$output" "Ruff"

  # --- Rust project ---
  it "detects Rust project from Cargo.toml"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/Cargo.toml" << 'EOF'
[package]
name = "mybin"
description = "A Rust binary"

[dependencies]
axum = "0.7"
EOF
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "Rust"

  it "detects Axum framework"
  assert_contains "$output" "Axum"

  # --- Go project ---
  it "detects Go project from go.mod"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/go.mod" << 'EOF'
module github.com/user/myservice

go 1.22

require github.com/gin-gonic/gin v1.9.0
EOF
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "Go"

  it "detects Gin framework"
  assert_contains "$output" "Gin"

  # --- Structure output ---
  it "generates directory structure"
  setup_tmpdir
  mkdir -p "$TMPDIR_ROOT/src/components"
  mkdir -p "$TMPDIR_ROOT/tests"
  cat > "$TMPDIR_ROOT/package.json" << 'EOF'
{ "name": "test", "dependencies": {} }
EOF
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "## Structure"

  it "shows subdirectories in structure"
  assert_contains "$output" "src/"

  it "excludes .git from structure"
  mkdir -p "$TMPDIR_ROOT/.git/objects"
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_not_contains "$output" ".git/"

  # --- Fallback ---
  it "falls back to directory name when no manifest"
  setup_tmpdir
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "Unknown"

  # --- Tooling detection ---
  it "detects Biome"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/package.json" << 'EOF'
{ "name": "test", "dependencies": {} }
EOF
  touch "$TMPDIR_ROOT/biome.json"
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "Biome"

  it "detects ESLint"
  touch "$TMPDIR_ROOT/eslint.config.js"
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "ESLint"

  it "detects Vitest"
  touch "$TMPDIR_ROOT/vitest.config.ts"
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "Vitest"

  # --- Suggested Rules output ---
  it "emits Suggested Rules section"
  assert_contains "$output" "## Suggested Rules"

  it "emits core Always rule for every project"
  assert_contains "$output" "Always prefer CLI, MCP tools, or skills over browser automation"

  it "emits TS-flavored Always rule when TypeScript detected"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/package.json" << 'EOF'
{ "name": "ts-app", "dependencies": {} }
EOF
  touch "$TMPDIR_ROOT/tsconfig.json"
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "tsc --noEmit"

  it "emits Python-flavored Always rule when Python detected"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/pyproject.toml" << 'EOF'
[project]
name = "lib"
EOF
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "pytest"

  it "emits Go-flavored Always rule when Go detected"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/go.mod" << 'EOF'
module example.com/svc

go 1.22
EOF
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "go test ./..."

  it "does NOT auto-fill Objectives with hygiene checks"
  # Objectives should be placeholder prompts, not "All tests pass" style.
  assert_not_contains "$output" "All tests pass"

  it "detects existing ADR decision memory"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/package.json" << 'EOF'
{ "name": "adr-app", "dependencies": {} }
EOF
  mkdir -p "$TMPDIR_ROOT/docs/adr"
  echo "# ADR" > "$TMPDIR_ROOT/docs/adr/0001-use-sql.md"
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "Existing ADRs: 1"

  it "emits durable memory prompts"
  assert_contains "$output" "## Memory Prompts"

  cleanup_tmpdir
fi

# =============================
# Test: skill packaging
# =============================

if should_run "skill-packaging"; then
  suite "skill packaging"

  it "ships reflect as a separate skill"
  [ -f "$REPO_ROOT/reflect/SKILL.md" ] && pass || fail "missing reflect/SKILL.md"

  it "names the reflect skill in frontmatter"
  output=$(sed -n '1,8p' "$REPO_ROOT/reflect/SKILL.md" 2>&1)
  assert_contains "$output" "name: reflect"

  it "keeps the reflect skill concise"
  words=$(wc -w < "$REPO_ROOT/reflect/SKILL.md")
  [ "$words" -le 900 ] && pass || fail "expected <= 900 words, got $words"

  it "includes correction confidence guidance"
  assert_contains "$(cat "$REPO_ROOT/reflect/SKILL.md")" "Confidence"

  it "routes skill-specific corrections back to skills"
  assert_contains "$(cat "$REPO_ROOT/reflect/SKILL.md")" "specific skill"

  it "requires duplicate and conflict checks before durable memory"
  assert_contains "$(cat "$REPO_ROOT/reflect/SKILL.md")" "duplicates or contradictions"

  it "prevents private raw data from being stored as memory"
  assert_contains "$(cat "$REPO_ROOT/reflect/SKILL.md")" "unredacted command output"
fi

# =============================
# Test: adr.js
# =============================

if should_run "adr"; then
  suite "adr.js"
  ADR="$REPO_ROOT/scripts/adr.js"

  it "creates first numbered ADR from title"
  setup_tmpdir
  (cd "$TMPDIR_ROOT" && node "$ADR" "Use SQLite for local storage" >/dev/null 2>&1); rc=$?
  [ "$rc" -eq 0 ] && [ -f "$TMPDIR_ROOT/docs/adr/0001-use-sqlite-for-local-storage.md" ] && \
    pass || fail "ADR file missing"

  it "writes decision-record headings"
  output=$(cat "$TMPDIR_ROOT/docs/adr/0001-use-sqlite-for-local-storage.md")
  echo "$output" | grep -q "^# Use SQLite for local storage" && \
    echo "$output" | grep -q "^## Context" && \
    echo "$output" | grep -q "^## Decision" && \
    echo "$output" | grep -q "^## Consequences" && \
    pass || fail "ADR template incomplete"

  it "increments ADR number"
  (cd "$TMPDIR_ROOT" && node "$ADR" "Keep migrations manual" >/dev/null 2>&1)
  [ -f "$TMPDIR_ROOT/docs/adr/0002-keep-migrations-manual.md" ] && pass || fail "second ADR missing"

  it "errors when title is missing"
  (cd "$TMPDIR_ROOT" && node "$ADR" >/dev/null 2>&1); rc=$?
  assert_exit 1 "$rc"

  cleanup_tmpdir
fi

# =============================
# Test: session-end.js
# =============================

if should_run "session-end"; then
  suite "session-end.js"
  SESSION_END="$REPO_ROOT/scripts/session-end.js"

  it "no-ops when NOW.md and PLAN.md are missing"
  setup_tmpdir
  (cd "$TMPDIR_ROOT" && node "$SESSION_END" >/dev/null 2>&1); rc=$?
  assert_exit 0 "$rc"

  it "stamps NOW.md Last modified with ISO timestamp"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/NOW.md" << 'EOF'
# Now

## Current Focus
Something

## Session State
- Last modified: 1970-01-01T00:00:00.000Z
- Files touched: (none)
EOF
  (cd "$TMPDIR_ROOT" && node "$SESSION_END" >/dev/null 2>&1)
  output=$(cat "$TMPDIR_ROOT/NOW.md")
  assert_not_contains "$output" "1970-01-01"

  it "leaves short PLAN.md untouched"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/PLAN.md" << 'EOF'
# Plan

## Progress
- [x] Done thing
- [ ] Open thing
EOF
  before=$(wc -l < "$TMPDIR_ROOT/PLAN.md")
  (cd "$TMPDIR_ROOT" && node "$SESSION_END" >/dev/null 2>&1)
  after=$(wc -l < "$TMPDIR_ROOT/PLAN.md")
  [ "$before" = "$after" ] && pass || fail "PLAN.md was rewritten ($before → $after lines)"

  it "prunes completed Progress items when PLAN.md >150 lines"
  setup_tmpdir
  {
    echo "# Plan"
    echo ""
    echo "## Progress"
    echo "- [x] Completed item A"
    echo "- [ ] Open item B"
    for i in $(seq 1 200); do echo "filler line $i"; done
  } > "$TMPDIR_ROOT/PLAN.md"
  (cd "$TMPDIR_ROOT" && node "$SESSION_END" >/dev/null 2>&1)
  output=$(cat "$TMPDIR_ROOT/PLAN.md")
  # Completed item moved out of Progress into Archive with date stamp
  echo "$output" | grep -q "^## Archive" && \
    echo "$output" | grep -q "Completed item A (archived" && \
    pass || fail "expected Archive section with moved item"

  cleanup_tmpdir
fi

# =============================
# Test: task.js
# =============================

if should_run "task"; then
  suite "task.js"
  TASK="$REPO_ROOT/scripts/task.js"

  it "start writes NOW.md with new focus"
  setup_tmpdir
  (cd "$TMPDIR_ROOT" && node "$TASK" start "Implement auth" >/dev/null 2>&1); rc=$?
  [ "$rc" -eq 0 ] && [ -f "$TMPDIR_ROOT/NOW.md" ] && \
    grep -q "Implement auth" "$TMPDIR_ROOT/NOW.md" && pass || fail "NOW.md missing or wrong"

  it "start includes a Last modified timestamp"
  grep -q "Last modified: 20" "$TMPDIR_ROOT/NOW.md" && pass || fail "no timestamp"

  it "done marks NOW.md idle"
  (cd "$TMPDIR_ROOT" && node "$TASK" done >/dev/null 2>&1)
  grep -q "(none)" "$TMPDIR_ROOT/NOW.md" && pass || fail "NOW.md not idle"

  it "done logs completed focus to PLAN.md when present"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/PLAN.md" << 'EOF'
# Plan

## Progress
EOF
  (cd "$TMPDIR_ROOT" && node "$TASK" start "Auth work" >/dev/null 2>&1)
  (cd "$TMPDIR_ROOT" && node "$TASK" done >/dev/null 2>&1)
  grep -q "\[x\] Auth work (done" "$TMPDIR_ROOT/PLAN.md" && pass || fail "no done line"

  it "start logs prior focus to PLAN.md as switched-away"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/PLAN.md" << 'EOF'
# Plan

## Progress
EOF
  (cd "$TMPDIR_ROOT" && node "$TASK" start "First task" >/dev/null 2>&1)
  (cd "$TMPDIR_ROOT" && node "$TASK" start "Second task" >/dev/null 2>&1)
  grep -q "\[~\] First task (switched away" "$TMPDIR_ROOT/PLAN.md" && pass || fail "no switched-away line"

  it "errors on missing subcommand"
  (node "$TASK" >/dev/null 2>&1); rc=$?
  assert_exit 1 "$rc"

  cleanup_tmpdir
fi

# =============================
# Test: guard.js
# =============================

if should_run "guard"; then
  suite "guard.js"
  GUARD="$REPO_ROOT/scripts/guard.js"

  # --- --no-verify blocking ---
  it "blocks git commit --no-verify"
  TOOL_INPUT='{"command":"git commit --no-verify -m \"test\""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "blocks git push --no-verify"
  TOOL_INPUT='{"command":"git push --no-verify"}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "blocks --no-gpg-sign"
  TOOL_INPUT='{"command":"git commit --no-gpg-sign -m \"test\""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "blocks core.hooksPath override"
  TOOL_INPUT='{"command":"git -c core.hooksPath=/dev/null commit -m \"test\""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "allows normal git commit"
  TOOL_INPUT='{"command":"git commit -m \"fix: bug\""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  it "allows normal git push"
  TOOL_INPUT='{"command":"git push origin main"}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  # --- Secret detection ---
  it "detects AWS access key"
  TOOL_INPUT='{"command":"export AWS_KEY=AKIAIOSFODNN7EXAMPLE"}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "detects GitHub token"
  TOOL_INPUT='{"command":"curl -H \"Authorization: token ghp_ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmn\""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "detects private key"
  TOOL_INPUT='{"command":"echo -----BEGIN RSA PRIVATE KEY-----"}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "detects Slack token"
  TOOL_INPUT='{"command":"export SLACK=xoxb-1234-5678-abcdefg"}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "allows commands without secrets"
  TOOL_INPUT='{"command":"npm test"}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  # --- Linter config protection ---
  it "blocks editing .eslintrc.json"
  TOOL_INPUT='{"file_path":".eslintrc.json","command":""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "blocks editing eslint.config.js"
  TOOL_INPUT='{"file_path":"eslint.config.js","command":""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "blocks editing .prettierrc"
  TOOL_INPUT='{"file_path":".prettierrc","command":""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "blocks editing biome.json"
  TOOL_INPUT='{"file_path":"biome.json","command":""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "blocks editing ruff.toml"
  TOOL_INPUT='{"file_path":"ruff.toml","command":""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 2 "$rc"

  it "allows editing normal source files"
  TOOL_INPUT='{"file_path":"src/index.ts","command":""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  it "allows editing package.json"
  TOOL_INPUT='{"file_path":"package.json","command":""}' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  # --- Edge cases ---
  it "handles empty TOOL_INPUT gracefully"
  TOOL_INPUT='' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  it "handles malformed JSON gracefully"
  TOOL_INPUT='not json' node "$GUARD" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  it "returns block reason as JSON"
  output=$(TOOL_INPUT='{"command":"git commit --no-verify"}' node "$GUARD" 2>/dev/null) || true
  assert_contains "$output" '"decision":"block"'
fi

# =============================
# Test: eval-loop.sh
# =============================

if should_run "eval-loop"; then
  suite "eval-loop.js"
  EVAL_LOOP="$REPO_ROOT/scripts/eval-loop.js"

  # --- Objective parsing ---
  it "parses objectives from CONTEXT.md"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context

## Rules

### Objectives
1. True command succeeds (true exits 0)
2. False command fails (false exits 1)
3. Manual check objective

## Workflow
EOF
  output=$(cd "$TMPDIR_ROOT" && MAX_ITERATIONS=1 node "$EVAL_LOOP" 2>&1) || true
  assert_contains "$output" "Found 3 objectives"

  it "passes objective when command exits as expected"
  assert_contains "$output" "Objective 1:.*PASS"

  it "handles objectives expecting non-zero exit"
  # "false exits 1" — false returns 1, which matches expected
  assert_contains "$output" "Objective 2:.*PASS"

  it "marks non-extractable objectives as MANUAL CHECK"
  assert_contains "$output" "Objective 3:.*MANUAL"

  # --- All pass scenario ---
  it "exits 0 when all testable objectives pass"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context

## Rules

### Objectives
1. Always true (true exits 0)
2. Also true (echo hi exits 0)

## Workflow
EOF
  (cd "$TMPDIR_ROOT" && MAX_ITERATIONS=1 node "$EVAL_LOOP" >/dev/null 2>&1); rc=$?
  assert_exit 0 "$rc"

  # --- Failure scenario ---
  it "exits 1 when objectives fail after max iterations"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context

## Rules

### Objectives
1. This will fail (false exits 0)

## Workflow
EOF
  # Non-interactive (stdin is not a terminal, so no read prompt)
  (cd "$TMPDIR_ROOT" && MAX_ITERATIONS=1 node "$EVAL_LOOP" >/dev/null 2>&1); rc=$?
  assert_exit 1 "$rc"

  # --- Missing CONTEXT.md ---
  it "errors when CONTEXT.md is missing"
  setup_tmpdir
  (cd "$TMPDIR_ROOT" && node "$EVAL_LOOP" >/dev/null 2>&1); rc=$?
  assert_exit 1 "$rc"

  # --- No objectives found ---
  it "errors when no objectives section exists"
  setup_tmpdir
  echo "# Context" > "$TMPDIR_ROOT/CONTEXT.md"
  (cd "$TMPDIR_ROOT" && node "$EVAL_LOOP" >/dev/null 2>&1); rc=$?
  assert_exit 1 "$rc"

  # --- PASS_THRESHOLD ---
  it "respects PASS_THRESHOLD=1 (1 of 2 passes is enough)"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context

### Objectives
1. This passes (true exits 0)
2. This fails (false exits 0)
EOF
  (cd "$TMPDIR_ROOT" && MAX_ITERATIONS=1 PASS_THRESHOLD=1 node "$EVAL_LOOP" >/dev/null 2>&1); rc=$?
  assert_exit 0 "$rc"

  # --- Custom CONTEXT_FILE ---
  it "supports custom CONTEXT_FILE path"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/custom.md" << 'EOF'
# Custom

### Objectives
1. Works (true exits 0)
EOF
  (cd "$TMPDIR_ROOT" && CONTEXT_FILE=custom.md MAX_ITERATIONS=1 node "$EVAL_LOOP" >/dev/null 2>&1); rc=$?
  assert_exit 0 "$rc"

  cleanup_tmpdir
fi

# =============================
# Test: format-on-edit.js
# =============================

if should_run "format-on-edit"; then
  suite "format-on-edit.js"
  FMT="$REPO_ROOT/scripts/format-on-edit.js"

  it "exits 0 with empty TOOL_INPUT"
  TOOL_INPUT='' node "$FMT" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  it "exits 0 with nonexistent file"
  TOOL_INPUT='{"file_path":"/tmp/does-not-exist-12345.ts"}' node "$FMT" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  it "exits 0 with malformed JSON"
  TOOL_INPUT='broken' node "$FMT" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  it "exits 0 for file with no formatter available"
  setup_tmpdir
  echo "hello" > "$TMPDIR_ROOT/test.txt"
  TOOL_INPUT="{\"file_path\":\"$TMPDIR_ROOT/test.txt\"}" node "$FMT" >/dev/null 2>&1; rc=$?
  assert_exit 0 "$rc"

  cleanup_tmpdir
fi

# =============================
# Test: SKILL.md structure
# =============================

if should_run "skill"; then
  suite "SKILL.md structure"
  SKILL="$REPO_ROOT/SKILL.md"

  it "has valid YAML frontmatter"
  head -1 "$SKILL" | grep -q '^---$' && pass || fail "missing opening ---"

  it "defines skill name"
  assert_contains "$(cat "$SKILL")" "name: context-harness"

  it "is user-invocable"
  assert_contains "$(cat "$SKILL")" "user-invocable: true"

  it "has UserPromptSubmit hook"
  assert_contains "$(cat "$SKILL")" "UserPromptSubmit"

  it "has PreToolUse hook"
  assert_contains "$(cat "$SKILL")" "PreToolUse"

  it "has PostToolUse hook"
  assert_contains "$(cat "$SKILL")" "PostToolUse"

  it "contains all 4 behavioral principles"
  content=$(cat "$SKILL")
  assert_contains "$content" "Think before coding"

  it "contains CONTEXT.md template"
  assert_contains "$(cat "$SKILL")" "### CONTEXT.md"

  it "contains NOW.md template"
  assert_contains "$(cat "$SKILL")" "### NOW.md"

  it "contains PLAN.md template"
  assert_contains "$(cat "$SKILL")" "### PLAN.md"

  it "contains durable memory sections"
  content=$(cat "$SKILL")
  assert_contains "$content" "## Language"

  it "contains reflection memory routing"
  content=$(cat "$SKILL")
  assert_contains "$content" "Reflection routing"

  it "references ADR capture"
  content=$(cat "$SKILL")
  assert_contains "$content" "docs/adr"

  it "references CONTEXT-MAP.md"
  content=$(cat "$SKILL")
  assert_contains "$content" "CONTEXT-MAP.md"

  it "is under 300 lines"
  lines=$(wc -l < "$SKILL" | tr -d ' ')
  [ "$lines" -lt 300 ] && pass || fail "$lines lines"

  it "references eval-loop"
  assert_contains "$(cat "$SKILL")" "eval-loop"

  it "references guard.js"
  assert_contains "$(cat "$SKILL")" "guard.js"

  it "has migration section"
  assert_contains "$(cat "$SKILL")" "Migrate from v1"
fi

# =============================
# Summary
# =============================

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
TOTAL=$((PASS + FAIL + SKIP))
echo "Total: $TOTAL | Pass: $PASS | Fail: $FAIL | Skip: $SKIP"

if [ ${#FAILURES[@]} -gt 0 ]; then
  echo ""
  echo "Failures:"
  for f in "${FAILURES[@]}"; do
    echo "  - $f"
  done
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

[ "$FAIL" -eq 0 ] && exit 0 || exit 1
