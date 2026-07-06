## Current understanding

The active work is release-readiness for Agent Nexus as a Python CLI deployment layer. The repository now has a substantial `nexus.py` implementation with `sync`, `list`, `doctor`, `clean`, `init`, dry-run security review, target filtering, Codex hook merge/dedupe, MCP merge preservation, lockfile generation, and generated Codex skill overlays. The release-facing docs have largely moved to the safer positioning described in `RELEASE_GOAL.md` and `FINDINGS.md`: `README.md` emphasizes verified local behavior instead of stale negative competitor claims, and `docs/security-model.md` plus `docs/demo-transcript.md` cover the safety/demo proof expected for release.

The next step should be a closeout polish pass, not a new large feature. The main remaining inconsistency is that the repo still contains the older shell prototype `nexus.sh`, which depends on `jq`, while release docs and `nexus.py` claim the Python CLI has only one runtime dependency, PyYAML. In addition, `PLANS.md` and `EVALUATION.md` still contain stale references to `nexus.sh`, `deploy.sh`, old Kasetto claims, and Go rewrite/distribution as the next phase, even though `RELEASE_GOAL.md` says the Go rewrite is not required for this release.

## Active blockers or uncertainty

- Decide whether `nexus.sh` is still intentionally shipped as a legacy/prototype entry point or should be removed/deprecated before release. Keeping it unqualified weakens the “no hidden dependency beyond Python 3.10+ and PyYAML” claim because it checks for `jq`.
- Stale internal docs may mislead the next agent or reviewer: `PLANS.md` says `nexus.sh` is the CLI entry point and lists `nexus init` as open even though `nexus.py` implements it; `EVALUATION.md` still uses `deploy.sh` parity as an acceptance contract.
- I did not run verification in this eval because the task is read-only and several normal verification paths can create cache, pycache, pytest cache, lockfiles, or target config outputs.
- Do not base public release docs on `nexus.personal.yml`; it is a local, gitignored personal manifest and may include machine-specific/private values.

## Immediate next step

Perform a release closeout consistency pass:

1. Inspect and decide the fate of `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/nexus.sh`.
   - Preferred release-safe outcome: remove it if `nexus.py` is the supported CLI.
   - If it must stay, label it clearly as a historical prototype and exclude it from Quick Start / release dependency claims.
2. Update stale planning/evaluation docs to match the current release state:
   - mark Python `nexus.py` v0.2 as the active CLI,
   - mark `nexus init` as implemented,
   - remove or archive `deploy.sh` parity language,
   - replace old Kasetto “lacks X” claims with the safer `FINDINGS.md` 2026-06-29 positioning,
   - make “Go rewrite/Homebrew” a post-release idea, not the active blocker.
3. Run the release verification suite and record results in the closeout notes.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/RELEASE_GOAL.md` — release criteria and non-goals.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/README.md` — public release positioning, Quick Start, dependency claims.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/docs/security-model.md` — safety model to keep aligned with implementation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/docs/demo-transcript.md` — release demo proof.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/nexus.py` — supported Python CLI implementation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/nexus.sh` — legacy shell prototype / dependency-story conflict.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/tests/test_nexus.py` — release-critical coverage for MCP preservation, target filtering, init, overlays, hook merge/dedupe, and dry-run behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/nexus.example.yml` — public manifest template.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/PLANS.md` and `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__next-step__no-harness/repo/EVALUATION.md` — stale closeout docs to refresh.

## Verification command/check

From the real Agent Nexus repo after the closeout edits, run:

```bash
PYTHONDONTWRITEBYTECODE=1 python -m pytest -q -p no:cacheprovider tests
PYTHONDONTWRITEBYTECODE=1 python -m py_compile nexus.py
python nexus.py version
python nexus.py sync --dry-run
python nexus.py doctor
```

Then run a stale-reference check:

```bash
rg -n "nexus\.sh|deploy\.sh|jq|surpass Kasetto|no hooks|security issue|Go rewrite|nexus init.*open" README.md docs PLANS.md EVALUATION.md RELEASE_GOAL.md nexus.py nexus.example.yml
```

Expected result: tests and compile pass; dry-run prints the MCP security review and “no target configs or lockfiles written”; doctor reports the manifest/lockfile/target health for the local setup; the stale-reference search has no release-blocking hits outside clearly historical sections.

## Confidence and why

Confidence: medium-high. The evidence is consistent across `RELEASE_GOAL.md`, `README.md`, `docs/security-model.md`, `docs/demo-transcript.md`, `nexus.py`, and `tests/test_nexus.py`: release functionality appears mostly complete, and the remaining risk is closeout consistency rather than missing core implementation. Confidence is not “high” only because I did not execute the verification commands in this read-only eval and because the final decision on whether to remove or keep `nexus.sh` is a release-maintainer judgment.
