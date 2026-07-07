# Current understanding

The completed task was the Neon quota hardening/provider-recovery work for Perks Reminder in `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo`. Public anonymous surfaces were moved to a DB-free static catalog path, production builds no longer run `prisma db seed`, and public DB-free invariants/build checks were added and production-verified. Neon project `old-waterfall-78542145` was hardened to `0.25-1 CU` defaults/endpoints where Free-plan controls allow it, but the already-spent June 2026 Neon quota still blocks DB-backed logged-in features until reset/upgrade/cutover.

The context files should be updated, but repository source files should not be edited for this eval. The highest-priority context maintenance is:

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/NOW.md`: keep or refresh the current focus/blockers/next step with the Neon quota state, explicit user decision to wait for July reset, touched files, and completed verification. This file already contains most of that state and should remain the handoff source.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/PLAN.md`: prepend or add a closed task-local slice for “Neon quota hardening and provider recovery.” Include findings, decisions, progress, verification, and follow-ups. `PLAN.md` currently still leads with older free-product/competitor slices, so it is stale relative to `NOW.md`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/CONTEXT.md`: keep durable lessons already present and add a dated Recent Update for the June 2026 Neon quota hardening/static catalog work. If editing, ensure the durable facts cover: public anonymous catalog/guide/referral/sitemap surfaces must not query Prisma; `src/lib/static-catalog.ts` is shared by public pages/APIs and `prisma/seed.ts`; production builds must not run `prisma db seed`; Neon Free suspend interval edits may be blocked; lower autoscaling to `0.25-1 CU` where possible; Supabase/empty fallback requires explicit approval and cannot preserve production data without a Neon export/backup; Vercel production domains are served by the `coupon-cycle` project.
- After any `CONTEXT.md` edit, run `node scripts/context-index.js update` from the repo root so cards/indexes reflect the new durable context.

# Active blockers or uncertainty

- Neon production and dev databases are still unavailable from compute quota exhaustion; code hardening cannot restore DB-backed logged-in features until quota reset, paid upgrade, or approved fallback cutover.
- The user chose to wait for the July 2026 Neon quota reset rather than upgrade Neon or cut over to the empty fallback DB.
- Supabase fallback setup is blocked at hCaptcha; solving it requires user action/approval. Even the prepared staging fallback has no real production users/cards.
- No local production SQL/pgdump backup was found, and Neon CLI/API paths appear project-local, so preserving production data requires restored access to the exhausted Neon project or a prior backup.
- Context-harness maintenance issue: `PLAN.md` and `CONTEXT.md#recent-updates` lag behind `NOW.md`; this does not block the read-only eval but should be corrected in the real repo.

# Immediate next step

For context maintenance: update `PLAN.md` with a closed Neon hardening/provider-recovery slice, add a June 2026 Recent Update to `CONTEXT.md`, run `node scripts/context-index.js update`, then ensure `NOW.md` still names the current blocker and post-reset next step.

For product operations after the Neon reset: run `npm run db:check`, verify logged-in production DB-backed flows, export a Neon backup, and monitor July usage with the public DB-free hardening in place. Do not switch production to the empty fallback DB or select a paid plan without fresh explicit user approval.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/NOW.md` — current handoff, blockers, touched files, verification history.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/CONTEXT.md` — durable operating constraints, learned patterns, relationships, and Recent Updates.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/PLAN.md` — task-local findings/decisions/progress; currently stale for the Neon task.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/AGENTS.md` — context contract requiring NOW first, hydrate before bulky context, durable lessons to CONTEXT, task-local findings to PLAN, and index update after CONTEXT edits.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/package.json` — confirms scripts: `check:public-db`, `check:public-build:no-db`, `db:check`, `db:seed`, `build`, `test`.
- Runtime/source files named in `NOW.md` as relevant to the completed task include `src/lib/static-catalog.ts`, `prisma/seed.ts`, `next.config.ts`, `scripts/check-public-db-invariant.cjs`, `scripts/check-public-build-without-db.cjs`, public pages/APIs under `src/app/`, and `docs/supabase-fallback.md`.

# Verification command/check

For context changes:

1. `node scripts/context-index.js update`
2. `node scripts/context-index.js hydrate "update context after completed task"` and confirm the selected cards include the new Neon/static-catalog context rather than only older free-product/competitor slices.

For the completed product hardening if re-verifying:

1. `npm run check:public-db`
2. `npx tsc --noEmit --pretty false`
3. `npm test -- static-catalog SupportedCreditCards`
4. `npm run check:public-build:no-db`
5. `npm run build`
6. Production public smoke checks for `/`, `/cards/browse/American%20Express%20Gold%20Card`, `/benefits/how-to-use/airline-fee-credits`, `/referrals`, `/sitemap.xml`, `/api/predefined-cards`, `/api/predefined-cards-with-benefits`, and `/api/search?q=gold`.

For post-reset DB recovery:

1. `npm run db:check`
2. Verify logged-in production flows: sign in, add card, materialize/view benefit statuses, load `/cards`, `/settings/data`, `/loyalty`, and export `/api/user-cards/export`.
3. Export a Neon backup and monitor July CU usage.

# Context Evidence

1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/prompt.md`.
2. Listed `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo`.
3. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/NOW.md` first.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/CONTEXT.md` as the always-read context layer.
5. Ran `node scripts/context-index.js hydrate "update context after completed task"` from the eval repo root. Hydrate selected: `ctx-context-recent-updates`, `ctx-plan-progress`, `ctx-plan-progress-1`, `ctx-plan-punted-ideas`, `ctx-now-now`, `ctx-plan-recommended-plan`, `ctx-context-learned-patterns`.
6. Read selected cards before raw bulky sections: `.context-harness/cards/ctx-now-now.md`, `.context-harness/cards/ctx-context-learned-patterns.md`, `.context-harness/cards/ctx-context-recent-updates.md`, `.context-harness/cards/ctx-plan-progress.md`.
7. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/AGENTS.md` for the context contract.
8. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/package.json` for exact script names.
9. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__progressive-harness/repo/PLAN.md` after hydrate.
10. Ran read-only `git -C .../repo status --short` and `git -C .../repo log --oneline -5`; because the eval repo copy is nested inside the outer context-harness git repository, these resolved to the outer repo and were not relied on for Perks Reminder source state.

# Confidence and why

High. `NOW.md` contains detailed current state, blockers, touched files, and verification for the just-completed Neon task; `CONTEXT.md` already contains the durable lessons that should be preserved; `AGENTS.md` states how to route context updates; `PLAN.md` clearly lags behind the current task; and `package.json` confirms the concrete verification commands. I did not open raw chunks because the selected cards plus the always-read files were sufficient.
