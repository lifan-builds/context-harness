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
  echo "$haystack" | grep -q -- "$needle" && pass || fail "output missing: $needle"
}

assert_not_contains() {
  local haystack="$1" needle="$2"
  echo "$haystack" | grep -q -- "$needle" && fail "output should not contain: $needle" || pass
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

  # --- Suggested Operating Constraints output ---
  it "emits Suggested Operating Constraints section"
  assert_contains "$output" "## Suggested Operating Constraints"

  it "emits core operating constraint for every project"
  assert_contains "$output" "Do not store secrets or credentials in the repo"

  it "emits TS-flavored verification when TypeScript detected"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/package.json" << 'EOF'
{ "name": "ts-app", "dependencies": {} }
EOF
  touch "$TMPDIR_ROOT/tsconfig.json"
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "tsc --noEmit"

  it "emits Python-flavored verification when Python detected"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/pyproject.toml" << 'EOF'
[project]
name = "lib"
EOF
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "pytest"

  it "emits Go-flavored verification when Go detected"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/go.mod" << 'EOF'
module example.com/svc

go 1.22
EOF
  output=$(node "$CONTEXT_GEN" "$TMPDIR_ROOT" 2>&1)
  assert_contains "$output" "go test ./..."

  it "does not emit an Objectives section"
  assert_not_contains "$output" "### Objectives"

  it "emits Suggested Workflow verification"
  assert_contains "$output" "## Suggested Workflow"
  assert_contains "$output" "### Verification"

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

  it "emits AGENTS.md contract prompt"
  assert_contains "$output" "AGENTS.md"

  cleanup_tmpdir
fi

# =============================
# Test: install-project.js
# =============================

if should_run "install-project"; then
  suite "install-project.js"
  INSTALL_PROJECT="$REPO_ROOT/scripts/install-project.js"

  it "copies runtime scripts into a target repo"
  setup_tmpdir
  node "$INSTALL_PROJECT" "$TMPDIR_ROOT" >/dev/null 2>&1
  [ -f "$TMPDIR_ROOT/scripts/context-index.js" ] && pass || fail "missing copied context-index.js"

  it "copies shared lib dependency"
  [ -f "$TMPDIR_ROOT/scripts/lib.js" ] && pass || fail "missing copied lib.js"

  it "copies Codex context hook dispatcher"
  [ -f "$TMPDIR_ROOT/scripts/codex-context-hook.js" ] && pass || fail "missing copied codex-context-hook.js"

  it "installs 9 default scripts plus CommonJS package marker"
  count=$(find "$TMPDIR_ROOT/scripts" -type f | wc -l | tr -d ' ')
  [ "$count" -eq 10 ] && pass || fail "expected 10 files, got $count"

  it "marks runtime scripts as CommonJS"
  assert_contains "$(cat "$TMPDIR_ROOT/scripts/package.json")" '"type": "commonjs"'

  it "rejects removed legacy profile flag"
  setup_tmpdir
  output=$(node "$INSTALL_PROJECT" --profile legacy "$TMPDIR_ROOT" 2>&1); rc=$?
  [ "$rc" -ne 0 ] && echo "$output" | grep -q "Usage: install-project.js \[project-root\]" && pass || fail "expected removed profile to be rejected: $output"

  it "refuses to overwrite non-context-harness scripts"
  setup_tmpdir
  mkdir -p "$TMPDIR_ROOT/scripts"
  echo "console.log('project script');" > "$TMPDIR_ROOT/scripts/context-index.js"
  node "$INSTALL_PROJECT" "$TMPDIR_ROOT" >/dev/null 2>&1; rc=$?
  assert_exit 1 "$rc"

  cleanup_tmpdir
fi

# =============================
# Test: lib.js
# =============================

if should_run "lib"; then
  suite "lib.js"
  LIB="$REPO_ROOT/scripts/lib.js"

  it "normalizes Codex Bash stdin payload"
  output=$(printf '{"hook_event_name":"PreToolUse","tool_name":"Bash","tool_input":{"command":"git status"},"cwd":"/tmp/project"}' | node -e "const { readHookInput } = require('$LIB'); const input = readHookInput(); console.log(input.command + '|' + input.cwd + '|' + input.tool_name);")
  [ "$output" = "git status|/tmp/project|Bash" ] && pass || fail "unexpected normalized payload: $output"

  it "normalizes Codex file payload"
  output=$(printf '{"tool_name":"apply_patch","tool_input":{"file_path":"src/app.ts"}}' | node -e "const { readHookInput } = require('$LIB'); console.log(readHookInput().file_path);")
  [ "$output" = "src/app.ts" ] && pass || fail "unexpected file_path: $output"

  it "handles malformed hook input"
  output=$(printf 'not json' | node -e "const { readHookInput } = require('$LIB'); console.log(readHookInput().command);")
  [ "$output" = "not json" ] && pass || fail "unexpected malformed payload: $output"

  it "prefers nested context roots over parent git roots"
  setup_tmpdir
  mkdir -p "$TMPDIR_ROOT/parent/child"
  (cd "$TMPDIR_ROOT/parent" && git init >/dev/null 2>&1)
  touch "$TMPDIR_ROOT/parent/package.json"
  touch "$TMPDIR_ROOT/parent/child/CONTEXT.md"
  output=$(node -e "const { findProjectRoot } = require('$LIB'); console.log(findProjectRoot('$TMPDIR_ROOT/parent/child'));")
  [ "$output" = "$TMPDIR_ROOT/parent/child" ] && pass || fail "unexpected root: $output"
fi

# =============================
# Test: context-index.js
# =============================

if should_run "context-index"; then
  suite "context-index.js"
  CONTEXT_INDEX="$REPO_ROOT/scripts/context-index.js"

  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context

## Project
index-app is a test project.

## Operating Constraints
- Do not ignore the index.
- Refresh AGENTS.md after durable context changes.

## Language
- **Canonical term**: A durable term that should be queryable.
EOF
  cat > "$TMPDIR_ROOT/AGENTS.md" << 'EOF'
# Agent Instructions

## Context Contract
- Existing contract line.
EOF

  it "updates AGENTS.md with a managed context index"
  (cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" update >/dev/null 2>&1)
  output=$(cat "$TMPDIR_ROOT/AGENTS.md")
  assert_contains "$output" "Context Index"

  it "indexes CONTEXT.md sections without duplicating full context"
  assert_contains "$output" "CONTEXT.md#operating-constraints"

  it "preserves existing AGENTS.md contract text"
  assert_contains "$output" "Existing contract line"

  it "is idempotent when updating AGENTS.md repeatedly"
  (cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" update >/dev/null 2>&1)
  count=$(grep -c "## Context Index" "$TMPDIR_ROOT/AGENTS.md")
  [ "$count" -eq 1 ] && pass || fail "expected one Context Index heading, got $count"

  it "queries matching context sections"
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" query "canonical" 2>&1)
  assert_contains "$output" "Language"

  it "prints a named context section"
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" section "Operating Constraints" 2>&1)
  assert_contains "$output" "Do not ignore the index"

  it "creates default AGENTS.md with schema v3 marker"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context

## Project
schema-app is a test project.
EOF
  (cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" update >/dev/null 2>&1)
  output=$(cat "$TMPDIR_ROOT/AGENTS.md")
  assert_contains "$output" "context-harness:schema v3"

  it "check passes for a valid v3 harness"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v3 -->

## Project
check-app is a test project.

## Structure
```
.
```

## Operating Constraints
- Do not ignore checks.
- Refresh the index after context changes.

## Workflow
- Test: true

## Language
- **Check**: Harness validation.

## Relationships
- AGENTS indexes CONTEXT.

## Flagged Ambiguities
- None.

## Learned Patterns
- None yet.
EOF
  cat > "$TMPDIR_ROOT/NOW.md" << 'EOF'
# Now

## Current Focus
Check harness.

## Active Blockers
- None.

## Immediate Next Step
Run check.

## Session State
- Last modified: 2026-06-09T00:00:00.000Z
- Files touched: CONTEXT.md
EOF
  (cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" update >/dev/null 2>&1)
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1); rc=$?
  [ "$rc" -eq 0 ] && echo "$output" | grep -q "OK" && pass || fail "check failed: $output"

  it "check fails on stale AGENTS.md index"
  printf '\n## Extra\nnew\n' >> "$TMPDIR_ROOT/CONTEXT.md"
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1); rc=$?
  [ "$rc" -eq 1 ] && echo "$output" | grep -q "stale" && pass || fail "expected stale failure: $output"

  it "check fails on missing required sections"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v3 -->

## Project
too-small
EOF
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1); rc=$?
  [ "$rc" -eq 1 ] && echo "$output" | grep -q "missing ## Structure" && pass || fail "expected missing section failure: $output"

  it "check warns but passes on oversized PLAN.md"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v3 -->

## Project
check-app

## Structure
.

## Operating Constraints

## Workflow

## Language

## Relationships

## Flagged Ambiguities

## Learned Patterns
EOF
  cat > "$TMPDIR_ROOT/NOW.md" << 'EOF'
# Now
EOF
  for i in $(seq 1 151); do echo "line $i"; done > "$TMPDIR_ROOT/PLAN.md"
  (cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" update >/dev/null 2>&1)
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1); rc=$?
  [ "$rc" -eq 0 ] && echo "$output" | grep -q "WARN PLAN.md has" && pass || fail "expected PLAN size warning: $output"

  it "check fails for unsupported schema v2"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v2 -->

## Project
old-app

## Structure
.

## Operating Constraints

## Workflow

## Language

## Relationships

## Flagged Ambiguities

## Learned Patterns
EOF
  cat > "$TMPDIR_ROOT/AGENTS.md" << 'EOF'
# Agent Instructions
<!-- context-harness:schema v3 -->

## Context Index
<!-- context-harness:index:start -->
stale
<!-- context-harness:index:end -->
EOF
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1); rc=$?
  [ "$rc" -ne 0 ] && echo "$output" | grep -q "FAIL CONTEXT.md must use context-harness schema v3" && pass || fail "expected v2 failure: $output"

  it "check fails when Rules replaces Operating Constraints"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v3 -->

## Project
rules-app

## Structure
.

## Rules

## Workflow

## Language

## Relationships

## Flagged Ambiguities

## Learned Patterns
EOF
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1); rc=$?
  [ "$rc" -ne 0 ] && echo "$output" | grep -q "FAIL CONTEXT.md is missing ## Operating Constraints" && pass || fail "expected Operating Constraints failure: $output"

  it "update writes progressive context library cards and chunks"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v3 -->

