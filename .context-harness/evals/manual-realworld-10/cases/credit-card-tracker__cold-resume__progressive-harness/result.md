# Current understanding

The project is Perks Reminder, a Next.js/React/TypeScript PWA for tracking recurring credit-card benefits. The most recent active work was production hardening after Neon Free compute quota exhaustion: anonymous/public catalog, guide, referral, sitemap, and search surfaces were moved to a static shared catalog so public pages can build and serve without Prisma; production builds no longer run `prisma db seed`; and public DB-free checks were added.

The current operational focus is recovering DB-backed logged-in production features after the Neon quota reset. The user previously chose to wait for the July 2026 Neon quota reset instead of upgrading Neon or cutting production over to an empty fallback database. Because the recorded expected reset boundary was `2026-07-01T00:00:00Z` and this context is from 2026-06-26, the next work should start by confirming whether Neon access has actually recovered.

# Active blockers or uncertainty

- Neon production/dev databases were blocked by compute quota exhaustion: `ERROR: Your account or project has exceeded the compute time quota`.
- Neon project `old-waterfall-78542145` had already spent `110.31 / 100 CU-hrs` for June 2026; visible computes were idle/archived, so cleanup could not reclaim already-spent quota.
- Quota-prevention settings were applied: project defaults and all six endpoints report `0.25-1 CU`; explicit suspend interval edits are rejected on Free.
- The expected reset date has now passed relative to this eval date, but the repo context has not been updated since before the reset. Main uncertainty: whether `npm run db:check` now succeeds against production/development Neon.
- Supabase/staging fallback exists and has been smoke-tested, but it has no real production users/cards. Do not cut production over to that empty fallback, upgrade Neon, or select a paid plan without fresh explicit approval.
- Context-harness command note: the prompt required `node scripts/context-index.js hydrate "resume current task"`, but this repo copy's script does not support `hydrate` and returned usage for `[update|list|query|section|check]`. I used read-only `query`/`section` fallback after the required command failed.

# Immediate next step

Run the database recovery check now that the expected quota-reset boundary has passed:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo && npm run db:check
```

If it succeeds, immediately verify logged-in production DB-backed flows, export a Neon backup, and monitor July Neon usage with the public DB-free hardening in place. If it still fails with quota/provider errors, keep production on the current hardened public/static behavior and ask the user before any paid-plan upgrade or empty-fallback cutover.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, next step, and prior verification record.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/AGENTS.md` — context-harness startup contract and context index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/CONTEXT.md` — selected sections: `Rules`, `Learned Patterns`, and `Deployment & Operations`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/package.json` — confirms `db:check`, `check:public-db`, `check:public-build:no-db`, and build scripts.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/scripts/check-database-connection.js` — implementation behind `npm run db:check`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/src/lib/static-catalog.ts` and `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/prisma/seed.ts` — shared static public catalog and explicit seed path from the hardening work.
- `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo/docs/supabase-fallback.md` — fallback runbook if Neon remains unusable, gated by user approval.

# Verification command/check

Primary recovery check:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__progressive-harness/repo && npm run db:check
```

Follow-up checks if DB access is restored: verify logged-in production DB-backed flows, export a Neon backup, and monitor July Neon CU usage. For any future public-route/catalog code changes, rerun `npm run check:public-db`, `npm run check:public-build:no-db`, and `npm run build`.

# Confidence and why

Confidence: high for the current focus and immediate next step because they are stated directly in `NOW.md` and reinforced by selected `CONTEXT.md` learned patterns. Confidence is medium on live provider status because this was a read-only eval and I did not run credentialed/live Neon checks; the repo context predates the expected July quota reset, so `npm run db:check` is the required next evidence-gathering step.
