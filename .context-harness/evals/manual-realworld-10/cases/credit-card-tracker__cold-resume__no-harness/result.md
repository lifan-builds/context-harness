- Current understanding
  - This repo is Perks Reminder, a Next.js 15 / React 19 app for tracking credit-card benefits, annual fees/ROI, notifications, and loyalty-program point expirations. The repo appears recently focused on the CouponCycle -> Perks Reminder domain migration and the v1.18 loyalty-program standalone entry point.
  - Evidence: `.cursor/skills/version-update-notes/VERSION_HISTORY.md` marks current version v1.18 as `loyalty.perks-reminder.com` with a dedicated loyalty landing page; `src/middleware.ts` redirects old `coupon-cycle.site` hosts to `perks-reminder.com` and rewrites loyalty subdomain `/` to `/loyalty-landing`; `src/lib/site.ts`, `src/lib/auth.ts`, and `src/lib/loyalty-links.ts` implement canonical auth URL, shared cookie domain, and loyalty callback handling.
  - Public docs and app metadata have mostly moved to `https://www.perks-reminder.com`; README roadmap still lists future product work as custom cards, advanced analytics, and multi-user support, but the operationally active thread looks like domain/loyalty rollout.

- Active blockers or uncertainty
  - No context-harness files were used, by instruction, so this is inferred only from remaining repo files and may miss out-of-band deployment state.
  - `docs/vercel-domains-and-deploy.md` lists `perks-reminder.com`, `www.perks-reminder.com`, and `loyalty.perks-reminder.com` as pending while legacy coupon-cycle domains are live; verify current Vercel/DNS state before assuming the migration is complete.
  - `announcement-state/migration-announcement-summary.json` says the migration announcement was only partially sent: 195 sent out of 481 expected, 286 remaining. Resume only after verifying the sender/domain/Resend quota and avoiding duplicate sends.
  - Auth is domain-sensitive: OAuth callbacks, `NEXTAUTH_URL`, shared `__Secure-next-auth` cookie domain, and loyalty subdomain callback URLs all need end-to-end production verification.
  - Testing has safety constraints: `.cursor/rules/testing-safety.mdc` explicitly forbids triggering notification/email side-effect endpoints against production data.

- Immediate next step
  - Verify the live domain migration and loyalty subdomain auth flow end-to-end: main app on `www.perks-reminder.com`, `loyalty.perks-reminder.com` landing rewrite, sign-in/sign-up callback back to `/loyalty`, shared session across subdomains, and redirects from old `coupon-cycle.site` hosts. If that passes, audit and resume the remaining migration announcement batch from the recorded remaining-recipient state using the cautious `--only-file` / `--limit` workflow.

- Relevant files
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/README.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/package.json`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/src/middleware.ts`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/src/lib/site.ts`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/src/lib/auth.ts`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/src/lib/loyalty-links.ts`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/src/app/loyalty-landing/page.tsx`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/src/app/loyalty/page.tsx`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/vercel-domains-and-deploy.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/domain-registration-and-migration-plan.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/user-migration-email-draft.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/scripts/send-migration-announcement.js`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/scripts/audit-migration-announcement.js`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/announcement-state/migration-announcement-summary.json`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/.cursor/rules/database-safety.mdc`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/credit-card-tracker__cold-resume__no-harness/repo/.cursor/rules/testing-safety.mdc`

- Verification command/check
  - Static/unit checks from repo root: `npm test && npm run check:public-db && npm run check:public-build:no-db`
  - Domain smoke checks: `curl -I https://www.perks-reminder.com && curl -I https://loyalty.perks-reminder.com && curl -I https://coupon-cycle.site`
  - Before any DB operation: `npm run db:check`; use `npm run dev:devdb` for local manual auth/loyalty testing, not production data.
  - For migration-email recovery, dry-run first: `node scripts/send-migration-announcement.js --dry-run --only-file=announcement-state/migration-announcement-remaining.txt --limit=5`; only use `--force` after sender/domain/quota are verified and the user approves sending.

- Confidence and why
  - Medium-high: multiple independent repo files point to the same active migration/loyalty-subdomain thread, and package scripts identify the verification path. Confidence is not higher because the case repo is not a standalone git checkout and the domain status docs may be stale relative to actual production/Vercel state.
