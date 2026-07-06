# Current understanding

Per `NOW.md`, the project is Perks Reminder, a credit-card benefits tracker. The recently completed work hardened anonymous/public surfaces against Neon quota exhaustion: public catalog, guide, referral, sitemap, and search surfaces now use a static shared catalog instead of Prisma where possible; deploy builds no longer run `prisma db seed`; public DB-free invariant/build checks exist; and the public production deployment was verified.

The active focus is provider recovery for DB-backed logged-in features. Production/dev Neon for project `credit-card-tracker` (`old-waterfall-78542145`) had exhausted the June 2026 Free compute quota. The project has already been recurrence-hardened to `0.25-1 CU` endpoints, and all visible endpoints were idle/archived, but the already-spent quota still blocked DB access at the last context update.

The user chose to wait for the July 2026 Neon quota reset rather than upgrade Neon or cut production over to the prepared but empty staging fallback DB. Since `NOW.md` was last modified 2026-06-26 and its expected reset boundary was 2026-07-01, the recorded state is likely stale relative to the eval date; the next real action is post-reset verification, not more waiting, unless the quota still has not recovered.

# Active blockers or uncertainty

- Unknown current Neon state: prod/dev DB-backed features remain blocked if Neon still returns `ERROR: Your account or project has exceeded the compute time quota...`.
- No production SQL/pgdump backup was found locally, and Neon CLI/API restore/clone paths were found to be project-local only. Without live production compute or a prior dump, there is no no-paid path to preserve existing production user data into another project.
- The staging fallback project (`credit-card-tracker-staging`, `small-base-05262044`) is prepared and smoke-tested, but it contains no real production users/cards; cutting over would create an empty-account production experience.
- Do not select/confirm Neon paid `Launch` or any paid plan without fresh explicit user approval.
- Supabase fallback signup was blocked at hCaptcha; solving it requires user confirmation or manual user action.
- Local checks may still show the non-blocking Next SWC mismatch warning (`@next/swc` 15.5.7 vs Next.js 15.5.11).
- Context follow-up: the context appears time-stale because the documented reset date has passed; update `NOW.md` after live verification in a normal, non-eval session.

# Immediate next step

Run the post-reset database verification now:

1. Run `npm run db:check` from the repo.
2. If prod/dev connections are healthy, smoke-test logged-in production DB-backed flows, especially sign-in, `/cards`, adding/viewing a user card, `/settings/data`, `/loyalty`, and `/api/user-cards/export`.
3. Export a Neon production backup immediately after recovery.
4. Monitor July Neon usage with the public DB-free hardening in place.
5. If `npm run db:check` still reports quota/provider errors, ask the user before choosing a paid Neon upgrade, empty fallback cutover, or continued wait/support escalation.

# Relevant files

- `NOW.md` — authoritative current focus, blockers, next step, and verification history.
- `AGENTS.md` — context-harness resume contract and context index instructions.
- `package.json` — verification scripts, especially `db:check`, `check:public-db`, `check:public-build:no-db`, `build`, and `test`.
- `scripts/check-database-connection.js` — production/development DB health check used by `npm run db:check`.
- `scripts/check-public-db-invariant.cjs` — public DB-free invariant check.
- `scripts/check-public-build-without-db.cjs` — build check with intentionally unavailable DB URLs.
- `src/lib/static-catalog.ts` — shared static catalog backing public DB-free surfaces.
- `src/lib/cardSearchUtils.ts`, `src/lib/home-dashboard-data.ts` — public catalog/search/dashboard data paths touched by the hardening.
- `src/app/page.tsx`, `src/app/cards/browse/page.tsx`, `src/app/cards/browse/[name]/page.tsx`, `src/app/benefits/how-to-use/page.tsx`, `src/app/benefits/how-to-use/[slug]/page.tsx`, `src/app/referrals/page.tsx`, `src/app/sitemap.ts` — public surfaces expected to work without DB.
- `src/app/api/predefined-cards/route.ts`, `src/app/api/predefined-cards-with-benefits/route.ts`, `src/app/api/search/route.ts` — public API routes expected to degrade/work without DB.
- `docs/supabase-fallback.md` — fallback documentation if Neon recovery fails.
- `prisma/seed.ts` and `prisma/schema.prisma` — seed/schema context for fallback or restored DB verification.

# Verification command/check

Primary next check:

```bash
npm run db:check
```

If that passes, follow with the already-established public and build checks:

```bash
npm run check:public-db
npx tsc --noEmit --pretty false
npm test -- static-catalog SupportedCreditCards
npm run check:public-build:no-db
npm run build
```

Then verify production manually with logged-in DB-backed flows and direct public checks such as `/`, `/cards/browse/American%20Express%20Gold%20Card`, `/benefits/how-to-use/airline-fee-credits`, `/referrals`, `/sitemap.xml`, `/api/predefined-cards`, `/api/predefined-cards-with-benefits`, and `/api/search?q=gold`.

# Confidence and why

Confidence: medium-high. `NOW.md` is detailed and specific, and the required context-index hydrate succeeded without indicating broken harness state. The main uncertainty is freshness: the recorded immediate next step was to wait for a reset that should already have occurred by the eval date, and I did not run live DB/network checks in this read-only eval.