# Current understanding

The active work is provider recovery and closeout after Neon Free compute quota exhaustion, not a new product implementation slice. Public anonymous catalog/guide/referral/sitemap paths have already been hardened to avoid Prisma, Vercel production public checks passed, and Neon endpoint autoscaling has been lowered to `0.25-1 CU` for recurrence prevention. DB-backed logged-in features were still unavailable in the recorded context because the production/dev Neon project had exhausted June 2026 compute quota. The user chose to wait for the July 2026 reset rather than upgrade Neon or cut production over to an empty fallback database.

Because the recorded reset boundary was `2026-07-01T00:00:00Z` and this eval is running after that date, the immediate next step should be a closeout/recovery verification pass: confirm Neon connectivity is restored, then verify logged-in production flows and export a backup.

# Active blockers or uncertainty

- The main uncertainty is whether Neon quota has actually reset and production/dev DB connections now work.
- If `npm run db:check` still reports `ERROR: Your account or project has exceeded the compute time quota`, DB-backed features remain blocked and the user needs a fresh decision between waiting longer, upgrading Neon, or explicitly approving a fallback cutover.
- Do not choose a paid Neon Launch plan without explicit approval.
- Do not point production at the prepared staging fallback DB without fresh explicit approval, because it has no real production users/cards and would create an empty-account experience.
- Do not solve the Supabase hCaptcha or continue that registration without user action/confirmation.

# Immediate next step

1. From the repo copy or normal working checkout, run the non-destructive DB status check:
   - `npm run db:check`
2. If production/dev Neon access is restored:
   - Verify logged-in production DB-backed flows: sign in, load `/benefits`, `/cards`, `/settings/data`, `/loyalty`, add or inspect a test card only if using a safe test account, and confirm export works at `/api/user-cards/export` or through the settings UI.
   - Export a Neon backup immediately after recovery so future fallback work can preserve production data.
   - Re-check that public DB-free routes still behave correctly with the hardening in place.
   - Monitor July Neon CU usage after the reset to confirm the `0.25-1 CU` endpoint settings prevent recurrence.
3. If Neon access is still blocked:
   - Stop before making production changes.
   - Report that the provider quota/access blocker remains.
   - Present the already-established options: wait for provider recovery, upgrade Neon with approval, or cut over to the prepared empty staging fallback only with explicit approval and a clear user-data impact warning.

# Relevant files

Files to inspect before acting:

- `NOW.md` — current focus, blockers, immediate next step, prior verification.
- `CONTEXT.md` — operating constraints, workflow commands, Neon quota failure mode, public DB-free catalog invariant, fallback gates, Vercel alias/project notes.
- `AGENTS.md` — context contract and index for flat context usage.
- `PLAN.md` — confirms previous product slices are mostly complete; active operational recovery supersedes new feature work.
- `docs/supabase-fallback.md` — only if fallback/cutover is reconsidered.
- `scripts/check-database-connection.js` and `package.json` — only to confirm what `npm run db:check` executes if the check behaves unexpectedly.

# Verification command/check

Primary recovery gate:

```bash
npm run db:check
```

If the DB check passes, follow with production smoke checks for authenticated DB-backed surfaces and export:

```bash
# Browser/manual or scripted checks against production after signing in with a safe test account:
# - /benefits
# - /cards
# - /settings/data
# - /loyalty
# - /api/user-cards/export
```

Also keep the existing public hardening checks available if code or deployment changes occur:

```bash
npm run check:public-db
npm run check:public-build:no-db
```

# Context Evidence

- `NOW.md` says the current work is provider recovery for DB-backed logged-in features after public Neon quota hardening was implemented and production-verified.
- `NOW.md` records the active blocker as Neon compute quota exhaustion, with project `credit-card-tracker` at `110.31 / 100 CU-hrs` for June 2026.
- `NOW.md` says all visible Neon computes are already idle/archived and endpoint/default settings are hardened to `0.25-1 CU`, so cleanup will not recover the already-spent quota.
- `NOW.md` says the user chose to wait for the July 2026 Neon quota reset and explicitly says not to point production at the empty fallback DB or click a paid plan without fresh approval.
- `NOW.md` records the post-reset closeout sequence: run `npm run db:check`, verify logged-in production DB-backed flows, export a Neon backup, and monitor July usage.
- `CONTEXT.md` operating constraints prohibit destructive production DB commands, `.env` edits, and production data work without target verification.
- `CONTEXT.md` learned patterns document the Neon quota failure mode, Neon Free compute settings, the public DB-free catalog invariant, explicit catalog seeding, Supabase fallback gate, and Vercel alias caveat.
- `PLAN.md` shows recent product roadmap slices through bulk onboarding are implemented/planned separately; it does not override the operational recovery item in `NOW.md`.

# Confidence and why

High. The flat context files agree that the active item is operational recovery/closeout, not new feature development. The immediate next step is stated directly in `NOW.md`, and the constraints in `CONTEXT.md` explain why the plan must begin with `npm run db:check` and avoid paid-plan or empty-fallback changes without explicit approval.