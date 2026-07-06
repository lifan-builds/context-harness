# Current understanding

The active work is provider recovery/closeout, not another source-code implementation slice. Public anonymous surfaces have already been hardened to avoid Prisma/Neon usage, deployed, and production-verified. Neon production/dev quota exhaustion was the remaining blocker, and the user chose to wait for the July 2026 Neon quota reset instead of upgrading Neon or cutting production over to the empty staging fallback.

Because the current date is after the expected reset boundary, the immediate work should be a Neon recovery closeout pass: confirm Neon production/dev are reachable again, confirm schema/migration state, take a production backup, then smoke logged-in DB-backed flows on production. Do not edit repository source files for this step unless the recovery checks reveal a concrete code issue.

# Active blockers or uncertainty

- Need to verify whether Neon quota actually reset and whether project `old-waterfall-78542145` is reachable again. If `npm run db:check` still reports the quota/provider error, DB-backed features remain blocked.
- Do not select a paid Neon plan without fresh explicit user approval.
- Do not cut production over to the prepared staging fallback unless the user explicitly accepts the temporary empty-account experience or production data has first been exported/restored.
- Preserve secrets: re-copy connection strings from provider dashboards only when needed; do not print or persist them in notes.
- The prompt requested `node scripts/context-index.js hydrate "plan next implementation step"`, but this checkout's `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo/scripts/context-index.js` only supports `update|list|query|section|check`, so `hydrate` failed with usage output. I used the index/list/section fallback and read only relevant context.

# Immediate next step

Run a Neon recovery closeout sequence:

1. From `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo`, run `npm run db:check` to verify production and development database reachability and migration status.
2. If production is reachable, take a production backup before applying any pending migrations or doing broader smoke checks. Use the direct Neon URL from the provider/Vercel environment without writing it to repo files.
3. If `db:check` shows pending migrations, verify the target is production and then apply only normal Prisma migrations with `npx prisma migrate deploy`; do not use reset/force-reset/destructive commands.
4. Smoke DB-backed production flows: sign in, verify existing user cards/benefit statuses are present, load `/cards`, `/benefits`, `/settings/data`, `/loyalty`, and verify `/api/user-cards/export` returns a valid export for an authenticated session.
5. Check Neon July compute usage after the smoke pass to confirm the public DB-free hardening is preventing renewed quota burn.
6. If Neon remains unavailable, report that the provider blocker persists and choose between continued waiting, paid Neon upgrade, or explicit fallback cutover approval.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo/NOW.md` — current recovery state, blockers, deployment and fallback notes.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo/AGENTS.md` — context-harness contract and indexed context sections.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo/CONTEXT.md` — especially `Rules` and `Workflow` sections for DB safety and command conventions.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo/package.json` — verification scripts, especially `db:check`, `db:prod:status`, `check:public-db`, and `check:public-build:no-db`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo/scripts/check-database-connection.js` — what `npm run db:check` validates and how it masks DB URLs.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo/prisma/schema.prisma` and `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo/prisma/migrations/` — migration state to compare against Neon, including `20260702000000_add_benefit_status_dashboard_indexes` if pending.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo/docs/supabase-fallback.md` — fallback guardrails if Neon remains blocked.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__next-step__progressive-harness/repo/docs/vercel-domains-and-deploy.md` — production Vercel project/env conventions if redeploy or env verification is needed.
- Authenticated smoke targets: `src/app/cards/page.tsx`, `src/app/benefits/page.tsx`, `src/app/settings/data/page.tsx`, `src/app/loyalty/page.tsx`, and `src/app/api/user-cards/export/route.ts`.

# Verification command/check

Primary recovery gate:

```bash
npm run db:check
```

If production is reachable, backup before mutation:

```bash
pg_dump "$DIRECT_URL" --format=custom --no-owner --no-acl --file "neon-production-$(date +%Y%m%dT%H%M%SZ).dump"
```

If migrations are pending after target verification:

```bash
npx prisma migrate deploy
npm run db:check
```

Regression/public-surface checks after provider recovery:

```bash
npm run check:public-db
npm run check:public-build:no-db
```

Manual production smoke check: sign in on `https://www.perks-reminder.com`, confirm existing cards/benefits/loyalty/settings data are visible, export data from `/settings/data`, and confirm Neon July compute usage stays low after several anonymous requests to `/`, `/cards`, `/api/search?q=gold`, and `/sitemap.xml`.

# Confidence and why

High confidence on the next step. `NOW.md` is explicit that the user chose to wait for the July Neon quota reset and that the post-reset sequence is `npm run db:check`, logged-in production DB-backed verification, backup export, and usage monitoring. The repo rules reinforce non-destructive DB handling and target verification. The main uncertainty is external provider state: until Neon is checked after reset, we cannot know whether recovery is complete or whether a paid/fallback decision is still required.
