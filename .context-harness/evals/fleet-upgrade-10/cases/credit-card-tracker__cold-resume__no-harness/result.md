# Fresh Agent Eval Result

## Current understanding

The repository is a Next.js 15 / React 19 / Prisma app for tracking credit-card perks, benefits, loyalty programs, reminders, and ROI. From the available repo files, the current operational focus appears to be the CouponCycle → Perks Reminder rebrand/domain migration:

- Public product identity and canonical URLs now point to `perks-reminder.com` / `www.perks-reminder.com`.
- Middleware redirects old `coupon-cycle.site` hosts to the new Perks Reminder hosts and routes `loyalty.perks-reminder.com` to the loyalty landing flow.
- Auth helpers canonicalize apex production auth to `www.perks-reminder.com` and share production session cookies across subdomains.
- A user-facing old-domain migration banner is implemented.
- A migration-announcement email script and persisted announcement state show the user announcement was only partially sent: 195 sent out of 481 expected recipients, 286 remaining.
- Secondary/nearby workstreams in the repo are SEO setup, iOS PWA/Capacitor support, and ongoing card/benefit catalog maintenance, but the strongest active clue is the unfinished domain/user migration.

## Active blockers or uncertainty

- User migration announcement appears incomplete: `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/announcement-state/migration-announcement-summary.json` records `expected: 481`, `sent: 195`, `remaining: 286`, with a first failed recipient and a generated timestamp of 2026-04-27.
- Domain state is inconsistent/uncertain from docs: `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/vercel-domains-and-deploy.md` marks `perks-reminder.com`, `www.perks-reminder.com`, and `loyalty.perks-reminder.com` as pending, while README/code already treat them as canonical.
- Vercel project targeting needs care: `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/.vercel/project.json` is linked to `credit-card-tracker`, while the deployment doc says production deployments/domain CLI work use the `coupon-cycle` project ID.
- OAuth callback URLs, `NEXTAUTH_URL`, production env vars, old-domain redirects, login on `www` and `loyalty`, and email links still need live verification.
- I did not run tests/build because this eval is read-only and test/build commands may write caches or build artifacts.

## Immediate next step

Verify the live domain migration status, then resume the migration-announcement rollout from the remaining-recipient file after confirming Resend quota/sender configuration:

1. Confirm `https://www.perks-reminder.com`, `https://perks-reminder.com`, and `https://loyalty.perks-reminder.com` serve the expected app/landing flows.
2. Confirm old domains redirect correctly from `coupon-cycle.site`, `www.coupon-cycle.site`, and `loyalty.coupon-cycle.site`.
3. Dry-run a small remaining announcement batch, then send in limited batches if the dry run and quota are OK.
4. After sending, rerun the audit script to refresh `announcement-state` and confirm remaining count reaches zero.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/README.md` — product overview, canonical public URL, roadmap, dev/test basics.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/package.json` — scripts and stack dependencies.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/src/middleware.ts` — old-domain redirects, loyalty subdomain rewrite, loyalty auth redirects.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/src/lib/site.ts` — canonical site URL/root-domain helpers.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/src/lib/auth.ts` — NextAuth canonical URL and shared cookie-domain behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/src/components/DomainMigrationBanner.tsx` — old-domain banner shown to users.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/scripts/send-migration-announcement.js` — migration email sender.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/scripts/audit-migration-announcement.js` — Resend/database audit and state refresh.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/announcement-state/migration-announcement-summary.json` — current announcement progress.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/announcement-state/migration-announcement-remaining.txt` — remaining recipients for resumed rollout.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/domain-registration-and-migration-plan.md` — migration checklist and safety notes.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/vercel-domains-and-deploy.md` — Vercel domains, env vars, project IDs, deployment troubleshooting.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/user-migration-email-draft.md` — announcement copy.
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/ios-support.md` — PWA/Capacitor support plan and validation commands.

## Verification command/check

Targeted local checks before shipping migration-related changes:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/credit-card-tracker__cold-resume__no-harness/repo
npm test -- --runInBand src/__tests__/middleware.test.ts src/components/__tests__/DomainMigrationBanner.test.tsx src/lib/__tests__/site.test.ts src/lib/__tests__/loyalty-links.test.ts
node scripts/send-migration-announcement.js --dry-run --only-file=announcement-state/migration-announcement-remaining.txt --limit=5
npm run build
```

Live checks needed for the current migration focus:

```bash
curl -I https://coupon-cycle.site
curl -I https://www.coupon-cycle.site
curl -I https://loyalty.coupon-cycle.site
curl -I https://www.perks-reminder.com
curl -I https://loyalty.perks-reminder.com
```

Expected behavior: old domains redirect to the matching new Perks Reminder hosts, the main app loads on `www.perks-reminder.com`, and the loyalty host reaches the loyalty landing/sign-in flow. Also manually verify OAuth login on the main and loyalty hosts.

## Confidence and why

Medium-high. The repo has direct, concrete evidence for the domain migration and partial announcement state in source, docs, scripts, tests, and persisted state files. Confidence is not higher because this no-harness eval lacks project context files, live domain/Vercel state may have changed since the docs/state files were written, and I did not run tests/build or inspect production services.