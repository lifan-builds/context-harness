# Trace Notes

- Read case prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__next-step__progressive-harness/prompt.md`.
- Followed fresh-agent context order inside repo root `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/agent-nexus__next-step__progressive-harness/repo`.
- Read `NOW.md` first: release candidate ready to push; no release-blocking implementation/verification blockers; restart IDEs/agent hosts if metadata stale.
- Read `CONTEXT.md`: project identity, operating constraints, workflow, relationships, learned patterns.
- Ran hydrate from eval repo root: `node scripts/context-index.js hydrate "plan next implementation step"`.
- Hydrate selected cards: `ctx-now-now`, `ctx-plan-archive`, `ctx-plan-current-findings`, `ctx-plan-decisions`, `ctx-plan-follow-ups`, `ctx-plan-goal`, `ctx-plan-progress`.
- Read selected cards before raw `PLAN.md`.
- Read `AGENTS.md`: v3 Context Contract and generated Context Index instructions.
- Read `PLAN.md`: release work complete, remaining follow-up about switching any local-only `path: ../context-harness`, verification history including public `lifan-builds/context-harness@main` sync.
- Read `RELEASE_GOAL.md`: done criteria, files to inspect, verification/closeout routing.
- Read `README.md`: release positioning, quickstart, target/asset matrix, security model, demo proof, development verification commands.
- Read `nexus.example.yml` and `nexus.personal.yml`: both use `repo: lifan-builds/context-harness` / `ref: main`; no active `path: ../context-harness` found in those manifests.
- Read `.gitignore`: personal manifests/lockfiles and generated outputs are ignored.
- Ran grep for `../context-harness` and `context-harness` references across manifests/docs/context files; found the local-path note only in `PLAN.md`, with public repo references in manifests/README/docs.
- Ran `grep -n "def test_" tests/test_nexus.py` to identify coverage areas: MCP merge/prune, init, target filtering, overlays, lockfile, discovery, Codex hooks, dry-run.
- Ran `node scripts/context-index.js check`; result: `FAIL AGENTS.md Context Index is stale; run node scripts/context-index.js update`.

Save/update routing I would perform if edits were allowed:

- Run `node scripts/context-index.js update`, then `node scripts/context-index.js check`.
- Update `PLAN.md` to clear or clarify the `path: ../context-harness` follow-up if public-ref verification is complete.
- Update `NOW.md` after final verification/push with current focus, blockers, next step, and touched files.
- Do not update `CONTEXT.md` unless a durable project invariant changes.
- Before push, verify `nexus.personal.yml`, `nexus.personal.lock.yml`, `.nexus/`, and any secret-bearing files are not tracked/staged.

Files modified during eval: only `../result.md` and `../trace.md`.