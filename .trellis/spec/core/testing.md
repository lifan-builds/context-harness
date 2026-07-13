# Testing and Evaluation

## Canonical Test Runner

Run:

```bash
tests/run-all.sh
```

The single POSIX shell runner is the canonical product test contract. It intentionally does not use `set -e`, because nonzero script exits are often the behavior under test. Tests accumulate pass/fail counts and return a final summary status.

Optional suite filters are acceptable for fast iteration, but complete product changes must pass the full runner.

## Test Style

Prefer black-box CLI behavior over internal imports:

- create disposable filesystem fixtures;
- invoke Node scripts as users and hooks do;
- inspect exit status, stdout/stderr, generated files, hashes, and Git state;
- exercise stdin and environment hook payloads;
- verify idempotence and nested project-root behavior;
- test exact managed markers and required documentation phrases when they are contractual.

Use the narrowest new fixture that proves a behavior. Do not mock filesystem or subprocess boundaries when a temporary real repository is practical.

## Required Checks by Change Type

### Any product change

```bash
tests/run-all.sh
```

This checkout no longer carries a local Context Harness source packet, so do not run `node scripts/context-index.js check` at the repository root. The full runner exercises that command against disposable product fixtures.

### Source context or indexing change

Use a disposable target-project fixture containing `CONTEXT.md`, `NOW.md`, optional `PLAN.md`, and the managed index. Run `context-index.js update` before `check` there. Do not recreate those files as local workflow state in this checkout; `tests/run-all.sh` owns the canonical fixture coverage.

### Retrieval/indexing change

In addition to narrow mechanics coverage, run real-project shadow evaluation with `scripts/eval-context-library.js`. Inspect card quality, malformed/error counts, coverage, and the generated Markdown/JSON report rather than accepting process exit alone.

### Agent problem-solving change

Use `scripts/eval-agent-problem-solving.js` with isolated source copies, secret exclusions, byte budgets, and shared snapshots. Preserve run-manifest and score schema versions unless the change deliberately migrates them.

### Installation or upgrade change

Test clean, missing, locally modified, dirty, nested, and parent-ESM target projects. Verify `scripts/package.json` is installed and local modifications are reported rather than overwritten.

## Evaluation Philosophy

Mechanics tests establish correctness; real-repository shadows establish usefulness. Retrieval quality depends on actual context shapes, so unit fixtures alone are insufficient. Prefer minimal unit coverage plus shadow evaluation over a large synthetic test matrix.

## Review Checklist

- Does the test fail if the feature implementation is removed?
- Does it observe the public CLI/hook/filesystem contract?
- Are expected nonzero exits asserted rather than masked?
- Are generated artifacts checked for deterministic content and stale-file pruning?
- For retrieval work, was behavior exercised on real project copies?
- Are private files excluded and evaluation budgets respected?
