- Current understanding
  - The project is Perks Reminder, a Next.js 15 / React 19 / Prisma / PostgreSQL app for tracking credit-card benefits, welcome bonuses, annual fees, loyalty programs, and recurring perk usage.
  - The most active repository focus appears to be the migration from the legacy CouponCycle domain (`coupon-cycle.site`) to `perks-reminder.com`, including canonical auth URL handling, legacy redirects, loyalty subdomain behavior, migration banner messaging, SEO metadata, analytics/Search Console setup, and Vercel domain/env configuration.
  - A secondary active maintenance theme is keeping predefined card/benefit data current and safely propagating seed/template changes to existing users through the unified benefit migration/update scripts.

- Active blockers or uncertainty
  - Domain migration state is not fully knowable from source alone: `docs/vercel-domains-and-deploy.md` marks `perks-reminder.com`, `www.perks-reminder.com`, and `loyalty.perks-reminder.com` as Pending, while code and README already target the new domain.
  - External setup remains the main blocker/uncertainty: Vercel domains, DNS, `NEXTAUTH_URL`, OAuth callback URLs, analytics/Search Console env vars, and live redirects cannot be confirmed from the repo copy.
  - Local browser console notes show Vercel Analytics script 404s on localhost (`/_vercel/insights/script.js`), which is likely local-only noise but should be separated from production verification.
  - The eval repo copy does not have its own `.git`; a `git -C repo ...` command resolved to the parent context-harness repository, so recent commit history for this app was not available and was not used as project-state evidence.

- Immediate next step
  - Verify the domain migration externally and with targeted regression tests: confirm Vercel/DNS/OAuth/env settings for `https://www.perks-reminder.com`, `https://perks-reminder.com`, `https://coupon-cycle.site`, and `https://loyalty.perks-reminder.com`; then run the domain/auth/banner tests listed below.
  - If those checks pass, update the domain checklist/status docs to reflect reality and continue monitoring login, loyalty subdomain redirects, notification links, Search Console, and Analytics.

- Relevant files
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/README.md` — product overview, tech stack, testing command, roadmap, and public domain references.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/package.json` — scripts including `npm test`, build, DB checks, and public-build checks.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/domain-registration-and-migration-plan.md` — migration checklist and known domain/auth/config areas.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/vercel-domains-and-deploy.md` — Vercel domain statuses, required env vars, and deployment/build notes.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/immediate-seo-setup.md` — Search Console, analytics, sitemap, mobile usability, and SEO checklist.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/src/middleware.ts` — redirects old domains to new domains and rewrites/auth-redirects loyalty subdomain traffic.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/src/lib/site.ts` — canonical site constants, shared cookie domain, and auth URL canonicalization.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/src/lib/auth.ts` — NextAuth canonical URL mutation, shared production cookies, and loyalty redirect allowance.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/src/components/DomainMigrationBanner.tsx` — legacy-domain user-facing migration banner and May 27, 2026 cutoff message.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/src/app/layout.tsx` — SEO metadata, Analytics, Search Console verification meta tag, banner inclusion, service worker, and app shell.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/community-data-quality-loop.md` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__cold-resume__no-harness/repo/docs/benefit-update-quick-guide.md` — benefit-data update workflow and existing-user migration guardrails.

- Verification command/check
  - Targeted regression command for the inferred active focus:
    `npm test -- --runInBand src/__tests__/middleware.test.ts src/lib/__tests__/site.test.ts src/components/__tests__/DomainMigrationBanner.test.tsx`
  - External smoke checks to pair with it:
    `curl -I https://coupon-cycle.site`, `curl -I https://www.coupon-cycle.site`, `curl -I https://perks-reminder.com`, `curl -I https://www.perks-reminder.com`, and `curl -I https://loyalty.perks-reminder.com`, then test OAuth sign-in callback behavior on the main and loyalty domains.

- Context Evidence
  - README says the product is live at `https://www.perks-reminder.com/`, tracks card benefits/loyalty/fees/usage guidance, uses Next.js 15 + Prisma + NextAuth + Vercel, and recommends `npm test`.
  - `docs/domain-registration-and-migration-plan.md` identifies the old production domain as `coupon-cycle.site`, target as `perks-reminder.com`, and lists outstanding checklist items for registration, Vercel, DNS, env vars, OAuth callbacks, redirects, banner, email announcement, and login/link tests.
  - `docs/vercel-domains-and-deploy.md` marks new `perks-reminder.com` domains Pending while legacy `coupon-cycle.site` domains are Live; it also says all domains share one Vercel deployment and loyalty subdomain handling lives in `src/middleware.ts`.
  - `src/middleware.ts` implements 308 redirects from `coupon-cycle.site` / `www.coupon-cycle.site` to `www.perks-reminder.com`, redirects `loyalty.coupon-cycle.site` to `loyalty.perks-reminder.com`, rewrites loyalty root to `/loyalty-landing`, and redirects loyalty auth pages to the main auth host.
  - `src/lib/site.ts` sets `ROOT_DOMAIN = 'perks-reminder.com'` and canonicalizes apex auth URLs to `https://www.perks-reminder.com`; `src/lib/auth.ts` applies that canonical URL for NextAuth and shares secure session cookies across production subdomains.
  - `src/components/DomainMigrationBanner.tsx` only appears on old-domain hostnames and points users to the corresponding new domain before May 27, 2026; its test covers old-domain visibility and new-domain absence.
  - `src/app/layout.tsx` contains SEO metadata, optional Google Analytics and Search Console verification env handling, and includes the migration banner in the app shell.
  - `docs/community-data-quality-loop.md` and `docs/benefit-update-quick-guide.md` show an ongoing maintenance process for verifying issuer/community data, updating `prisma/seed.ts`, and migrating existing users with dry-run/force scripts rather than relying on seed changes alone.

- Confidence and why
  - Medium-high. The active focus inference is supported by multiple independent files: migration docs, Vercel domain docs, middleware/auth/site code, tests, README domain references, and the migration banner. Confidence is not high because external Vercel/DNS/OAuth/Search Console state and true app git history are unavailable inside this no-harness repo copy.
