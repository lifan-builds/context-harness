# Current understanding

Agent Nexus is a Python 3.10+ / PyYAML CLI for managing AI agent environments from one versioned manifest. The active product focus is release readiness: make the tool trustworthy as a cross-IDE deployment layer by showing exactly what it writes, preserving local IDE/MCP config and secrets, avoiding stale competitor claims, documenting security behavior, proving the sync lifecycle, and keeping verification green.

The repository appears past the older v0.1 shell-prototype state. The current implementation is `nexus.py` at `nexus v0.2.0` with `init`, `sync`, `list`, `doctor`, `clean`, and `version`; README, security model, demo transcript, and tests already cover the release-readiness themes. A local ignored `nexus.personal.lock.yml` shows a recent sync state with multiple packages, generated overlays, Codex hooks, and managed MCPs, but that is machine-local evidence rather than public release source.

# Active blockers or uncertainty

- No context-harness handoff files are available by design, so current focus must be inferred from repo docs and implementation.
- `PLANS.md` is stale relative to the current source: it says Phase 3/Go rewrite and adding `nexus init` are next, but `RELEASE_GOAL.md` says the Go rewrite is not required for release readiness, and `nexus.py` already implements `init`.
- External competitor-positioning claims remain a publishing risk unless refreshed immediately before release, per `RELEASE_GOAL.md` and `FINDINGS.md`.
- The repo copy contains ignored personal manifest/lockfile state; do not treat those local machine choices as public release defaults.

# Immediate next step

Run the local release verification suite from the real project checkout, then reconcile the stale planning handoff if it passes. If verification fails, fix only the failing release-readiness gap; otherwise update/close out the planning docs to reflect that the Python v0.2.0 release-readiness path supersedes the older Phase 3 Go-rewrite note.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__no-harness/repo/RELEASE_GOAL.md` — authoritative release-readiness goal, done-means, constraints, and verification expectations.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__no-harness/repo/README.md` — public positioning, quickstart, matrix, security link, demo proof, and development verification commands.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__no-harness/repo/docs/security-model.md` — safety contract for read/write paths, review gate, MCP merge preservation, hook dedupe, lockfile traceability, and safe verification path.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__no-harness/repo/docs/demo-transcript.md` — release proof narrative for init, dry-run review, sync, MCP merge behavior, lockfile, doctor, and Context Harness deployment.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__no-harness/repo/nexus.py` — current Python CLI implementation, version 0.2.0, including init/sync/doctor and safety merge behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__no-harness/repo/tests/test_nexus.py` — focused release-critical tests for MCP shape/preservation, init safety, target filtering, overlays, discovery, and Codex hook behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__no-harness/repo/FINDINGS.md` — external research boundary and current positioning cautions.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/agent-nexus__cold-resume__no-harness/repo/PLANS.md` — useful historical handoff, but partially stale against current v0.2.0 source.

# Verification command/check

Use the release verification commands from `README.md` / `RELEASE_GOAL.md`:

```bash
cd /Users/lfan/Project/agent-nexus && python -m pytest tests && python -m py_compile nexus.py && python nexus.py sync --dry-run && python nexus.py doctor
```

For a strictly non-mutating first pass, run only:

```bash
cd /Users/lfan/Project/agent-nexus && python -m pytest tests && python -m py_compile nexus.py && python nexus.py sync --dry-run
```

Then inspect `python nexus.py doctor` on the target machine after an intentional sync, because `doctor` validates global IDE symlinks/config produced by local deployment.

# Context Evidence

- `RELEASE_GOAL.md` defines the current goal as making Agent Nexus release-ready, with done-means covering README positioning, target/asset matrix, security model, onboarding, demo proof, tests, and local verification.
- `RELEASE_GOAL.md` explicitly says the Go rewrite/Homebrew/binary distribution are later, not release blockers.
- `README.md` describes the project as a Python CLI with one runtime dependency, documents `python nexus.py init`, `sync --dry-run`, `sync`, and `doctor`, and includes the target/asset matrix plus verification commands.
- `docs/security-model.md` documents the review gate, merge-preservation rules for existing MCP config/secrets, Codex managed block behavior, hook dedupe, and lockfile traceability.
- `docs/demo-transcript.md` provides the release proof artifact requested by the goal: init, dry run/security review, sync, MCP merge, lockfile, doctor, and Context Harness package deployment.
- `nexus.py` reports `NEXUS_VERSION = "0.2.0"` and implements `init`, `sync`, `list`, `doctor`, `clean`, and `version`; a read-only sanity check returned `nexus v0.2.0`.
- `tests/test_nexus.py` covers release-critical behavior including MCP merge preservation, Claude/Codex MCP shapes, init overwrite safety, target filtering, overlays, discovery, and Codex hook merge/dedupe/prune.
- `.gitignore` marks `.nexus/`, generated IDE outputs, `nexus.personal.yml`, `nexus.personal.lock.yml`, `nexus.yml`, and `nexus.lock.yml` as non-source/generated or personal artifacts.

# Confidence and why

High confidence on the project state and next verification path because the README, release goal, security model, demo transcript, current CLI implementation, tests, and lockfile all converge on the same release-readiness story. Medium confidence on exact blockers because context-harness handoff files were intentionally omitted and `PLANS.md` conflicts with newer source/docs, so the safest interpretation is that planning docs need reconciliation after verification rather than new feature work.
