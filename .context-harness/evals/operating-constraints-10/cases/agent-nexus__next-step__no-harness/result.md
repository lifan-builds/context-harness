# Current understanding

Agent Nexus is a Python 3.10+ / PyYAML CLI for deploying agent skills, hooks, and MCP server config from a single manifest across Claude, Cursor, Antigravity, and Codex. The repository appears to be in a release-readiness/closeout phase rather than a new feature phase:

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/RELEASE_GOAL.md` defines the current goal as making Nexus release-ready, with README positioning, security model, onboarding, demo proof, tests, and local verification as done criteria.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/README.md` already has release-oriented quickstart, target/asset matrix, security summary, ecosystem positioning, demo-proof link, and focused verification commands.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/docs/security-model.md` documents read/write surfaces, MCP review gate, merge-preservation rules, hook dedupe, lockfile traceability, and a safe verification path.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/docs/demo-transcript.md` provides the requested release demo path for `init`, dry-run security review, `sync`, lockfile output, hook/MCP behavior, `doctor`, and Context Harness deployment.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/nexus.py` implements `sync`, `list`, `doctor`, `clean`, and `init` as Python CLI commands, with version `0.2.0`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/tests/test_nexus.py` has release-critical coverage for MCP merge preservation, target filtering, `init`, generated Codex overlays, hook discovery/allowlists, Codex hook preservation/stale cleanup/dedupe, dry-run no-write behavior, and `CODEX_HOME` handling.

# Active blockers or uncertainty

- I did not run tests or CLI commands because this eval is read-only and commands like `pytest` or `sync --dry-run` can write caches, `.pytest_cache`, `__pycache__`, or `.nexus/` artifacts.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/PLANS.md` is stale relative to the code and release goal: it still frames Phase 3 as a Go rewrite and lists `nexus init` as open, while `nexus.py`, README, docs, and tests show Python `init` already exists and the release goal explicitly says the Go rewrite is not required for this release.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/nexus.personal.yml` is a local personal manifest and includes sensitive local MCP configuration. Treat it as unpublishable; it is correctly covered by `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/.gitignore` along with personal lockfiles.
- The lockfile in `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/nexus.personal.lock.yml` contains absolute paths from the original working copy, so the copied eval repo should not be treated as proof that the latest local verification passed here.

# Immediate next step

Do a release closeout pass, not a Go rewrite or `nexus add/update` implementation. The concrete next step is:

1. In the real Agent Nexus working repo, run the focused release verification commands below.
2. If verification passes, update the stale project-state docs so they match the current Python release-readiness state:
   - mark Python `nexus init` as done,
   - record that release readiness has README/security/demo/test coverage,
   - move Go rewrite, `nexus add`, and `nexus update` to post-release/future work,
   - remove or clearly label older stale competitor-gap language so README-safe positioning remains the authoritative release stance.
3. If verification fails, fix only the failing release-readiness issue first, especially around no-write dry-run behavior, preserving unmanaged MCP/hooks, target filtering, or docs/actual-output drift.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/RELEASE_GOAL.md` — authoritative release goal, constraints, milestones, and verification expectations.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/README.md` — public release narrative, target matrix, security summary, quickstart, troubleshooting, and dev verification.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/docs/security-model.md` — safety contract for writes, review gates, merge preservation, hook dedupe, and traceability.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/docs/demo-transcript.md` — release proof artifact that should be checked against current CLI output.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/nexus.py` — implementation of the Python CLI and actual source of truth for supported commands/behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/tests/test_nexus.py` — release-critical safety and behavior coverage.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/nexus.example.yml` — public onboarding template; compare with README quickstart and demo.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/PLANS.md` — stale handoff/progress doc that should be reconciled during closeout.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/FINDINGS.md` — historical external research; keep old claims out of README unless freshly verified.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/agent-nexus__next-step__no-harness/repo/.gitignore` — confirms personal manifests, lockfiles, generated config, and caches should not be published.

# Verification command/check

Run from the real repository, not this read-only eval copy:

```bash
cd /Users/lfan/Project/agent-nexus
python -m pytest tests
python -m py_compile nexus.py
python nexus.py sync --dry-run
python nexus.py doctor
```

Manual checks before closeout:

- Confirm `docs/demo-transcript.md` still matches the current `nexus.py` dry-run/sync/doctor output shape.
- Confirm README comparison language avoids stale claims that competitors lack features unless those claims were freshly re-verified and cited in `FINDINGS.md`.
- Confirm `nexus.personal.yml` and `nexus.personal.lock.yml` remain ignored and are not part of any release diff.
- If testing actual deployment behavior, use a temporary `HOME`/`CODEX_HOME` or explicitly review the real target configs before running non-dry-run `sync`.

# Confidence and why

Confidence: high for choosing a closeout/verification step. The release goal, README, security model, demo transcript, Python CLI, and tests all point to release readiness as the active work. The main uncertainty is unexecuted verification due to the read-only eval constraint, plus stale `PLANS.md` language that conflicts with the newer release goal and current implementation.