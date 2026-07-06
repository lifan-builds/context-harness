# Judge Prompt: credit-card-tracker__next-step__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Implemented, deployed, and production-verified the public Neon quota hardening plan: anonymous public catalog/guide/referral/sitemap surfaces now use a static shared catalog ins...
- must mention: User chose to wait for the July 2026 Neon quota reset instead of upgrading Neon or cutting over to an empty fallback. Expected reset boundary is 2026-07-01T00:00:00Z / June 30,...
- must mention: Setup: npm install
- must mention: next step
- must mention: verification
- must mention: Do not run destructive production database commands such as prisma migrate reset, db push --force-reset, or manual data deletion unless the user explicitly asks and the target i...
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-operating-constraints
- progressive card expected: ctx-context-workflow
