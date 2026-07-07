# Current understanding

`NOW.md` says the active focus is closeout after the context-harness v3 migration for the `exalted` project, with no recorded blockers and the immediate instruction to use the generated context index before planning/editing. The repository itself is a Path of Exile 2 currency arbitrage calculator. The active app is a Next.js/React static-export app that calculates item arbitrage across Exalted, Chaos, and Divine base currencies using scraped POE2Scout data.

Key implementation risk found during read-only inspection: the deployed data path looks inconsistent. `next.config.ts` sets `output: 'export'`, `vercel.json` points Vercel at `out`, and rewrites only `/api/data/:path*`; however `src/hooks/usePriceRefresh.ts` fetches `/api/prices`, implemented by `src/app/api/prices/route.ts` as a server route using `fs` and live scraping/static fallback. A static export likely will not serve that route. The GitHub Action writes only `api/data/*.json`, while the static app also has `public/api/data/*.json`; both inspected JSON copies are dated `2025-10-09T05:11:37.274063Z`, so the “every 5 minutes” data story needs verification.

# Active blockers or uncertainty

- No `PLAN.md` exists, so there is no active implementation plan beyond `NOW.md`.
- `node scripts/context-index.js check` fails: `AGENTS.md Context Index is stale; run node scripts/context-index.js update`.
- `CONTEXT.md` is not a concise always-read layer: `node scripts/context-index.js stats` reports 1,483 lines and many oversized sections, though cards/chunks exist.
- Product/deployment uncertainty: either `/api/prices` is not deployable under static export, or the project should not be using static export for this flow.
- Data freshness is uncertain/stale in this isolated copy: `api/data/*.json` and `public/api/data/*.json` both report a 2025-10-09 timestamp despite the workflow claiming 5-minute updates.

# Immediate next step

Do a small closeout/implementation spike to align the price-refresh path with the declared static deployment model, then close out the context migration.

Preferred direction, because the context emphasizes GitHub Actions + static JSON + Vercel static export:

1. Inspect the deployed runtime expectation for `output: 'export'` and decide whether the app should be fully static or server-backed.
2. If static-only, remove the runtime dependency on `/api/prices`: make `usePriceRefresh` load `/api/data/currencies.json` and `/api/data/rates.json` (or reuse `src/lib/currencies.ts`/`src/lib/rates.ts`) and treat manual refresh as a static-data reload, not live scraping.
3. Update the GitHub Actions data pipeline so the files actually served by the static export are refreshed. Options: write/copy scraped data into `public/api/data/*.json`, or adjust the build/deploy path so `api/data/*.json` is copied into `out/api/data` during build.
4. Only if live server scraping is required, reverse the architecture instead: remove static export assumptions and deploy a supported Next/Vercel server route for `/api/prices`.
5. After the product path is decided, perform context closeout: create/update `PLAN.md` with the decision and verification results, update `NOW.md`, run `node scripts/context-index.js update`, then confirm `node scripts/context-index.js check` passes.

# Relevant files

Using `$REPO=/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/archive__exalted__next-step__progressive-harness/repo`:

- `$REPO/NOW.md` — says v3 migration completed; next step is indexed context use.
- `$REPO/CONTEXT.md` — project facts, constraints, workflow, and imported legacy notes; currently oversized.
- `$REPO/AGENTS.md` — context contract and generated index; check says stale.
- `$REPO/scripts/context-index.js` — hydrate/check/stats/update commands.
- `$REPO/PLAN.md` — missing; should hold next task-local plan/decisions once edits are allowed.
- `$REPO/package.json` — scripts: `dev`, `build`, `start`, `lint`, `dev:old`.
- `$REPO/next.config.ts` — `output: 'export'` static export.
- `$REPO/vercel.json` — `framework: nextjs`, `buildCommand: npm run build`, `outputDirectory: out`, rewrite/header only for `/api/data`.
- `$REPO/src/hooks/usePriceRefresh.ts` — fetches `/api/prices` every 5 minutes.
- `$REPO/src/app/api/prices/route.ts` — server route using live POE2Scout fetch and `fs` fallback to `api/data`.
- `$REPO/src/lib/currencies.ts` and `$REPO/src/lib/rates.ts` — static JSON loading and rate fallback helpers.
- `$REPO/src/components/Calculator/index.tsx` and `$REPO/src/lib/arbitrage.ts` — current calculator flow and three-base-currency arbitrage logic.
- `$REPO/.github/workflows/scrape-poe2scout.yml` and `$REPO/.github/scripts/scrape_poe2scout.py` — scheduled scraper writes/commits `api/data/*.json`.
- `$REPO/api/data/*.json` and `$REPO/public/api/data/*.json` — inspected metadata shows stale matching timestamps.

# Verification command/check

After edits are allowed, verify in this order:

```bash
cd "$REPO" && node scripts/context-index.js check
cd "$REPO" && npm run build
cd "$REPO" && npx serve out -l 3000
curl -f http://localhost:3000/api/data/currencies.json
curl -f http://localhost:3000/api/data/rates.json
```

If retaining `/api/prices`, also verify it in the deployed/runtime mode that will actually be used:

```bash
curl -f http://localhost:3000/api/prices
```

If switching to static-only, the check should instead confirm the browser no longer requests `/api/prices` and the calculator can load currencies, refresh static data, select an item, calculate arbitrage, and display results from `/api/data/*.json`.

# Context Evidence

1. Read `prompt.md` for the eval instructions.
2. Read `$REPO/NOW.md` first: v3 migration completed; no blockers; use Context Index before planning/editing.
3. Read `$REPO/CONTEXT.md`: v3 schema present; constraints include no secrets and preserving project-specific instructions; context is large with imported legacy notes.
4. Invoked `context-catch-up` skill for fresh-session context discipline.
5. Read `$REPO/AGENTS.md`: context contract and generated Context Index.
6. Ran `node scripts/context-index.js hydrate "plan next implementation step"`; selected cards: `ctx-context-technical-implementation`, `ctx-now-now`, `ctx-context-file-structure`, `ctx-context-future-roadmap`, `ctx-context-operating-constraints`, `ctx-context-imported-agent-notes`.
7. Opened those selected cards before raw/source planning.
8. Tried to read `$REPO/PLAN.md`; file is missing.
9. Ran read-only inspection commands: root file listing, `find` under `src`, API file listing, static data metadata print, `node scripts/context-index.js check`, and `node scripts/context-index.js stats`.
10. Read targeted files listed above, especially deployment/data-flow files.

Save/update routing I would perform if edits were allowed: task-local findings and decisions to `PLAN.md`; durable workflow/verification corrections to `CONTEXT.md`; current focus/blockers/next step to `NOW.md`; regenerate cards/index with `node scripts/context-index.js update`.

# Confidence and why

Medium-high. The next step is well supported by the inspected deployment config, hook endpoint, route handler, workflow, and stale data metadata. Confidence is not “high” because this was a read-only eval and I did not run `npm run build`, serve `out`, or test the deployed app behavior end-to-end.