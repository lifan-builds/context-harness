# Current understanding

Perks Reminder is a free, open-source Next.js 15 / React 19 / TypeScript PWA for tracking recurring credit card benefits, loyalty expirations, and reminder emails. The current focus is provider recovery after Neon Free compute quota exhaustion took production/dev DB-backed features offline. Public anonymous catalog/guide/referral/sitemap surfaces were already hardened to use a shared static catalog instead of Prisma, production builds no longer seed automatically, and Neon endpoints/defaults were lowered to `0.25-1 CU` to reduce recurrence risk. The user chose to wait for the July 2026 Neon quota reset rather than pay for Neon Launch or cut production over to an empty fallback database.

# Active blockers or uncertainty

- Last recorded blocker: Neon production and dev databases were unavailable with quota-exhaustion errors, so logged-in DB-backed features remained unavailable until quota reset, upgrade, or restore.
- The context was last updated on 2026-06-26 and expected reset at `2026-07-01T00:00:00Z`; because that date has passed, the main uncertainty is whether Neon access has actually recovered and whether logged-in production flows are healthy.
- Do not select/confirm a paid Neon plan without explicit user approval.
- Do not point production at the prepared empty staging fallback DB without fresh explicit approval, because it would preserve public availability but create an empty-account experience for existing users.
- Supabase fallback signup was blocked by hCaptcha and remains gated on user action/approval.

# Immediate next step

Run `npm run db:check` immediately against the current configured databases, then verify logged-in production DB-backed flows if the check succeeds. If production DB access is restored, export a Neon backup and monitor July compute usage with the public DB-free hardening in place. If DB access is still blocked, report that the quota/provider issue persists and ask before any paid-plan or empty-fallback cutover action.

# Relevant files

- `NOW.md` — primary current-state source for focus, blockers, next step, touched files, and prior verification.
- `CONTEXT.md` — durable project context, operating constraints, workflows, and learned Neon/public-catalog patterns.
- `AGENTS.md` — context contract and index for flat-file catch-up.
- `PLAN.md` — older product-priority plan; useful background, but not the active provider-recovery source.
- `package.json` — contains verification scripts referenced by context, including DB/public checks.
- `scripts/check-database-connection.js` — DB target/status inspection helper.
- `docs/supabase-fallback.md` — fallback runbook if Neon remains unusable.
- `src/lib/static-catalog.ts`, `prisma/seed.ts`, and public route files under `src/app/` — relevant to the completed public DB-free hardening.

# Verification command/check

Primary check: `npm run db:check`.

Follow-up checks after DB recovery: smoke logged-in production DB-backed flows such as sign-in, card add/status materialization, `/cards`, `/settings/data`, `/loyalty`, and `/api/user-cards/export`; then export a Neon backup and monitor July usage. For public-route regressions after catalog/public changes, use `npm run check:public-db` and `npm run check:public-build:no-db`.

# Context Evidence

- `NOW.md` says the current work is provider recovery for DB-backed logged-in features after public Neon quota hardening was implemented and production verified.
- `NOW.md` lists Neon quota exhaustion as the active blocker, with Free-plan usage at `110.31 / 100 CU-hrs`, all visible computes idle/archived, and all endpoints/defaults already reduced to `0.25-1 CU`.
- `NOW.md` records the decision to wait for the July 2026 quota reset and says not to upgrade Neon or cut over to the empty fallback without fresh explicit approval.
- `NOW.md` records the prepared staging fallback DB and its smoke-test success, but also states it has no real production users/cards.
- `CONTEXT.md` operating constraints forbid destructive production DB commands, `.env` modification, and production data work without target verification.
- `CONTEXT.md` learned patterns document the Neon quota failure mode, public DB-free catalog invariant, explicit catalog seeding rule, Supabase fallback gate, and production Vercel alias caveat.
- `AGENTS.md` confirms the v3 context contract and flat context index.
- `PLAN.md` is present but describes older product slices; it does not supersede the provider-recovery state in `NOW.md`.

# Confidence and why

High confidence on the last recorded focus, blockers, and required next check because they are explicit in `NOW.md` and supported by `CONTEXT.md` operating constraints/learned patterns. Medium confidence on the live production state because the context predates the expected Neon reset; `npm run db:check` and logged-in production smoke tests are required to confirm whether recovery has occurred.