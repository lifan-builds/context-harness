# Current understanding

Active work is `Launch & Growth`: FreshPowder is past core product/auth/UI/store-expansion phases and is now focused on seeding users, adding virality, and preparing monetization. `NOW.md` has no active focus and says to pick a task or review `PLAN.md`. The most concrete next implementation step in `PLAN.md` is the unchecked viral invite loop: auto-generate 3 invite codes on signup and add a `/my-codes` page.

# Active blockers or uncertainty

- Product choice: generated user referral codes should likely be single-use to measure viral coefficient cleanly, but current `create_invite_codes()` defaults to `max_uses=5`; confirm desired per-code usage limit.
- Data model gap: `invite_codes` currently has only `code`, `created_at`, and `max_uses`; there is no owner/source column, so `/my-codes` cannot list a user's generated codes without a schema migration.
- Context drift follow-up: `PLAN.md` decision card says the repo is private, while `CONTEXT.md` says the repo is public as of 2026-05-17. This does not block planning but should be reconciled in context later.

# Immediate next step

Implement the viral invite loop in a small vertical slice:

1. Extend auth DB schema/migration in `aggregator/aggregator/auth_db.py` to track generated invite-code ownership, e.g. nullable `created_by_invite_code` and `source` columns on `invite_codes`, with an idempotent `ALTER TABLE` migration in `init_auth_db()`.
2. Add auth DB helpers such as:
   - `ensure_referral_codes(parent_invite_code: str, count: int = 3, max_uses: int = 1)`
   - `list_referral_codes(parent_invite_code: str)` returning code/use-count rows.
3. Reuse or move the readable snow-code generator currently embedded in `aggregator/aggregator/web/admin_routes.py` so admin and referral code generation share one implementation.
4. In `aggregator/aggregator/web/invite_routes.py`, after successful invite validation/`record_code_use(code)`, ensure the signing-in invite code has 3 generated child codes before issuing the session cookie.
5. Add a protected `/my-codes` route (same router is fine) that uses `require_invite(request)` to get the current invite code and renders a new `my_codes.html` template with the user's generated codes and use counts.
6. Add a visible link to `/my-codes` from the authenticated UI, likely `aggregator/aggregator/web/templates/index.html`.
7. Cover the behavior in `aggregator/tests/test_web_routes.py` using the existing `isolated_app` fixture.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__next-step__progressive-harness/repo/PLAN.md` — active growth checklist and viral invite-loop task.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__next-step__progressive-harness/repo/aggregator/aggregator/auth_db.py` — invite schema and code/session helpers.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__next-step__progressive-harness/repo/aggregator/aggregator/web/invite_routes.py` — successful invite submission flow.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__next-step__progressive-harness/repo/aggregator/aggregator/web/admin_routes.py` — existing readable code generator to reuse/extract.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__next-step__progressive-harness/repo/aggregator/aggregator/auth.py` — session identity via `require_invite()` and protected-route middleware.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__next-step__progressive-harness/repo/aggregator/aggregator/web/templates/index.html` and new `my_codes.html` — authenticated UI entry point/page.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/deal__next-step__progressive-harness/repo/aggregator/tests/test_web_routes.py` — best place for integration tests around signup, cookies, route protection, and generated codes.

# Verification command/check

For the implementation slice, verify with:

```bash
cd aggregator && python -m pytest aggregator/tests/test_web_routes.py -x -q
cd aggregator && python -m pytest aggregator/tests/ -x -q
uvicorn aggregator.web.app:create_app --factory
```

Specific checks to add:

- Posting a valid invite code sets the session cookie and creates exactly 3 child/referral codes for that invite.
- Re-posting/logging in with the same invite does not create duplicate child codes.
- `/my-codes` redirects when unauthenticated and returns the generated codes when authenticated.
- Generated referral codes respect the chosen `max_uses` and appear with accurate use counts.

# Context Evidence

1. Read `NOW.md`: no current focus; no blockers; immediate next step is to pick a task or review `PLAN.md`.
2. Read `AGENTS.md`: v3 context contract and generated Context Index present.
3. Checked `CONTEXT.md` size, then read it directly because it is concise; captured project structure, operating constraints, workflow, and learned patterns.
4. Ran `node scripts/context-index.js hydrate "plan next implementation step"` from the repo root. Selected cards: `ctx-plan-archive`, `ctx-plan-decisions`, `ctx-plan-findings`, `ctx-plan-goal`, `ctx-plan-progress`, `ctx-now-now`, `ctx-context-operating-constraints`.
5. Opened selected plan cards before raw plan: `ctx-plan-goal`, `ctx-plan-progress`, `ctx-plan-findings`, `ctx-plan-decisions`, `ctx-plan-archive`.
6. Read `PLAN.md` after hydration/cards; identified viral invite loop as the most concrete next implementation task.
7. Inspected relevant source/test files read-only: `auth_db.py`, `invite_routes.py`, `admin_routes.py`, `auth.py`, `app.py`, and `test_web_routes.py`; listed app/template/test directories.

# Confidence and why

Medium-high. The plan is directly grounded in `PLAN.md` and current auth/invite code. Main uncertainty is product policy for generated referral-code usage limits and the context conflict about repo public/private status; neither blocks identifying the next implementation slice.