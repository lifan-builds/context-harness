# Current understanding

This repo copy is `perks-reminder`, a Next.js 15 / React 19 credit-card benefits tracker backed by Prisma and Neon PostgreSQL, deployed on Vercel. The completed task I can infer from repository evidence is code-side domain/auth migration work from `coupon-cycle.site` to `perks-reminder.com`, including loyalty subdomain handling, canonical `www` auth URLs, old-domain redirects, and public catalog/build safeguards.

The repository intentionally has no `AGENTS.md`, `CONTEXT.md`, `NOW.md`, `PLAN.md`, or `.context-harness`, so context maintenance should be recorded by creating/updating those context files when allowed, not by changing product source in this eval. The important update is not "domain migration fully launched"; code support appears present, but deployment/domain docs still mark the new `perks-reminder.com` domains as pending.

Context files that should be updated:

- `CONTEXT.md`: durable project state: app purpose; Next.js App Router + Prisma/Neon/Vercel architecture; `perks-reminder.com` as target/root domain; `coupon-cycle.site` as legacy redirect domain; loyalty subdomain behavior; static catalog + seed relationship; public anonymous surfaces must not import Prisma/auth; database safety model using Neon dev/prod and `DIRECT_URL` for migrations.
- `NOW.md`: current work status: code-side domain/auth migration appears implemented; live DNS/Vercel/OAuth/login verification is still pending or unconfirmed; no source edits were made during this eval; context files are absent and need restoration if this repo resumes normal context-harness use.
- `PLAN.md`: next checklist: run targeted auth/domain tests, public DB invariant, public build without DB, then verify live domains, redirects, OAuth callbacks, loyalty subdomain sign-in, and email links. Also reconcile stale docs if the live-domain status has changed.
- `AGENTS.md`: durable agent instructions if restored: preferred commands, database guardrails, card-benefit update process, source-of-truth files, public-surface constraints, and warnings that seed-only card benefit changes do not update existing users.

# Active blockers or uncertainty

- There is no reliable in-repo git history for the isolated copy; `git -C repo` resolved to the enclosing `context-harness` repository, so I ignored that output for project conclusions.
- No explicit task-completion note or diff exists inside the repo copy, so the inferred completed task is based on current files only.
- `docs/vercel-domains-and-deploy.md` still lists `perks-reminder.com`, `www.perks-reminder.com`, and `loyalty.perks-reminder.com` as `Pending`, while code and README already use `perks-reminder.com`; live deployment/DNS state is therefore uncertain.
- README and docs refer to missing `AGENTS.md`; `CONTRIBUTING.md` also references `AGENT.md` singular, which looks stale or erroneous.
- I did not read `.env` to avoid exposing secrets and did not run tests/builds because the eval requested deciding verification, not modifying or exercising potentially stateful commands.

# Immediate next step

Restore/update context files only:

1. Write `NOW.md` with the inferred state: domain/auth code support is present; live verification remains the next action; no repo source files were changed in this eval.
2. Write `PLAN.md` with a verification-first checklist: targeted Jest tests, public DB invariant, public no-DB build, Vercel/DNS/OAuth/live-login checks, then documentation reconciliation.
3. Write `CONTEXT.md` with durable architecture and safety facts from README, package scripts, Prisma schema, domain docs, and public-surface scripts.
4. Write `AGENTS.md` only as durable agent guidance, especially DB safety, card-benefit migration rules, and verification commands.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/package.json`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/README.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/CONTRIBUTING.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/docs/domain-registration-and-migration-plan.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/docs/vercel-domains-and-deploy.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/docs/safe-migration-guide.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/docs/benefit-update-quick-guide.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/docs/community-data-quality-loop.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/docs/benefit-usage-sources.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/src/middleware.ts`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/src/lib/site.ts`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/src/lib/auth.ts`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/src/app/layout.tsx`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/src/__tests__/middleware.test.ts`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/src/lib/__tests__/site.test.ts`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/scripts/check-public-db-invariant.cjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/scripts/check-public-build-without-db.cjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/scripts/audit-usage-guide-links.cjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/prisma/schema.prisma`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/prisma/seed.ts`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/src/lib/static-catalog.ts`
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__no-harness/repo/src/lib/benefit-usage-matching.ts`

# Verification command/check

For the inferred domain/auth migration task:

```bash
npm test -- --runTestsByPath src/__tests__/middleware.test.ts src/lib/__tests__/site.test.ts
npm run check:public-db
npm run check:public-build:no-db
```

After deployment or when credentials/access are available, also check:

```bash
curl -I https://coupon-cycle.site
curl -I https://www.coupon-cycle.site
curl -I https://loyalty.coupon-cycle.site
curl -I https://www.perks-reminder.com
curl -I https://loyalty.perks-reminder.com
```

Manual checks: confirm Vercel domains are no longer pending; confirm Google/GitHub/Facebook OAuth callback URLs use `https://www.perks-reminder.com/api/auth/callback/...`; sign in on `www.perks-reminder.com`; sign in from `loyalty.perks-reminder.com` and ensure callback returns to loyalty; verify notification/email links use the new domain.