## Project
progressive-app

## Structure
.

## Operating Constraints
- Hydrate context before opening bulky files.

## Workflow
- Test: true

## Language
- **Card**: A compact retrieval handle.

## Relationships
EOF
  for i in $(seq 1 85); do echo "- Relation line $i preserves a durable architecture detail."; done >> "$TMPDIR_ROOT/CONTEXT.md"
  cat >> "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'

## Flagged Ambiguities
- None.

## Learned Patterns
- None yet.
EOF
  cat > "$TMPDIR_ROOT/NOW.md" << 'EOF'
# Now

## Current Focus
Progressive library test.
EOF
  (cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" update >/dev/null 2>&1)
  [ -f "$TMPDIR_ROOT/.context-harness/index.json" ] && \
    [ -f "$TMPDIR_ROOT/.context-harness/cards/ctx-context-relationships.md" ] && \
    [ -f "$TMPDIR_ROOT/.context-harness/chunks/ctx-context-relationships.md" ] && pass || fail "missing progressive library files"

  it "hydrate returns a retrieval packet without dumping raw chunks"
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" hydrate "architecture detail" 2>&1)
  echo "$output" | grep -q "Always-read layer" && \
    echo "$output" | grep -q "Open first for progressive detail" && \
    echo "$output" | grep -q "Open next only if needed" && \
    echo "$output" | grep -q "Retrieval evidence" && \
    echo "$output" | grep -q "ctx-context-relationships" && \
    echo "$output" | grep -q "raw detail on demand" && \
    ! echo "$output" | grep -q "Relation line 84" && pass || fail "unexpected hydrate output: $output"

  it "generated cards describe retrieval order before raw source"
  card=$(cat "$TMPDIR_ROOT/.context-harness/cards/ctx-context-relationships.md")
  assert_contains "$card" "Retrieval order"
  assert_contains "$card" "Use this card before opening bulky"

  it "hydrate warns on stale manifest without stale card open guidance"
  node -e "const fs=require('fs'); const f='$TMPDIR_ROOT/.context-harness/index.json'; const j=JSON.parse(fs.readFileSync(f,'utf8')); j.source_hash='stale'; fs.writeFileSync(f, JSON.stringify(j, null, 2)+'\\n');"
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" hydrate "architecture detail" 2>&1); rc=$?
  [ "$rc" -eq 0 ] && \
    echo "$output" | grep -q "generated card files may be stale" && \
    echo "$output" | grep -q "source section:" && \
    echo "$output" | grep -q "Retrieval evidence" && \
    ! echo "$output" | grep -q "open card:" && pass || fail "expected stale hydrate warning without open card: $output"

  it "check fails when the context library manifest is stale"
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1); rc=$?
  [ "$rc" -eq 1 ] && echo "$output" | grep -q ".context-harness/index.json is stale" && pass || fail "expected stale library failure: $output"

  cleanup_tmpdir
