## Current understanding

The active work appears to be the CouponCycle -> Perks Reminder domain migration and user-announcement closeout, not a new product feature. The repository code has already been moved toward `perks-reminder.com`: `src/lib/site.ts` defines `ROOT_DOMAIN = 'perks-reminder.com'`, `src/middleware.ts` redirects `coupon-cycle.site` and `loyalty.coupon-cycle.site` to the new domains, `src/components/DomainMigrationBanner.tsx` warns old-domain visitors, and `scripts/send-migration-announcement.js` sends the migration email. The strongest active-state signal is `announcement-state/migration-announcement-summary.json`: 481 expected recipients, 195 sent, 286 remaining, generated after a first failed recipient on 2026-04-27. The next step should therefore be an operational closeout: resume/finish the remaining migration announcement safely and then verify the migration surface.

## Active blockers or uncertainty

- The prior send likely stopped on Resend daily quota or another send failure; confirm the Resend quota/window before resuming.
- `scripts/send-migration-announcement.js` does not update `announcement-state/` after sending; that state is maintained by `scripts/audit-migration-announcement.js`, so a follow-up audit is required.
- Domain status documentation is inconsistent with code/README: `docs/vercel-domains-and-deploy.md` still marks `perks-reminder.com`, `www.perks-reminder.com`, and `loyalty.perks-reminder.com` as Pending, while source and README assume they are live. Verify Vercel/DNS/OAuth state before treating the migration as closed.
- The announcement-state files contain real user email addresses; avoid pasting full lists into logs, issues, or PR text.

## Immediate next step

Resume the migration announcement in a controlled batch from the remaining-recipient file, after first doing a dry-run count and optionally a single-recipient smoke test:

1. From the repository root, confirm the remaining batch input:
   `node scripts/send-migration-announcement.js --dry-run --only-file=announcement-state/migration-announcement-remaining.txt --limit=5`
2. Confirm `RESEND_API_KEY`, `DATABASE_URL`, and `ANNOUNCEMENT_FROM_EMAIL`/default sender are valid and that Resend quota has reset.
3. Send a small batch first, not all 286 at once:
   `node scripts/send-migration-announcement.js --force --only-file=announcement-state/migration-announcement-remaining.txt --limit=50`
4. If successful, continue with another bounded batch. If quota fails, capture the first unsent recipient from the failure output and rerun the audit with `--first-failed=<that-address>` to refresh `announcement-state/`.
5. Once all are sent, run the audit and update/check `announcement-state/migration-announcement-summary.json` so `remaining` is 0.

## Relevant files

- `scripts/send-migration-announcement.js` - announcement sender; supports `--dry-run`, `--force`, `--to=`, `--limit=`, and `--only-file=`.
- `scripts/audit-migration-announcement.js` - regenerates `announcement-state/migration-announcement-{sent,remaining,summary}` from Resend/database or a known first failed address.
- `announcement-state/migration-announcement-summary.json` - current state shows 195 sent and 286 remaining.
- `announcement-state/migration-announcement-remaining.txt` - input list for the next send batch.
- `docs/user-migration-email-draft.md` - intended email copy.
- `src/middleware.ts` - old-domain redirect and loyalty-subdomain routing.
- `src/components/DomainMigrationBanner.tsx` - old-domain banner.
- `src/lib/site.ts` and `src/lib/auth.ts` - canonical domain and shared auth/cookie behavior.
- `docs/domain-registration-and-migration-plan.md` and `docs/vercel-domains-and-deploy.md` - migration checklist/status docs; verify/update later because docs appear stale.

## Verification command/check

Code-level regression checks for the domain/auth migration:

`npm test -- src/__tests__/middleware.test.ts src/components/__tests__/DomainMigrationBanner.test.tsx src/lib/__tests__/site.test.ts src/lib/__tests__/loyalty-links.test.ts`

Operational checks after sending:

- `node scripts/audit-migration-announcement.js` and confirm `announcement-state/migration-announcement-summary.json` reports `remaining: 0`.
- Check the live redirects/auth manually or with headers:
  - `https://coupon-cycle.site` -> `https://www.perks-reminder.com`
  - `https://www.coupon-cycle.site` -> `https://www.perks-reminder.com`
  - `https://loyalty.coupon-cycle.site` -> `https://loyalty.perks-reminder.com`
  - `https://loyalty.perks-reminder.com/auth/signin` redirects to the canonical `www.perks-reminder.com` auth host with a loyalty callback.

## Confidence and why

Medium-high. The repository contains explicit migration code, migration docs, an announcement sender/auditor, and persisted announcement-state showing a partially completed send. The main uncertainty is operational rather than code-related: actual Resend quota, live DNS/Vercel/OAuth status, and whether any emails were sent after the recorded 2026-04-27 audit cannot be confirmed from the repository copy alone.