If the completed task involved card/benefit catalog data instead of domain/auth, add these checks before production work:

```bash
npm run db:check
npm run db:dev:status
npm run usage-guides:audit
node scripts/update-card-benefits.js --card "Card Name" --dry-run
```

Only after dev validation and approval should a card-benefit migration run with `--force`, because seed changes alone do not update existing users.

# Context Evidence

- `package.json` identifies the project as `perks-reminder` and exposes relevant scripts: `test`, `check:public-db`, `check:public-build:no-db`, `usage-guides:audit`, `db:check`, `db:dev:*`, and the Vercel build command that runs Prisma generate/migrate then `next build`.
- `README.md` describes the app, stack, Neon prod/dev database workflow, live `perks-reminder.com` link, and roadmap; it also points to missing `AGENTS.md` for complete docs.
- `CONTRIBUTING.md` documents setup, card-info update priorities, and helpful scripts, but references `AGENT.md` singular in one place.
- `docs/domain-registration-and-migration-plan.md` records the migration target `perks-reminder.com`, legacy `coupon-cycle.site`, code/config areas to update, and required post-switch checks.
- `docs/vercel-domains-and-deploy.md` says the new root, `www`, and loyalty domains are pending while legacy redirects are live, and documents required Vercel environment variables including `NEXTAUTH_URL`, `DIRECT_URL`, OAuth secrets, and email/cron settings.
- `src/middleware.ts` defines `OLD_DOMAIN = 'coupon-cycle.site'` and `NEW_DOMAIN = 'perks-reminder.com'`, redirects old root/www and loyalty domains to the new hosts, rewrites loyalty root to `/loyalty-landing`, and redirects loyalty auth routes to the main auth host.
- `src/lib/site.ts` defines `ROOT_DOMAIN = 'perks-reminder.com'`, canonicalizes apex auth URLs to `www`, and computes shared cookie domains.
- `src/lib/auth.ts` mutates `NEXTAUTH_URL` to the canonical `www` host, shares secure NextAuth cookies across the root domain in production, and allows loyalty-subdomain redirects.
- `src/__tests__/middleware.test.ts` covers loyalty auth redirects and localhost behavior; `src/lib/__tests__/site.test.ts` covers apex-to-www auth canonicalization.
- `src/app/layout.tsx` uses shared site constants and includes `DomainMigrationBanner`, tying the domain migration to the app shell.
- `scripts/check-public-db-invariant.cjs` enforces anonymous public pages and public APIs do not import Prisma/auth at module scope and that builds do not seed the database.
- `scripts/check-public-build-without-db.cjs` runs `next build` with intentionally unreachable database URLs to validate anonymous/public build behavior without DB availability.
- `docs/safe-migration-guide.md` states Neon dev/prod rules, forbids destructive production commands, and requires `DIRECT_URL` for Prisma migrations.
- `docs/benefit-update-quick-guide.md` and `docs/community-data-quality-loop.md` state that editing seed data alone only helps new users; existing users require `scripts/update-card-benefits.js --dry-run` then `--force`, with status creation.
- `prisma/seed.ts`, `src/lib/static-catalog.ts`, and `src/lib/benefit-usage-matching.ts` show static predefined card data, benefit usage guide seeding, and matching logic that should be treated as catalog source of truth.

# Confidence and why

Medium-high confidence on the technical state and recommended verification because multiple independent files agree on the app architecture, domain/auth implementation, database guardrails, and verification scripts. Medium confidence on the exact identity of the just-completed task because the isolated copy lacks a usable project-local git diff, commit log, task note, and context files; the domain/auth migration is the strongest inference from the current code/docs, but live deployment status remains unverified.