fi

# =============================
# Test: eval-agent-problem-solving.js
# =============================

if should_run "eval-agent-problem-solving"; then
  suite "eval-agent-problem-solving.js"
  EVAL_AGENT="$REPO_ROOT/scripts/eval-agent-problem-solving.js"

  it "prepares no-harness flat-harness and progressive fresh-agent eval cases"
  setup_tmpdir
  mkdir -p "$TMPDIR_ROOT/projects/demo/.git"
  cat > "$TMPDIR_ROOT/projects/demo/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v3 -->

## Project
demo project

## Structure
.

## Operating Constraints
- Do not delete demo data.
- Preserve demo data.

## Workflow
- Verification: npm test

## Language

## Relationships

## Flagged Ambiguities

## Learned Patterns
EOF
  cat > "$TMPDIR_ROOT/projects/demo/NOW.md" << 'EOF'
# Now

## Current Focus
Ship the demo evaluator.

## Active Blockers
- None.

## Immediate Next Step
Run npm test and review the eval report.
EOF
  cat > "$TMPDIR_ROOT/projects/demo/PLAN.md" << 'EOF'
# Demo Plan

## Progress
- [ ] Verify evaluator.

## Verification
- npm test
EOF
  echo '{"scripts":{"test":"true"}}' > "$TMPDIR_ROOT/projects/demo/package.json"
  echo 'SECRET=demo' > "$TMPDIR_ROOT/projects/demo/.env"
  echo 'SECRET=demo' > "$TMPDIR_ROOT/projects/demo/.env.local"
  echo 'cookie demo' > "$TMPDIR_ROOT/projects/demo/cookies.txt"
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" prepare "$TMPDIR_ROOT/projects" --sample 1 --scenarios cold-resume,next-step --output "$TMPDIR_ROOT/eval" 2>&1); rc=$?
  [ "$rc" -eq 0 ] && \
    [ -f "$TMPDIR_ROOT/eval/cases/demo__cold-resume__no-harness/prompt.md" ] && \
    [ -f "$TMPDIR_ROOT/eval/cases/demo__cold-resume__flat-harness/prompt.md" ] && \
    [ -f "$TMPDIR_ROOT/eval/cases/demo__cold-resume__progressive-harness/prompt.md" ] && \
    [ -f "$TMPDIR_ROOT/eval/cases/demo__cold-resume__progressive-harness/trace.md" ] && \
    [ ! -f "$TMPDIR_ROOT/eval/cases/demo__cold-resume__no-harness/repo/CONTEXT.md" ] && \
    [ -f "$TMPDIR_ROOT/eval/cases/demo__cold-resume__flat-harness/repo/CONTEXT.md" ] && \
    [ ! -d "$TMPDIR_ROOT/eval/cases/demo__cold-resume__flat-harness/repo/.context-harness" ] && \
    [ -f "$TMPDIR_ROOT/eval/cases/demo__cold-resume__progressive-harness/repo/CONTEXT.md" ] && \
    [ ! -f "$TMPDIR_ROOT/eval/cases/demo__cold-resume__progressive-harness/repo/.env" ] && \
    [ ! -f "$TMPDIR_ROOT/eval/cases/demo__cold-resume__progressive-harness/repo/.env.local" ] && \
    [ ! -f "$TMPDIR_ROOT/eval/cases/demo__cold-resume__progressive-harness/repo/cookies.txt" ] && pass || fail "prepare failed: $output"

  it "uses operating constraints and requires progressive evidence"
  node -e "const fs=require('fs'); const e=JSON.parse(fs.readFileSync('$TMPDIR_ROOT/eval/cases/demo__next-step__progressive-harness/expected.json','utf8')); const p=fs.readFileSync('$TMPDIR_ROOT/eval/cases/demo__next-step__progressive-harness/prompt.md','utf8'); if(e.mustMention.includes('### Never')) process.exit(1); if(!e.mustMention.includes('constraints')) process.exit(2); if(!e.expectedCards.includes('ctx-context-operating-constraints')) process.exit(3); if(!p.includes('Context Evidence')) process.exit(4); if(!p.includes('hydrate')) process.exit(5);"
  [ "$?" -eq 0 ] && pass || fail "expected operating constraint and evidence prompt"

  it "can prepare only selected modes"
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" prepare "$TMPDIR_ROOT/projects" --sample 1 --scenarios cold-resume --modes progressive-harness --output "$TMPDIR_ROOT/eval-progressive-only" 2>&1); rc=$?
  [ "$rc" -eq 0 ] && \
    [ -f "$TMPDIR_ROOT/eval-progressive-only/cases/demo__cold-resume__progressive-harness/prompt.md" ] && \
    [ ! -e "$TMPDIR_ROOT/eval-progressive-only/cases/demo__cold-resume__no-harness" ] && \
    [ ! -e "$TMPDIR_ROOT/eval-progressive-only/cases/demo__cold-resume__flat-harness" ] && pass || fail "mode-filter prepare failed: $output"

  it "fill-pending dry-run lists only empty result cases"
  echo "already done" > "$TMPDIR_ROOT/eval/cases/demo__cold-resume__no-harness/result.md"
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" fill-pending "$TMPDIR_ROOT/eval" --scenarios cold-resume --dry-run 2>&1); rc=$?
  [ "$rc" -eq 0 ] && \
    echo "$output" | grep -q "Pending cases: 2" && \
    ! echo "$output" | grep -q "demo__cold-resume__no-harness" && \
    echo "$output" | grep -q "demo__cold-resume__flat-harness" && \
    echo "$output" | grep -q "demo__cold-resume__progressive-harness" && pass || fail "expected pending dry-run list: $output"

  it "fill-pending resumes without overwriting completed results"
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" fill-pending "$TMPDIR_ROOT/eval" --scenarios cold-resume --command "printf filled > {resultPath}" 2>&1); rc=$?
  [ "$rc" -eq 0 ] && \
    [ "$(cat "$TMPDIR_ROOT/eval/cases/demo__cold-resume__no-harness/result.md")" = "already done" ] && \
    [ "$(cat "$TMPDIR_ROOT/eval/cases/demo__cold-resume__flat-harness/result.md")" = "filled" ] && \
    [ "$(cat "$TMPDIR_ROOT/eval/cases/demo__cold-resume__progressive-harness/result.md")" = "filled" ] && pass || fail "expected resumable fill: $output"

  it "scores supplied fresh-agent eval results"
  cat > "$TMPDIR_ROOT/eval/cases/demo__cold-resume__progressive-harness/result.md" << 'EOF'
