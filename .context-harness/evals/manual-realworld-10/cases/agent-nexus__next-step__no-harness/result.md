- Current understanding
  - Agent Nexus is close to release-readiness: the Python CLI at `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/nexus.py` implements `init`, `sync`, `list`, `doctor`, `clean`, dry-run security review, package target filtering, Codex hook merge/dedupe, MCP merge preservation, lockfile generation, and skill metadata overlays.
  - Release-facing docs are mostly present: `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/README.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/docs/security-model.md`, and `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/docs/demo-transcript.md` cover onboarding, security, demo proof, and positioning.
  - The active work should not jump to a Go rewrite. `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/RELEASE_GOAL.md` explicitly says Go/Homebrew distribution is later and release readiness depends on verified docs, safety behavior, tests, and local verification.
  - I found one release-blocking inconsistency: `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/FINDINGS.md` says Claude Code user-scoped MCP servers live in `~/.claude.json`, and the legacy shell implementation `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/nexus.sh` targets `~/.claude.json` with `projects[repo_dir].mcpServers`. The Python port currently targets flat `~/.claude/.mcp.json` in `nexus.py`, and README/security/demo/tests now document that path.

- Active blockers or uncertainty
  - Confirm the intended Claude MCP scope/path before release. If `~/.claude.json` is still correct, the Python port regressed from `nexus.sh` and the docs/tests were updated around the wrong behavior.
  - Do not run a real `sync` against the user’s personal home until that Claude MCP path is confirmed, because the current Python code may write an unused or incorrect Claude MCP file.
  - Keep `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/nexus.personal.yml` and `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/nexus.personal.lock.yml` out of any release/source commit; the personal manifest includes machine-specific configuration and a plaintext local secret.

- Immediate next step
  - Resolve the Claude MCP path/shape mismatch, then close out verification.
  - Concrete implementation plan if `~/.claude.json` is confirmed:
    1. In `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/nexus.py`, change the Claude target registry entry from `~/.claude/.mcp.json` to `~/.claude.json` and introduce a Claude-specific MCP merge path that writes under `projects[str(repo_dir)].mcpServers` while preserving existing root keys, other project entries, unmanaged servers, local-only keys, and placeholder-protected env secrets.
    2. Update `prune_mcps`, `doctor`, and sync summary output so Claude reads/counts the nested project MCP servers rather than a flat top-level `mcpServers` object.
    3. Replace the current Claude MCP unit test in `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/tests/test_nexus.py` with coverage for the `~/.claude.json` nested `projects[repo_dir].mcpServers` shape, including preservation of unrelated projects/root keys.
    4. Update release docs and examples that currently say `~/.claude/.mcp.json`: `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/README.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/docs/security-model.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/docs/demo-transcript.md`, and `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/nexus.example.yml`.
    5. After the fix, do a release closeout pass against `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/RELEASE_GOAL.md`: verify README claims avoid stale competitor negatives, security docs match code, demo transcript matches real output, and tests/local checks pass.

- Relevant files
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/RELEASE_GOAL.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/FINDINGS.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/nexus.py`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/nexus.sh`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/tests/test_nexus.py`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/README.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/docs/security-model.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/docs/demo-transcript.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/nexus.example.yml`

- Verification command/check
  - Already run read-only-safe unit verification in this eval: `PYTHONDONTWRITEBYTECODE=1 python -m pytest -q -p no:cacheprovider /Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/agent-nexus__next-step__no-harness/repo/tests` passed with `34 passed in 0.08s`.
  - After implementing the Claude MCP correction, run from the repo: `PYTHONDONTWRITEBYTECODE=1 python -m pytest -q -p no:cacheprovider tests`.
  - Add a focused manual check with a temporary home before touching real IDE config: run `python nexus.py sync --dry-run` to inspect the security review, then run a full sync only with temporary `HOME` and `CODEX_HOME` (or in a disposable checkout) and verify `~/.claude.json` contains the expected `projects[repo_dir].mcpServers` entries while Cursor, Antigravity, and Codex outputs still use their documented paths.
  - Final closeout checks: `python nexus.py doctor`, review lockfile output, and compare README/security/demo path claims against actual CLI behavior.

- Confidence and why
  - Confidence: high that the next step should be the Claude MCP path correction or confirmation before release closeout. The same inconsistency appears independently in `FINDINGS.md`, `PLANS.md`, `nexus.sh`, `nexus.py`, docs, and tests, and it affects a release-critical target matrix item.
  - Confidence is medium on the exact replacement shape until current Claude Code behavior is re-confirmed, but the repository’s own prior finding and shell implementation strongly indicate `~/.claude.json` with a nested per-project `mcpServers` object.
