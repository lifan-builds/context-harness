# Current understanding

The active work is no longer a product implementation slice; it is provider recovery and closeout after public Neon quota hardening. The app has already been changed so anonymous public catalog/guide/referral/sitemap/search surfaces use the static catalog instead of Prisma, production builds skip `prisma db seed`, and public DB-free checks/build checks have passed. Neon project settings were also lowered to `0.25-1 CU` where the Free plan permits it.

The recorded blocker in `NOW.md` was exhausted June 2026 Neon compute quota, with the user choosing to wait for the July reset rather than upgrade Neon or cut production over to an empty fallback database. Because the eval date is after the expected `2026-07-01T00:00:00Z` reset boundary, the next step should be a read-only recovery verification and backup/export closeout, not new feature work.

# Active blockers or uncertainty

- The only real uncertainty is whether the July Neon quota reset actually restored production/dev database access; `NOW.md` was last modified on 2026-06-26 and says `npm run db:check` still failed before reset.
- Do not click/confirm a paid Neon plan without explicit user approval.
- Do not point production at the prepared empty staging fallback DB unless the user gives fresh explicit approval, because it would temporarily hide existing production user data.
- Supabase remains only a fallback path and should preserve user data via Neon export before any cutover.
- The surrounding eval copy is not a clean standalone git working tree for status purposes; `git -C repo status --short` reported changes from the parent context-harness repository, so source-status conclusions should not be drawn from that output.

# Immediate next step

Run a recovery closeout pass now that the expected July reset has passed:

1. From the repo copy, run `npm run db:check` to verify production and development Neon migration/status access has returned.
2. If `db:check` succeeds, verify the logged-in production DB-backed flows that were previously blocked: sign in, dashboard/benefits, `/cards`, add-card or existing-card view, `/settings/data`, `/loyalty`, and `/api/user-cards/export`.
3. Immediately export a production Neon backup with `pg_dump` or the Neon/Vercel-approved equivalent, storing it outside the repo and not printing credentials.
4. Monitor July compute usage in Neon after the hardening changes to confirm the public DB-free mitigation is preventing recurrence.
5. Only after the above passes, close out the provider-recovery task and return to the product roadmap; the next product slice from the selected plan card is duplicate-card/per-card tracking audit before starting broader new roadmap work.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__next-step__progressive-harness/repo/NOW.md` — source of current focus, blockers, chosen wait-for-reset path, and immediate recovery checklist.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__next-step__progressive-harness/repo/CONTEXT.md` — durable constraints, DB safety rules, Neon quota failure mode, public DB-free catalog invariant, fallback gate, Vercel alias note.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__next-step__progressive-harness/repo/AGENTS.md` — v3 context contract and context index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__next-step__progressive-harness/repo/package.json` — confirms `npm run db:check`, public DB checks, build, and test scripts.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__next-step__progressive-harness/repo/scripts/check-database-connection.js` — confirms `db:check` checks prod/dev Prisma migration status and masks URLs.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__next-step__progressive-harness/repo/docs/supabase-fallback.md` — fallback/cutover guardrails and verification sequence.
- Selected context card `ctx-plan-near-term-priority-roadmap` — confirms product work should resume only after current broad/recovery work is parked or closed, with duplicate-card tracking audit as the next product slice.

# Verification command/check

Primary recovery verification:

```bash
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__next-step__progressive-harness/repo" && npm run db:check
```

If it passes, follow with production smoke checks for logged-in DB-backed flows and export:

```bash
pg_dump "$NEON_DIRECT_URL" --format=custom --no-owner --no-acl --file=<backup-path-outside-repo>/neon-backup-$(date +%Y%m%d).dump
```

Do not run destructive Prisma commands (`migrate reset`, `db push --force-reset`) and do not run `npm run db:seed` against production unless target and intent are explicitly verified.

# Context Evidence

1. Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__next-step__progressive-harness/prompt.md`.
2. Read `NOW.md` first as required.
3. Read concise `CONTEXT.md` and `AGENTS.md` / Context Index; both include `<!-- context-harness:schema v3 -->`.
4. Ran required hydrate command: `node scripts/context-index.js hydrate "plan next implementation step"` from the eval repo.
   - Hydrate selected card IDs: `ctx-plan-goal-1`, `ctx-plan-findings-1`, `ctx-plan-goal-3`, `ctx-plan-near-term-priority-roadmap`, `ctx-plan-decisions`, `ctx-plan-progress`, `ctx-plan-progress-3`.
5. Opened selected cards before raw PLAN/chunks: `ctx-plan-near-term-priority-roadmap`, `ctx-plan-progress`, `ctx-plan-decisions`, `ctx-plan-goal-3`.
6. Ran read-only status/file inventory commands: `git -C <repo> status --short` and `git -C <repo> ls-files ...`; status reflected parent harness changes, not app-source changes.
7. Read `package.json`, `docs/supabase-fallback.md`, and `scripts/check-database-connection.js` for concrete verification and guardrails.

# Confidence and why

High for the next step: `NOW.md` directly names the post-reset actions, `CONTEXT.md` reinforces the safety constraints and fallback gates, and `package.json`/`scripts/check-database-connection.js` confirm the verification command. Medium on current live DB state because this read-only eval did not actually run authenticated production checks; the plan explicitly starts by verifying that state.
