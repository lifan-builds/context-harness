# Current understanding

Agent Nexus is a Python 3.10+ single-file CLI (`nexus.py`) for deploying AI IDE assets from a central YAML manifest to Claude Code, Cursor, Google Antigravity, and Codex. The current focus is release handoff: local release changes are ready to push after public Context Harness deployment. The release candidate has already touched docs, CLI, tests, example manifest, and context files, and the recorded state says implementation and verification are complete.

# Active blockers or uncertainty

- No release-blocking implementation or verification blockers are recorded in `NOW.md`.
- Main uncertainty: the context state was last updated on 2026-06-29, so push/deployment status may need a fresh read-only remote/status check outside this eval before acting.
- The repo copy is an eval snapshot; I did not edit source files or perform live deployment checks.

# Immediate next step

Push the Agent Nexus release changes, then restart AI IDEs or agent hosts if updated skill metadata is not visible.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, next step, and recorded verification.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__progressive-harness/repo/AGENTS.md` — context contract and index usage instructions.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project overview, constraints, workflow, and invariants.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__progressive-harness/repo/nexus.py` — CLI implementation.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__progressive-harness/repo/tests/test_nexus.py` — primary test suite.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__progressive-harness/repo/nexus.example.yml` — public template manifest.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__progressive-harness/repo/README.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__progressive-harness/repo/docs/security-model.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/agent-nexus__cold-resume__progressive-harness/repo/docs/demo-transcript.md` — release-facing docs.

# Verification command/check

Recorded verification set from `NOW.md`:

```bash
python3 -m pytest -q -p no:cacheprovider tests/test_nexus.py
python3 -c "import py_compile; py_compile.compile('nexus.py', cfile='/tmp/agent-nexus-nexus.pyc', doraise=True)"
python3 nexus.py sync --dry-run
python3 nexus.py sync --yes
python3 nexus.py doctor
node scripts/context-index.js check
```

For a final pre-push check, run those from the repo root, with `python3 nexus.py sync --yes` only after confirming the target manifest and MCP/security prompts are expected.

# Confidence and why

High for the requested project state because `NOW.md` directly records the current focus, blockers, next step, touched files, and verification commands, and `AGENTS.md` plus `CONTEXT.md` confirm the context contract and project constraints. Medium for live push readiness because this was a read-only eval snapshot and I did not verify current remote state or deployment status.