Current focus: Ship the demo evaluator.
Active blockers: None.
Immediate next step: Run npm test and review the eval report.
Verification command: npm test.
Relevant files include context-maintain Dream/Compact workflow.
Context Evidence: read NOW.md and concise CONTEXT.md, ran node scripts/context-index.js hydrate "resume current task", selected ctx-now-now and ctx-context-workflow from .context-harness/cards before any PLAN.md detail.
EOF
  cat > "$TMPDIR_ROOT/eval/cases/demo__cold-resume__progressive-harness/trace.md" << 'EOF'
Read NOW.md
Read CONTEXT.md
Bash node scripts/context-index.js hydrate "resume current task"
selected_cards: ctx-now-now, ctx-context-workflow
open card: .context-harness/cards/ctx-now-now.md
EOF
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" score "$TMPDIR_ROOT/eval" 2>&1); rc=$?
  [ "$rc" -eq 0 ] && \
    echo "$output" | grep -q "Fresh Agent Problem-Solving Eval" && \
    echo "$output" | grep -q "Modes: no-harness, flat-harness, progressive-harness" && \
    echo "$output" | grep -q "retrieval 10/10" && pass || fail "score failed: $output"

  it "can score a completed scenario slice"
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" score "$TMPDIR_ROOT/eval" --scenarios cold-resume 2>&1); rc=$?
  [ "$rc" -eq 0 ] && \
    echo "$output" | grep -q "cold-resume" && \
    ! echo "$output" | grep -q "next-step" && pass || fail "expected scoped score: $output"

  it "gate fails when progressive evidence is incomplete"
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" score "$TMPDIR_ROOT/eval" --gate 2>&1); rc=$?
  [ "$rc" -ne 0 ] && echo "$output" | grep -q "Gate: fail" && pass || fail "expected gate failure: $output"

  it "treats high-scoring answer-only misses as review notes"
  setup_tmpdir
  mkdir -p "$TMPDIR_ROOT/projects/demo/.git"
  cat > "$TMPDIR_ROOT/projects/demo/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v3 -->

## Project
demo project

