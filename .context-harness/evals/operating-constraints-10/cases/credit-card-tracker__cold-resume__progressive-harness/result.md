# Current understanding

Perks Reminder is a Next.js/Prisma credit-card benefit tracking PWA. The latest active focus in `NOW.md` is provider recovery for DB-backed logged-in features after public Neon quota hardening was completed and production-verified. Anonymous public catalog, guide, referral, sitemap, and search surfaces were moved to a static shared catalog so they remain DB-free; Vercel builds no longer require `prisma db seed`; public DB-free invariant/build checks exist; and Neon endpoint settings were reduced to `0.25-1 CU` where the Free plan permits.

The main operational state is that production/dev Neon access was blocked by exhausted June 2026 compute quota. A no-paid Neon staging fallback project was prepared and smoke-tested, but it contains no real production users/cards, so cutting over would create an empty-account production experience. The user chose to wait for the July Neon quota reset rather than upgrade Neon or cut production over to the empty fallback.

# Active blockers or uncertainty

- Primary blocker: production/dev Neon DB-backed features were unavailable because project `old-waterfall-78542145` had exceeded its Free compute quota.
- No paid Neon plan should be selected without fresh explicit user approval.
- Do not point production at the empty staging fallback DB without fresh explicit approval because it would not preserve existing production user data.
- No production SQL/pgdump backup was found in likely local locations, and Neon CLI/API restore/clone paths are project-local, so a cross-project no-paid data-preserving copy was not available while production compute was exhausted.
- Supabase fallback signup was blocked by hCaptcha and requires user/manual action before proceeding.
- Important stale-context uncertainty: `NOW.md` was last modified 2026-06-26 and expected the reset at `2026-07-01T00:00:00Z`; current eval date is 2026-07-05, so the immediate question is whether the quota reset actually restored DB connectivity.
- Harness follow-up: required `node scripts/context-index.js hydrate "resume current task"` failed because this repo's `scripts/context-index.js` only supports `update|list|query|section|check`. I used `query/list/section` read-only fallback and did not open raw chunks.
- `PLAN.md` contains older/product-roadmap active slices that do not match the provider-recovery focus in `NOW.md`; I treated `NOW.md` as authoritative for current operational focus.

# Immediate next step

From `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo`, immediately verify whether the July reset restored Neon access with `npm run db:check`. If it succeeds, verify logged-in production DB-backed flows, export a fresh Neon backup, and monitor July compute usage with the new public DB-free hardening. If it still fails with quota/provider errors, ask the user to choose between paid Neon upgrade, continuing to wait/support escalation, or an explicitly approved empty-fallback cutover.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/NOW.md` - authoritative current focus, blockers, next step, and last verification notes.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/AGENTS.md` - context-harness contract and generated index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/CONTEXT.md` - project rules, workflow, development guidelines, and deployment operations.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/package.json` - scripts including `db:check`, `check:public-db`, and `check:public-build:no-db`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/scripts/check-database-connection.js` - DB connectivity/migration status check behind `npm run db:check`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/scripts/check-public-db-invariant.cjs` - verifies public DB-free invariant.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/scripts/check-public-build-without-db.cjs` - verifies public build behavior without DB.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/src/lib/static-catalog.ts` - shared static catalog for anonymous public surfaces.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/src/lib/cardSearchUtils.ts` and `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/src/lib/home-dashboard-data.ts` - public/static catalog integration points noted in `NOW.md`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/docs/supabase-fallback.md` - documented Supabase fallback path.

# Verification command/check

Primary check:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo && npm run db:check
```

If DB access is restored, follow with production logged-in smoke checks for sign-in, `/cards`, adding a user card, benefit status materialization, `/settings/data`, `/loyalty`, and `/api/user-cards/export`, then create/export a Neon backup. For the already-hardened public surface, rerun `npm run check:public-db` and `npm run check:public-build:no-db` if touching related code.

# Confidence and why

Medium-high. I followed the required startup order (`NOW.md`, `AGENTS.md`, attempted hydrate, then selected context sections), and the provider-recovery state is clearly documented in `NOW.md` with concrete verification history. Confidence is not full because the required hydrate command is unavailable in this repo version and `NOW.md` predates the expected July quota reset, so actual DB availability now must be verified with `npm run db:check`.