- Current understanding
  - Agent Nexus is a Python 3.10+ / PyYAML CLI for deploying AI-agent skills, hooks, and MCP server config across Claude, Cursor, Antigravity, and Codex from a manifest. The active focus appears to be release readiness: trustworthy positioning, security documentation, onboarding, demo proof, and release-critical tests.
  - The current repo state already shows much of that release-readiness work in place: `README.md` has a target/asset matrix and safer ecosystem positioning; `docs/security-model.md` documents read/write surfaces, MCP merge preservation, review gates, hook dedupe, and lockfile traceability; `docs/demo-transcript.md` shows init/dry-run/sync/doctor; `tests/test_nexus.py` covers MCP merge preservation, init behavior, package target/skill filtering, Codex hooks, overlays, discovery, and dry-run output.
  - `nexus.py` is the main implementation at version `0.2.0`; `nexus.example.yml` is the public template; `nexus.personal.yml` and `nexus.personal.lock.yml` show a local/personal deployment state in this repo copy.

- Active blockers or uncertainty
  - I did not run verification because this is a read-only eval and normal `pytest`, `py_compile`, and `sync --dry-run` may write `.pytest_cache`, `__pycache__`, or `.nexus/cache`.
  - `PLANS.md` looks older/stale compared with `RELEASE_GOAL.md`, `README.md`, and the current Python implementation: it still describes phase 3 as a Go rewrite/distribution track, while `RELEASE_GOAL.md` explicitly says the Go rewrite is not required for this release.
  - `nexus.personal.yml` contains machine-specific MCP configuration and should remain gitignored/local; do not publish it or treat it as release template material.
  - The remaining uncertainty is whether the latest release-ready state has been freshly verified end-to-end on the real machine/global IDE config.

- Immediate next step
  - Run local release verification from the repo root, then update/close out the project-state docs if this were a normal editable session. If verification fails, fix only the failing release-critical path; if it passes, reconcile stale planning notes so they match the current release focus.

- Relevant files
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo/nexus.py`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo/tests/test_nexus.py`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo/README.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo/RELEASE_GOAL.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo/docs/security-model.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo/docs/demo-transcript.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo/nexus.example.yml`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo/PLANS.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo/FINDINGS.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo/EVALUATION.md`

- Verification command/check
  - Full release check, when writes are allowed:
    ```bash
    cd /Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo && \
      python -m pytest tests && \
      python -m py_compile nexus.py && \
      python nexus.py sync --dry-run && \
      python nexus.py doctor
    ```
  - More read-only-friendly unit check for this eval shape:
    ```bash
    cd /Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__no-harness/repo && \
      PYTHONDONTWRITEBYTECODE=1 python -m pytest -p no:cacheprovider tests
    ```

- Confidence and why
  - Medium-high. The release focus is clearly supported by `RELEASE_GOAL.md`, `README.md`, `docs/security-model.md`, `docs/demo-transcript.md`, and broad tests in `tests/test_nexus.py`. Confidence is not higher because I intentionally did not run verification in this read-only eval and because `PLANS.md` appears stale relative to the newer release-readiness artifacts.