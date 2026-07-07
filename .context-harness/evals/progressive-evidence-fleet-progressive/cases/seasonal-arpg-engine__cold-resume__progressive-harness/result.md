# Eval Result: seasonal-arpg-engine / cold-resume / progressive-harness

## Current understanding

The repo copy is context-drifted: `AGENTS.md` and `CONTEXT.md` identify it as `seasonal-arpg-engine`, but `README.md` says the active repository is now **Exalted Tools + POE2 P2 Follow** and that deprecated multi-game research content has been removed. The current concrete project surface appears to be:

- a static POE2 browser-tools website deployed on Vercel, with `/currency`, `/regex`, `/maps`, `/about`, and `/privacy` routes;
- Python/Vercel API support for currency arbitrage history/refresh/live-check routes;
- a local Windows POE2 P2 Follow controller/vision helper under `games/poe2/tools/p2_follow/`.

The durable context still contains useful POE2 safety constraints: do not persist cookies/secrets, manually verify Currency Exchange quotes before acting, keep evidence layers separate, and do not treat paper route scans as execution evidence. It also contains stale Seasonal ARPG workflow evidence such as `Torchlight TLIDB: python3 games/torchlight/scripts/tlidbverify.py fetch https://tlidb.com/cn/Hero`, which should be treated as drift rather than the current verification path.

## Active blockers or uncertainty

- `NOW.md` is missing in this eval repo copy even though `AGENTS.md` says it must be read first.
- `CONTEXT.md` is stale/oversized and still contains imported Seasonal ARPG / old AGENTS content that conflicts with `README.md`.
- `cookies.txt` and `.env` exist in the repo copy; do not inspect or persist their contents, and verify public deploy ignores/blocks them before launch.
- The active task is unclear without `NOW.md`; the safest interpretation is release/closeout verification for the current Exalted Tools + P2 Follow surfaces.

## Immediate next step

Treat the missing `NOW.md` and stale `CONTEXT.md` as harness drift, but do not let that replace project work. For project closeout, run the documented Python compile and focused regression checks from `README.md`, then verify public-route safety: intended routes return 200 while direct URLs for secrets/local notes/sources/scripts such as `cookies.txt`, `.env`, and non-public source paths return 404.

## Relevant files

- `README.md` — current repo identity, public routes, P2 Follow quick start, and development checks.
- `AGENTS.md` — v3 context contract and generated index, but it references missing `NOW.md`.
- `CONTEXT.md` — durable constraints and POE2 learned patterns, but stale/oversized relative to current README.
- `.vercelignore`, `vercel.json` — public deploy boundary and route behavior.
- `api/*.py`, `vercel_api_shared.py`, `vercel_history_store.py` — Vercel API/backend support.
- `games/poe2/tools/currency_arbitrage/` — currency arbitrage engine/server/guard checks.
- `games/poe2/tools/p2_follow/` — P2 Follow controller/vision helper and tests.

## Verification command/check

From the repo root, run the README checks:

```bash
python -m py_compile \
  vercel_api_shared.py \
  vercel_history_store.py \
  api/cron-refresh.py \
  api/live-check.py \
  api/refresh.py \
  api/route-history.py \
  api/stable-routes.py \
  games/poe2/tools/currency_arbitrage/poe2_currency_arbitrage.py \
  games/poe2/tools/currency_arbitrage/poe2_currency_arbitrage_guard_check.py \
  games/poe2/tools/currency_arbitrage/poe2_currency_arbitrage_server.py \
  games/poe2/tools/currency_arbitrage/poe2_cron_refresh_files.py \
  games/poe2/tools/p2_follow/p2_follow_core.py \
  games/poe2/tools/p2_follow/poe2_p2_follow_gui.py \
  games/poe2/tools/p2_follow/poe2_p2_follow.py
python games/poe2/tools/currency_arbitrage/poe2_currency_arbitrage_guard_check.py
python games/poe2/tools/p2_follow/tests/test_p2_follow_logic.py
python games/poe2/tools/p2_follow/tests/test_improvements_e2e.py
python games/poe2/tools/p2_follow/tests/test_noise_robustness.py
```

Also run `node scripts/context-index.js check` after repairing context drift.

## Context Evidence

1. Read eval prompt for `seasonal-arpg-engine__cold-resume__progressive-harness`.
2. Tried to read repo `NOW.md` first as required; it is missing.
3. Read repo `CONTEXT.md`; it is v3 but stale/oversized and still identifies the project as Seasonal ARPG Engine.
4. Ran hydrate from the case repo: `node scripts/context-index.js hydrate "resume current task"`; selected cards were `ctx-context-context-contract` and `ctx-context-relationships`.
5. Read repo `AGENTS.md`; it says to read missing `NOW.md` and preserve Operating Constraints.
6. Read repo `README.md`; it identifies the current active surfaces as Exalted Tools website and POE2 P2 Follow and lists verification commands.

## Confidence and why

Confidence is medium. The README and file tree give strong evidence for the current concrete project surfaces, while the missing `NOW.md` and stale `CONTEXT.md` mean the exact active task cannot be recovered cleanly from context-harness alone. The next step is therefore framed as closeout/verification plus explicit context repair follow-up.