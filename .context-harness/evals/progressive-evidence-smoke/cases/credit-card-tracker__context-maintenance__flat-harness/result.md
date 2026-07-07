# Current understanding

The completed task was the public Neon quota hardening / DB-free public-surface recovery effort. The public anonymous catalog, guide, referral, sitemap, and search-related surfaces were moved away from Prisma-backed runtime access where possible, production deploys no longer seed during build, static-catalog/public DB-free checks were added, and production was deployed and verified. The remaining active work is provider recovery for logged-in DB-backed features because the production/dev Neon project is still over its June 2026 Free compute quota.

Context maintenance should treat this as two layers:

- `NOW.md` should keep the current operational state: Neon quota exhaustion, exact known recovery choices, which fallback paths are safe or blocked, what has been verified, and the next action after reset.
- `CONTEXT.md` should keep only durable lessons/invariants from the incident: public anonymous routes must not depend on Prisma, production builds must not run catalog seeding, Neon Free quota/settings behavior, Supabase fallback rules, empty fallback caveats, and Vercel alias/project mapping.
- `PLAN.md` should be updated because it currently has no matching Neon quota/provider-recovery active slice. Add an active slice for “Neon quota recovery / public DB-free hardening” with goal, findings, decisions, progress, remaining follow-ups, and verification. This is task-local operational history and should not be buried only in `NOW.md`.
- `AGENTS.md` should not change unless the context contract itself changes. Its existing rules already say durable facts go to `CONTEXT.md`, task-local findings/decisions go to `PLAN.md`, and `NOW.md` is updated before ending.

# Active blockers or uncertainty

- Neon production and dev DB-backed features remain unavailable until quota resets/restores/upgrades; `NOW.md` records the provider error and quota state.
- Do not click/select a paid Neon plan without explicit user approval.
- Do not cut production over to the staging fallback unless the user explicitly accepts an empty-account experience; the staging fallback is prepared but has no real production user data.
- Supabase fallback registration is blocked on hCaptcha/manual user action, so it is documented but not cut over.
- No local production dump/backup was found in the searched locations, and Neon CLI/API paths do not provide a no-paid cross-project copy while production compute is exhausted.
- The eval copy is nested under the outer `context-harness` git repo, so outer `git status` is not reliable evidence for app-source changes in this repository copy.

# Immediate next step

Wait for the July 2026 Neon quota reset, then immediately run `npm run db:check`, verify logged-in production DB-backed flows, export a Neon backup, and monitor July usage with the DB-free public hardening in place. Do not change production to the empty fallback DB or approve a paid plan without fresh explicit user approval.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__flat-harness/repo/NOW.md` — should contain the current focus, blockers, immediate next step, touched files, and verification status for the just-completed hardening/recovery work.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__flat-harness/repo/CONTEXT.md` — should contain durable incident lessons and operational invariants, especially Neon quota failure mode, Neon Free compute settings, public DB-free catalog rules, explicit seeding, Supabase fallback gate, fallback migration caveat, and Vercel alias mapping.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__flat-harness/repo/PLAN.md` — should get the missing task-local active slice for the Neon quota recovery/public DB-free hardening work.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/credit-card-tracker__context-maintenance__flat-harness/repo/AGENTS.md` — no content update needed; it already defines where `NOW.md`, `CONTEXT.md`, and `PLAN.md` updates belong.
- Operational/source files referenced by the context as touched or relevant: `src/lib/static-catalog.ts`, `prisma/seed.ts`, `next.config.ts`, `scripts/check-public-db-invariant.cjs`, `scripts/check-public-build-without-db.cjs`, `scripts/check-database-connection.js`, `docs/supabase-fallback.md`, and `package.json`.

# Verification command/check

For the next provider-recovery step after quota reset:

```bash
npm run db:check
```

Then verify production logged-in DB-backed flows: sign in, load card/benefit/loyalty/settings/data pages, add a card or otherwise exercise a safe DB-backed read/write path, and export a Neon backup.

For any future public-route/catalog change related to this incident, rerun:

```bash
npm run check:public-db
npm run check:public-build:no-db
npx tsc --noEmit --pretty false
npm run build
```

If `CONTEXT.md` is actually edited in a real maintenance pass, follow `AGENTS.md` and run:

```bash
node scripts/context-index.js update
```

# Context Evidence

- `NOW.md:4` states the public Neon quota hardening plan is implemented, deployed, and production-verified, and that current work is provider recovery for DB-backed logged-in features.
- `NOW.md:7-20` lists active blockers: Neon quota exhaustion, exact quota usage, endpoint autoscaling settings, paid-plan constraint, Supabase hCaptcha, empty staging fallback status, no local dump found, Neon CLI/API limitations, Vercel project/alias mapping, and remaining `db:check` errors.
- `NOW.md:22-28` gives the immediate next step and the completed verification/touched-file list.
- `CONTEXT.md:90-96` already records durable learned patterns from the incident: Neon quota failure mode, Neon Free compute settings, public DB-free catalog, explicit catalog seeding, Supabase fallback gate, fresh fallback DB migration caveat, and production Vercel alias mapping.
- `AGENTS.md:10-14` says task-local findings and decisions belong in `PLAN.md`, durable lessons in `CONTEXT.md`, and `NOW.md` should be updated before ending.
- `PLAN.md` contains prior product/guide/card-lifecycle slices but no Neon quota/provider-recovery slice; a narrow grep for Neon/quota/fallback/Supabase/static-catalog only found unrelated Vercel/`daily_quota_exceeded` mentions.
- `package.json:25,30-35` confirms the available verification scripts: `build`, `check:public-db`, `check:public-build:no-db`, and `db:check`.

# Confidence and why

High. I read the required flat files (`NOW.md`, `CONTEXT.md`, `AGENTS.md`, and `PLAN.md`) and verified exact script names in `package.json`. The only caveat is that this eval copy is not an independent git checkout, so I did not use outer-repo git status as evidence for app-source changes.