## Structure
.

## Operating Constraints
- Preserve demo data.

## Workflow
- Verification: npm test

## Language

## Relationships

## Flagged Ambiguities

## Learned Patterns
EOF
  cat > "$TMPDIR_ROOT/projects/demo/NOW.md" << 'EOF'
# Now

## Current Focus
Ship the demo evaluator.

## Active Blockers
- None.

## Immediate Next Step
Run npm test and review the eval report.
EOF
  cat > "$TMPDIR_ROOT/projects/demo/PLAN.md" << 'EOF'
# Demo Plan

## Progress
- [ ] Verify evaluator.

## Verification
- npm test
EOF
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" prepare "$TMPDIR_ROOT/projects" --sample 1 --scenarios next-step --modes progressive-harness --output "$TMPDIR_ROOT/eval-answer-note" 2>&1); rc=$?
  cat > "$TMPDIR_ROOT/eval-answer-note/cases/demo__next-step__progressive-harness/result.md" << 'EOF'
Current understanding: Ship the demo evaluator.
Immediate next step: Run npm test and review the eval report.
Active caveats: preserve demo data.
Verification command/check: npm test.
Context Evidence: read NOW.md and concise CONTEXT.md, ran node scripts/context-index.js hydrate "plan next implementation step", selected ctx-context-operating-constraints and ctx-context-workflow from .context-harness/cards before PLAN.md.
EOF
  cat > "$TMPDIR_ROOT/eval-answer-note/cases/demo__next-step__progressive-harness/trace.md" << 'EOF'
Read NOW.md
Read CONTEXT.md
Bash node scripts/context-index.js hydrate "plan next implementation step"
selected_cards: ctx-context-operating-constraints, ctx-context-workflow
open card: .context-harness/cards/ctx-context-operating-constraints.md
EOF
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" score "$TMPDIR_ROOT/eval-answer-note" --gate 2>&1); rc=$?
  [ "$rc" -eq 0 ] && echo "$output" | grep -q "Gate: pass" && pass || fail "expected answer-only miss gate pass: $output"

  it "semantic expected facts tolerate paraphrase"
  node -e "const fs=require('fs'); const s=JSON.parse(fs.readFileSync('$TMPDIR_ROOT/eval-answer-note/cases/demo__next-step__progressive-harness/score.json','utf8')); if(s.missing.length) { console.error(s.missing.join('; ')); process.exit(1); } if(s.answerScore !== 10) process.exit(2);"
  [ "$?" -eq 0 ] && pass || fail "expected semantic paraphrase score"

  it "answer-only misses remain review notes when retrieval evidence is strong"
  node -e "const fs=require('fs'); const f='$TMPDIR_ROOT/eval-answer-note/cases/demo__next-step__progressive-harness/expected.json'; const e=JSON.parse(fs.readFileSync(f,'utf8')); e.mustMention.push('pytest unmentioned command one', 'pytest unmentioned command two'); fs.writeFileSync(f, JSON.stringify(e, null, 2)+'\\n');"
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" score "$TMPDIR_ROOT/eval-answer-note" --gate 2>&1); rc=$?
  [ "$rc" -eq 0 ] && echo "$output" | grep -q "needs-review" && echo "$output" | grep -q "missing: pytest unmentioned command" && pass || fail "expected answer-only review note gate pass: $output"

  it "mustAvoid remains strict"
  cat > "$TMPDIR_ROOT/eval-answer-note/cases/demo__next-step__progressive-harness/result.md" << 'EOF'
Current understanding: Ship the demo evaluator.
Immediate next step: Run npm test and review the eval report.
Active caveats: preserve demo data.
Verification command/check: npm test.
Bad drift: read DREAM.md during catch-up.
Context Evidence: read NOW.md and concise CONTEXT.md, ran node scripts/context-index.js hydrate "plan next implementation step", selected ctx-context-operating-constraints and ctx-context-workflow from .context-harness/cards before PLAN.md.
EOF
  output=$(cd "$REPO_ROOT" && node "$EVAL_AGENT" score "$TMPDIR_ROOT/eval-answer-note" --gate 2>&1); rc=$?
  [ "$rc" -ne 0 ] && echo "$output" | grep -q "harness-drift-priority-gap" && pass || fail "expected mustAvoid gate failure: $output"

  cleanup_tmpdir
fi

# =============================
# Test: eval-context-library.js
# =============================

if should_run "eval-context-library"; then
  suite "eval-context-library.js"
  EVAL_CONTEXT_LIBRARY="$REPO_ROOT/scripts/eval-context-library.js"

  it "parses retrieval-packet hydrate cards in real-project shadow eval"
  setup_tmpdir
  mkdir -p "$TMPDIR_ROOT/projects/demo/.git"
  cat > "$TMPDIR_ROOT/projects/demo/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v3 -->

## Project
demo project

## Structure
.

## Operating Constraints
- Preserve demo data.

## Workflow
- Verification: npm test
- Deployment: npm run deploy

## Language

## Relationships

## Flagged Ambiguities

## Learned Patterns
- Run hydrate before bulky task context.
EOF
  cat > "$TMPDIR_ROOT/projects/demo/NOW.md" << 'EOF'
# Now

## Current Focus
Ship the demo evaluator.

## Active Blockers
- None.

## Immediate Next Step
Run npm test.
EOF
  cat > "$TMPDIR_ROOT/projects/demo/AGENTS.md" << 'EOF'
# Agent Instructions
<!-- context-harness:schema v3 -->

## Context Contract
- Read NOW and CONTEXT.

