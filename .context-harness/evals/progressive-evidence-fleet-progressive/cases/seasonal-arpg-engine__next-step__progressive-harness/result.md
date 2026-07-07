# Eval Result: seasonal-arpg-engine / next-step / progressive-harness

## Current understanding

This repo copy is context-drifted. `AGENTS.md` and `CONTEXT.md` still frame the repo as Seasonal ARPG Engine, but the actual `README.md` says the current repo is **Exalted Tools + POE2 P2 Follow**: a static POE2 tools website on Vercel plus a local Windows P2 Follow controller/vision helper. `NOW.md` is missing, so the active work cannot be recovered through the normal context-harness resume path.

The best next step is not a new feature implementation; it is a closeout/context-repair step that makes the current repo state safe and resumable before further product work. The stale context still exposes old Seasonal ARPG workflow facts such as `Torchlight TLIDB: python3 games/torchlight/scripts/tlidbverify.py fetch https://tlidb.com/cn/Hero`; that should be preserved only as drift evidence, not used as the current project verification command.

## Active blockers or uncertainty

- Missing `NOW.md` prevents a clean fresh-agent resume.
- `CONTEXT.md` is stale, oversized, and conflicts with `README.md`.
- The repo copy contains `.env` and `cookies.txt`; do not inspect or persist secrets, and verify public deploy denies direct access to local/private files.
- Without current `NOW.md`, it is unclear whether the last product change touched website, currency API, or P2 Follow code.

## Immediate next step

Plan a closeout pass:

1. Recreate `NOW.md` from current source truth: focus = Exalted Tools website + POE2 P2 Follow; blockers = context drift and secret/deploy verification; next = run README verification and repair context.
2. Compact `CONTEXT.md` to the current repo identity and preserve only durable constraints: secret/cookie safety, manual currency-trade verification, public deploy boundary, P2 Follow local requirements, and current verification workflow.
3. Regenerate cards/index with `node scripts/context-index.js update` and check with `node scripts/context-index.js check`.
4. Run the README Python compile/regression checks.
5. If deploying, verify Vercel public routes and explicitly check that private/local paths such as `.env`, `cookies.txt`, source directories, and scripts are not publicly exposed.

## Relevant files

- `README.md` — current project identity, route map, and verification commands.
- `NOW.md` — missing; must be recreated.
- `CONTEXT.md` — stale/oversized; must be compacted to current project state.
- `AGENTS.md` — context contract/index to regenerate after context repair.
- `.vercelignore`, `vercel.json` — public deploy safety.
- `api/*.py`, `vercel_api_shared.py`, `vercel_history_store.py` — Vercel backend.
- `games/poe2/tools/currency_arbitrage/` — currency tool engine/server/checks.
- `games/poe2/tools/p2_follow/` — controller/vision helper and tests.

## Verification command/check

Context repair:

```bash
node scripts/context-index.js update
node scripts/context-index.js check
```

Runtime checks from `README.md`:

```bash
python -m py_compile vercel_api_shared.py vercel_history_store.py api/cron-refresh.py api/live-check.py api/refresh.py api/route-history.py api/stable-routes.py games/poe2/tools/currency_arbitrage/poe2_currency_arbitrage.py games/poe2/tools/currency_arbitrage/poe2_currency_arbitrage_guard_check.py games/poe2/tools/currency_arbitrage/poe2_currency_arbitrage_server.py games/poe2/tools/currency_arbitrage/poe2_cron_refresh_files.py games/poe2/tools/p2_follow/p2_follow_core.py games/poe2/tools/p2_follow/poe2_p2_follow_gui.py games/poe2/tools/p2_follow/poe2_p2_follow.py
python games/poe2/tools/currency_arbitrage/poe2_currency_arbitrage_guard_check.py
python games/poe2/tools/p2_follow/tests/test_p2_follow_logic.py
python games/poe2/tools/p2_follow/tests/test_improvements_e2e.py
python games/poe2/tools/p2_follow/tests/test_noise_robustness.py
```

## Context Evidence

1. Read eval prompt for `seasonal-arpg-engine__next-step__progressive-harness`.
2. Attempted required `NOW.md` read; file is missing.
3. Read `CONTEXT.md`; it is v3 but stale/oversized and identifies the repo as Seasonal ARPG Engine.
4. Ran from the case repo: `node scripts/context-index.js hydrate "plan next implementation step"`.
5. Hydrate selected `ctx-context-operating-constraints`, `ctx-context-context-contract`, `ctx-context-cookie-and-secret-safety`, `ctx-context-principles`, and `ctx-context-structure`.
6. Read selected operating constraints card.
7. Read `AGENTS.md`; it confirms the v3 contract but references missing `NOW.md`.
8. Read `README.md`; it gives current project identity and verification commands.

## Confidence and why

Confidence is medium-high for the next step because the active task state is missing, but the closeout/context-repair need is concrete and blocks reliable future work. The verification commands come directly from the current README.