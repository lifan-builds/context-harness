# Current understanding

The active work is no longer a feature implementation slice; it is a post-incident provider-recovery/closeout step for Perks Reminder's DB-backed logged-in features. Public anonymous surfaces have already been hardened to avoid Neon usage, Vercel production is serving the static public catalog/search paths, and Neon endpoint settings are quota-hardened to `0.25-1 CU`. The remaining issue from `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/NOW.md` is production/development Neon availability after June 2026 compute quota exhaustion.

Because the recorded expected reset boundary was `2026-07-01T00:00:00Z` and this eval date is after that, the immediate next step should be a recovery closeout verification, not a code change: confirm Neon access has returned, verify migration/schema status, smoke the logged-in DB-backed production flows, then export a backup while the database is readable.

Context-harness note: I followed the required order by reading `NOW.md` first, then `AGENTS.md`, then running `node scripts/context-index.js hydrate "plan next implementation step"`. That command is stale/broken in this repo copy: `scripts/context-index.js` only supports `[update|list|query|section|check]`, so this should be fixed later. I used `list`/`section` as read-only fallback to inspect only relevant context sections.

# Active blockers or uncertainty

- Neon quota state is the main uncertainty. The repo context says the user chose to wait for the July reset, but this read-only eval did not authenticate to Neon or Vercel, so it did not prove the reset occurred.
- Do not click/confirm a paid Neon plan without explicit user approval.
- Do not cut production over to the empty fallback/staging database without fresh explicit approval, because it would create a temporary empty-account experience and would not preserve existing production user data.
- If `npm run db:check` still reports the same quota/provider error after the reset date, treat that as an operations blocker: inspect Neon billing/project usage and only then choose between waiting, paid upgrade, or fallback.
- Harness maintenance follow-up: update or replace the documented `hydrate` command in `AGENTS.md`/context-harness scripts, but do not let that displace the recovery verification work.

# Immediate next step

Run a read-only post-reset recovery check from inside the case repo, then branch based on the result:

1. Verify local env targets and both Neon branches:
   - `cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo && npm run db:check`
2. If production is reachable and schema is up to date:
   - Smoke logged-in production DB-backed flows: sign in, load `/cards`, add a low-risk throwaway/test card if appropriate, confirm benefit statuses materialize, load `/benefits`, `/loyalty`, `/settings/data`, and request `/api/user-cards/export`.
   - Export a Neon backup immediately using a direct connection, for example `pg_dump "$NEON_DIRECT_URL" --format=custom --no-owner --no-acl --file=<safe-local-backup-path>`; do not print or persist secrets in repo files.
   - Check Neon July CU usage after the smoke so the public DB-free hardening is actually reducing compute burn.
3. If production is reachable but migrations are pending/out of sync:
   - Follow `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/docs/safe-migration-guide.md`: verify target first, avoid destructive commands, and use non-destructive `npx prisma migrate deploy`/status only.
4. If production is still unreachable because of quota/provider access:
   - Re-check Neon console/API for the actual billing-period/reset state and endpoint state.
   - Present the user with options: continue waiting/support, approve paid Launch upgrade, or explicitly approve fallback cutover with the data-loss/empty-account caveat.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/NOW.md` — current focus, blockers, chosen wait-for-reset path, and last verified deployment state.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/AGENTS.md` — context contract and stale `hydrate` instruction.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/CONTEXT.md` — `Rules`, `Workflow`, and `Deployment & Operations` sections: no destructive prod DB commands, verify DB target, use `npm run db:check`, Vercel uses `DIRECT_URL` for migrations.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/package.json` — `db:check`, public DB hardening checks, build/test scripts.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/scripts/check-database-connection.js` — masks DB URLs and checks prod/dev Prisma migration status.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/docs/safe-migration-guide.md` — dev/prod Neon branch safety rules and non-destructive migration workflow.
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/docs/supabase-fallback.md` — fallback/cutover guardrails and backup/restore path.
- Logged-in smoke surfaces to inspect if recovery fails in-app: `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/src/app/cards/page.tsx`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/src/app/cards/new/page.tsx`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/src/app/benefits/page.tsx`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/src/app/loyalty/page.tsx`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/src/app/settings/data/page.tsx`, and `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo/src/app/api/user-cards/export/route.ts`.

# Verification command/check

Primary command:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo && npm run db:check
```

Expected recovery signal: production and development report reachable/up-to-date migration status instead of quota/provider connection errors.

Follow-up checks if DB is back:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo && npm run check:public-db
cd /Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/credit-card-tracker__next-step__progressive-harness/repo && npx tsc --noEmit --pretty false
```

Then perform a real browser/API smoke of production logged-in flows and confirm `/api/user-cards/export` returns 200 for the signed-in user. If any logged-in route fails while `db:check` passes, inspect the relevant `src/app/...` route/action file above and Vercel runtime logs for that request.

# Confidence and why

Confidence: high for the next-step plan. The latest `NOW.md` is explicit that public DB-free hardening and deployment verification are complete, the only active blocker is Neon quota/provider recovery, and the recorded immediate next step is to run `npm run db:check`, verify logged-in DB-backed flows, export a backup, and monitor usage after reset. Confidence is not absolute because this read-only eval did not authenticate to Neon/Vercel, and the context-harness `hydrate` command documented by `AGENTS.md` is stale relative to the checked-in script.