## Context Index
<!-- context-harness:index:start -->
<!-- context-harness:index:end -->
EOF
  output=$(cd "$REPO_ROOT" && node "$EVAL_CONTEXT_LIBRARY" "$TMPDIR_ROOT/projects" "$TMPDIR_ROOT/report.md" 2>&1); rc=$?
  [ "$rc" -eq 0 ] && \
    echo "$output" | grep -q "Pass: 1" && \
    echo "$output" | grep -q "resume current task: ctx-now-now" && \
    echo "$output" | grep -q "run tests: ctx-context-workflow" && pass || fail "shadow eval failed: $output"

  cleanup_tmpdir
fi

# =============================
# Test: release proof artifacts
# =============================

if should_run "release-proof"; then
  suite "release proof artifacts"

  it "proves catch-up timing is fresh-session only"
  output=$(cat "$REPO_ROOT/context-catch-up/SKILL.md")
  assert_contains "$output" "fresh-session or true-resume boundary"
  assert_contains "$output" "Do not invoke during ordinary mid-session follow-up turns"
  assert_contains "$output" "Read \`NOW.md\` first"
  assert_contains "$output" "Read concise \`CONTEXT.md\`"
  assert_contains "$output" "opening \`PLAN.md\`, chunks, or bulky"
  assert_contains "$output" "stale generated"
  assert_contains "$output" "current markdown fallback context"
  assert_contains "$output" "unless the drift blocks correctness or safety"

  it "proves maintain owns ongoing updates and closeout"
  output=$(cat "$REPO_ROOT/context-maintain/SKILL.md")
  assert_contains "$output" "update context, capture lessons"
  assert_contains "$output" "## Routing"
  assert_contains "$output" "## Session Closeout"
  assert_contains "$output" "hydrate \"update context after current work\""
  assert_contains "$output" "resume packet to \`NOW.md\` last"

  it "proves maintain owns Dream and plan stress-tests"
  output=$(cat "$REPO_ROOT/context-maintain/SKILL.md")
  assert_contains "$output" "## Plan Stress-Test"
  assert_contains "$output" "## Dream/Compact Mode"

  it "proves upgrade cannot be implicitly invoked"
  output=$(cat "$REPO_ROOT/context-upgrade/SKILL.md")
  assert_contains "$output" "disable-model-invocation: true"
  assert_contains "$output" "implicitly just because"
  assert_contains "$(cat "$REPO_ROOT/context-upgrade/agents/openai.yaml")" "allow_implicit_invocation: false"

  it "proves upgrade owns conservative fleet refresh"
  assert_contains "$output" "Fleet Refresh Guardrails"
  assert_contains "$output" "skip dirty repos by"
  assert_contains "$output" "Preserve project-specific context"
  assert_contains "$output" "track skipped/failed repos"

  it "proves set-goal has long-running goal shape"
  output=$(cat "$REPO_ROOT/set-goal/SKILL.md")
  assert_contains "$output" "goal mode, loop mode, or a fresh agent"
  assert_contains "$output" "## Done Means"
  assert_contains "$output" "## Milestones"
  assert_contains "$output" "## Verification"
  assert_contains "$output" "## Loop Rules"
  assert_contains "$output" "## Closeout"

  it "proves deprecated skill stubs are removed"
  [ ! -e "$REPO_ROOT/context-launch/SKILL.md" ] && \
    [ ! -e "$REPO_ROOT/context-handoff/SKILL.md" ] && \
    [ ! -e "$REPO_ROOT/context-grill/SKILL.md" ] && pass || fail "deprecated skill stub still exists"

  it "proves context-init does not repair existing layouts"
  output=$(cat "$REPO_ROOT/context-init/SKILL.md")
  assert_contains "$output" "Init does not repair existing layouts"
  assert_not_contains "$output" "Migration Flow"

  it "proves obsolete legacy scripts are removed"
  [ ! -e "$REPO_ROOT/scripts/adr.js" ] && \
    [ ! -e "$REPO_ROOT/scripts/eval-loop.js" ] && \
    [ ! -e "$REPO_ROOT/scripts/migrate-project.js" ] && pass || fail "obsolete legacy script still exists"

  it "ships a cold-resume demo artifact"
  [ -f "$REPO_ROOT/examples/cold-resume-demo.md" ] && pass || fail "missing cold-resume demo"

  it "cold-resume demo shows selective context recovery"
  output=$(cat "$REPO_ROOT/examples/cold-resume-demo.md")
  assert_contains "$output" 'Read `NOW.md`'
  assert_contains "$output" 'Read `AGENTS.md`'
  assert_contains "$output" 'Choose relevant `CONTEXT.md` sections'
  assert_contains "$output" "Correct Next Action"
fi

# =============================
# Test: skill packaging
# =============================

if should_run "skill-packaging"; then
  suite "skill packaging"

  it "ships context-maintain as a separate skill"
  [ -f "$REPO_ROOT/context-maintain/SKILL.md" ] && pass || fail "missing context-maintain/SKILL.md"

  it "names the context-maintain skill in frontmatter"
  output=$(sed -n '1,8p' "$REPO_ROOT/context-maintain/SKILL.md" 2>&1)
  assert_contains "$output" "name: context-maintain"

  it "ships context-init as a separate skill"
  [ -f "$REPO_ROOT/context-init/SKILL.md" ] && pass || fail "missing context-init/SKILL.md"

  it "ships context-catch-up as a separate skill"
  [ -f "$REPO_ROOT/context-catch-up/SKILL.md" ] && pass || fail "missing context-catch-up/SKILL.md"

  it "does not ship context-grill"
  [ ! -e "$REPO_ROOT/context-grill/SKILL.md" ] && pass || fail "unexpected context-grill/SKILL.md"

  it "ships set-goal as a separate skill"
  [ -f "$REPO_ROOT/set-goal/SKILL.md" ] && pass || fail "missing set-goal/SKILL.md"

  it "does not ship context-launch"
  [ ! -e "$REPO_ROOT/context-launch/SKILL.md" ] && pass || fail "unexpected context-launch/SKILL.md"

  it "does not ship context-handoff"
  [ ! -e "$REPO_ROOT/context-handoff/SKILL.md" ] && pass || fail "unexpected context-handoff/SKILL.md"

  it "names the set-goal skill in frontmatter"
  output=$(sed -n '1,8p' "$REPO_ROOT/set-goal/SKILL.md" 2>&1)
  assert_contains "$output" "name: set-goal"

  it "context-maintain owns plan stress-tests"
  output=$(cat "$REPO_ROOT/context-maintain/SKILL.md")
  assert_contains "$output" "## Plan Stress-Test"
  assert_contains "$output" "Ask only where human judgment changes"

  it "context-maintain recommends answers during stress-tests"
  assert_contains "$(cat "$REPO_ROOT/context-maintain/SKILL.md")" "include a recommended answer"

  it "set-goal produces ready-to-paste Codex goals"
  output=$(cat "$REPO_ROOT/set-goal/SKILL.md")
  assert_contains "$output" "ready-to-paste goal block"
  assert_contains "$output" "Done Means"
  assert_contains "$output" "Loop Rules"

  it "context-upgrade is explicit-only"
  output=$(sed -n '1,12p' "$REPO_ROOT/context-upgrade/SKILL.md")
  assert_contains "$output" "disable-model-invocation: true"
  assert_contains "$(cat "$REPO_ROOT/context-upgrade/agents/openai.yaml")" "allow_implicit_invocation: false"

  it "context-upgrade owns explicit source upgrades and v3 layout repair"
  output=$(cat "$REPO_ROOT/context-upgrade/SKILL.md")
  assert_contains "$output" "current-v3 layout repair"
  assert_contains "$output" "context-init"
  assert_not_contains "$output" "migrate-project.js"
  assert_not_contains "$output" "schema v2"

  it "keeps the context-maintain skill reasonably concise"
  words=$(wc -w < "$REPO_ROOT/context-maintain/SKILL.md")
  [ "$words" -le 1300 ] && pass || fail "expected <= 1300 words, got $words"

  it "includes correction confidence guidance"
  assert_contains "$(cat "$REPO_ROOT/context-maintain/SKILL.md")" "Confidence"

  it "routes skill-specific corrections back to skills"
  assert_contains "$(cat "$REPO_ROOT/context-maintain/SKILL.md")" "specific skill"

  it "stages skill workflow corrections before mutation"
  output=$(cat "$REPO_ROOT/context-maintain/SKILL.md")
  assert_contains "$output" "skill patch candidate"
  assert_contains "$output" "Do not edit \`SKILL.md\` directly from reflection"

  it "requires approval before skill mutation"
  output=$(cat "$REPO_ROOT/context-maintain/SKILL.md")
  assert_contains "$output" "explicit approval"
  assert_contains "$output" "canonical skill source"

  it "requires duplicate and conflict checks before durable memory"
  assert_contains "$(cat "$REPO_ROOT/context-maintain/SKILL.md")" "duplicates or contradictions"

  it "prevents private raw data from being stored as memory"
  assert_contains "$(cat "$REPO_ROOT/context-maintain/SKILL.md")" "unredacted command output"

  it "makes Dream consideration automatic"
  output=$(cat "$REPO_ROOT/context-maintain/SKILL.md")
  assert_contains "$output" "automatic semantic consolidation check"
  assert_contains "$output" "Should Dream Check"

  it "logs Dream edits outside operational context"
  output=$(cat "$REPO_ROOT/context-maintain/SKILL.md")
  assert_contains "$output" ".context-harness/DREAM.md"
  assert_contains "$output" "must not be used as instructions"
  assert_contains "$output" "Do not read it during normal catch-up"
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
# Test: codex-context-hook.js
# =============================

if should_run "codex-context-hook"; then
  suite "codex-context-hook.js"
  CODEX_HOOK="$REPO_ROOT/scripts/codex-context-hook.js"

  it "emits catch-up context when context-harness files exist"
  setup_tmpdir
  cat > "$TMPDIR_ROOT/AGENTS.md" << 'EOF'
# Agents
<!-- context-harness:schema v3 -->
<!-- context-harness:index:start -->
<!-- context-harness:index:end -->
EOF
  cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v3 -->
EOF
  cat > "$TMPDIR_ROOT/NOW.md" << 'EOF'
# Now

## Current Focus
Ship hooks
EOF
  output=$(cd "$TMPDIR_ROOT" && printf '{"cwd":"%s"}' "$TMPDIR_ROOT" | node "$CODEX_HOOK" --mode catch-up)
  assert_contains "$output" "context-catch-up"
  assert_contains "$output" "read NOW.md and concise CONTEXT.md"
  assert_contains "$output" "run hydrate"

  it "includes current NOW.md in catch-up context"
  assert_contains "$output" "Ship hooks"

  it "routes old context-harness files to explicit upgrade"
  setup_tmpdir
  echo "# Agents" > "$TMPDIR_ROOT/AGENTS.md"
  echo "# Context" > "$TMPDIR_ROOT/CONTEXT.md"
  echo "# Now" > "$TMPDIR_ROOT/NOW.md"
  output=$(cd "$TMPDIR_ROOT" && printf '{"cwd":"%s"}' "$TMPDIR_ROOT" | node "$CODEX_HOOK" --mode catch-up)
  assert_contains "$output" "context-upgrade"

  it "emits init context when project lacks context files"
  setup_tmpdir
  echo '{"name":"demo"}' > "$TMPDIR_ROOT/package.json"
  output=$(cd "$TMPDIR_ROOT" && printf '{"cwd":"%s"}' "$TMPDIR_ROOT" | node "$CODEX_HOOK" --mode init)
  assert_contains "$output" "context-init"

  it "does not emit init context outside a project"
  setup_tmpdir
  output=$(cd "$TMPDIR_ROOT" && printf '{"cwd":"%s"}' "$TMPDIR_ROOT" | node "$CODEX_HOOK" --mode init)
  [ -z "$output" ] && pass || fail "unexpected output: $output"

  it "emits maintain context when context-harness files exist"
  setup_tmpdir
  echo "# Agents" > "$TMPDIR_ROOT/AGENTS.md"
  echo "# Context" > "$TMPDIR_ROOT/CONTEXT.md"
  echo "# Now" > "$TMPDIR_ROOT/NOW.md"
  output=$(cd "$TMPDIR_ROOT" && printf '{"cwd":"%s"}' "$TMPDIR_ROOT" | node "$CODEX_HOOK" --mode maintain)
  assert_contains "$output" "context-maintain"
  assert_contains "$output" "Save task-local info to PLAN.md"
  assert_contains "$output" "rewrite NOW.md last"
  assert_contains "$output" "future retrieval"

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

  it "mentions session start activation"
  assert_contains "$(cat "$SKILL")" "session start/resume"

  it "contains AGENTS.md template"
  assert_contains "$(cat "$SKILL")" "### AGENTS.md"

  it "contains Context Contract"
  content=$(cat "$SKILL")
  assert_contains "$content" "Context Contract"
  assert_contains "$content" "always-read project layer"
  assert_contains "$content" "before opening \`PLAN.md\`, chunks, or bulky"

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

  it "does not require ADR capture"
  content=$(cat "$SKILL")
  assert_contains "$content" "PLAN.md Decisions"

  it "references CONTEXT-MAP.md"
  content=$(cat "$SKILL")
  assert_contains "$content" "CONTEXT-MAP.md"

  it "is under 300 lines"
  lines=$(wc -l < "$SKILL" | tr -d ' ')
  [ "$lines" -lt 300 ] && pass || fail "$lines lines"

  it "does not reference removed legacy scripts"
  content=$(cat "$SKILL")
  assert_not_contains "$content" "eval-loop"
  assert_not_contains "$content" "migrate-project.js"
  assert_not_contains "$content" "--profile legacy"

  it "references guard.js"
  assert_contains "$(cat "$SKILL")" "guard.js"

  it "routes migration to context-upgrade"
  content=$(cat "$SKILL")
  assert_contains "$content" "Use \`context-upgrade\`"
  assert_not_contains "$content" "Migrate from v1"
fi

# =============================
# Test: context-index.js
# =============================

if should_run "context-index"; then
  suite "context-index.js"
  CONTEXT_INDEX="$REPO_ROOT/scripts/context-index.js"

  write_minimal_context_project() {
    setup_tmpdir
    cat > "$TMPDIR_ROOT/CONTEXT.md" << 'EOF'
# Context
<!-- context-harness:schema v3 -->

## Project
Test project.

## Structure
```
.
```

## Operating Constraints
- Do not store secrets.
- Run checks before completion.

## Workflow
- Test: npm test

## Language
- **Term**: Definition.

## Relationships
- Durable facts live in CONTEXT.md.

## Flagged Ambiguities
- None.

## Learned Patterns
- When context changes, refresh the index.
EOF
  }

  it "passes check for a fresh minimal harness"
  write_minimal_context_project
  (cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" update >/dev/null 2>&1)
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1)
  assert_contains "$output" "OK context-harness check passed"

  it "fails check when required CONTEXT sections are missing"
  write_minimal_context_project
  perl -0pi -e 's/\n## Relationships[\s\S]*?\n## Flagged Ambiguities/\n## Flagged Ambiguities/' "$TMPDIR_ROOT/CONTEXT.md"
  (cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" update >/dev/null 2>&1)
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1)
  assert_contains "$output" "FAIL CONTEXT.md is missing ## Relationships"

  it "fails when AGENTS.md uses unsupported schema"
  write_minimal_context_project
  (cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" update >/dev/null 2>&1)
  perl -0pi -e 's/context-harness:schema v3/context-harness:schema v2/' "$TMPDIR_ROOT/AGENTS.md"
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1); rc=$?
  [ "$rc" -ne 0 ] && echo "$output" | grep -q "FAIL AGENTS.md must use context-harness schema v3" && pass || fail "expected AGENTS v2 failure: $output"

  it "warns when AGENTS.md contains detailed operating context"
  write_minimal_context_project
  (cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" update >/dev/null 2>&1)
  cat >> "$TMPDIR_ROOT/AGENTS.md" << 'EOF'

## Current Status
Durable project facts should not live here.

## Near-Term Priorities
These belong in CONTEXT.md or PLAN.md.
EOF
  output=$(cd "$TMPDIR_ROOT" && node "$CONTEXT_INDEX" check 2>&1)
  assert_contains "$output" "WARN AGENTS.md appears to contain durable operating context"
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
