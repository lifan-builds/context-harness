# Fresh Agent Problem-Solving Eval

Run: `2026-07-07-030919`
Repos: 5
Cases: 45
Modes: no-harness, flat-harness, progressive-harness
Gate: pass

| Repo | Scenario | No harness | Flat | Progressive | Δ vs none | Δ vs flat | Evidence | Main gap |
|---|---|---:|---:|---:|---:|---:|---|---|
| `agent-nexus` | cold-resume | 9/10 needs-review | 9/10 pass | 10/10 pass | 1 | 1 | hydrate, card, save | none |
| `agent-nexus` | next-step | 10/10 pass | 9/10 pass | 10/10 pass | 0 | 1 | hydrate, card | none |
| `agent-nexus` | context-maintenance | 9/10 needs-review | 10/10 pass | 10/10 pass | 1 | 0 | hydrate, card, save | none |
| `context-harness` | cold-resume | 9/10 needs-review | 10/10 pass | 10/10 pass | 1 | 0 | hydrate, card | none |
| `context-harness` | next-step | 10/10 pass | 10/10 pass | 10/10 pass | 0 | 0 | hydrate, card, save | none |
| `context-harness` | context-maintenance | 10/10 pass | 10/10 pass | 10/10 pass | 0 | 0 | hydrate, card, save | none |
| `credit-card-tracker` | cold-resume | 8/10 needs-review | 9/10 pass | 10/10 pass | 2 | 1 | hydrate, card, save | none |
| `credit-card-tracker` | next-step | 10/10 pass | 9/10 pass | 10/10 pass | 0 | 1 | hydrate, card, save | none |
| `credit-card-tracker` | context-maintenance | 8/10 needs-review | 10/10 pass | 10/10 pass | 2 | 0 | hydrate, card, save | none |
| `flight-plan` | cold-resume | 10/10 pass | 10/10 pass | 10/10 pass | 0 | 0 | hydrate, card | none |
| `flight-plan` | next-step | 10/10 pass | 10/10 pass | 10/10 pass | 0 | 0 | hydrate, card, save | none |
| `flight-plan` | context-maintenance | 9/10 needs-review | 10/10 pass | 10/10 pass | 1 | 0 | hydrate, card, save | none |
| `flyingpig` | cold-resume | 10/10 pass | 10/10 pass | 10/10 pass | 0 | 0 | hydrate, card | none |
| `flyingpig` | next-step | 10/10 pass | 10/10 pass | 10/10 pass | 0 | 0 | hydrate, card | none |
| `flyingpig` | context-maintenance | 8/10 needs-review | 9/10 pass | 10/10 pass | 2 | 1 | hydrate, card, save | none |

## Gate Checks

- PASS: all cases completed (0 pending)
- PASS: no progressive actionable gaps (0 gap(s))
- PASS: progressive average delta vs no-harness (0.7 (10.0 vs 9.3))
- PASS: no progressive regressions vs no-harness (0 regression(s))
- PASS: progressive beats/ties flat in >=90% (100%)
- PASS: hydrate evidence >=90% (100%)
- PASS: card/chunk order violations = 0 (0)
- PASS: flat overuse violations = 0 (0)
- PASS: save routing evidence >=90% (100%)
- PASS: harness drift hijacks = 0 (0)

## Actionable Gaps

No release-blocking gaps found by deterministic scoring.

## Case Details

- `agent-nexus__cold-resume__no-harness`: needs-review, 9/10; answer 8/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: Push Agent Nexus release changes, then restart AI IDEs or agent hosts if updated skill metadata is not visible.; avoided: none
- `agent-nexus__cold-resume__flat-harness`: pass, 9/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 0/10; missing: none; avoided: none
- `agent-nexus__cold-resume__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `agent-nexus__next-step__no-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `agent-nexus__next-step__flat-harness`: pass, 9/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 0/10; missing: none; avoided: none
- `agent-nexus__next-step__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `agent-nexus__context-maintenance__no-harness`: needs-review, 9/10; answer 9/10; retrieval 10/10; save 8/10; efficiency 10/10; missing: context-index.js update; avoided: none
- `agent-nexus__context-maintenance__flat-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `agent-nexus__context-maintenance__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `context-harness__cold-resume__no-harness`: needs-review, 9/10; answer 8/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: Review the cleanup diff, then commit/push and redeploy with Agent Nexus if accepted.; avoided: none
- `context-harness__cold-resume__flat-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `context-harness__cold-resume__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `context-harness__next-step__no-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `context-harness__next-step__flat-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `context-harness__next-step__progressive-harness`: pass, 10/10; answer 10/10; retrieval 9/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `context-harness__context-maintenance__no-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `context-harness__context-maintenance__flat-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `context-harness__context-maintenance__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `credit-card-tracker__cold-resume__no-harness`: needs-review, 8/10; answer 6/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: Implemented, deployed, and production-verified the public Neon quota hardening plan: anonymous public catalog/guide/referral/sitemap surfaces now use a static shared catalog ins...; User chose to wait for the July 2026 Neon quota reset instead of upgrading Neon or cutting over to an empty fallback. Expected reset boundary is 2026-07-01T00:00:00Z / June 30,...; avoided: none
- `credit-card-tracker__cold-resume__flat-harness`: pass, 9/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 0/10; missing: none; avoided: none
- `credit-card-tracker__cold-resume__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `credit-card-tracker__next-step__no-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `credit-card-tracker__next-step__flat-harness`: pass, 9/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 0/10; missing: none; avoided: none
- `credit-card-tracker__next-step__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `credit-card-tracker__context-maintenance__no-harness`: needs-review, 8/10; answer 7/10; retrieval 10/10; save 8/10; efficiency 10/10; missing: User chose to wait for the July 2026 Neon quota reset instead of upgrading Neon or cutting over to an empty fallback. Expected reset boundary is 2026-07-01T00:00:00Z / June 30,...; context-index.js update; avoided: none
- `credit-card-tracker__context-maintenance__flat-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `credit-card-tracker__context-maintenance__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flight-plan__cold-resume__no-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flight-plan__cold-resume__flat-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flight-plan__cold-resume__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flight-plan__next-step__no-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flight-plan__next-step__flat-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flight-plan__next-step__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flight-plan__context-maintenance__no-harness`: needs-review, 9/10; answer 8/10; retrieval 10/10; save 8/10; efficiency 10/10; missing: context-index.js update; avoided: none
- `flight-plan__context-maintenance__flat-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flight-plan__context-maintenance__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flyingpig__cold-resume__no-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flyingpig__cold-resume__flat-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flyingpig__cold-resume__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flyingpig__next-step__no-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flyingpig__next-step__flat-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flyingpig__next-step__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none
- `flyingpig__context-maintenance__no-harness`: needs-review, 8/10; answer 7/10; retrieval 10/10; save 8/10; efficiency 10/10; missing: Implemented and verified a minimal MCP-native existing-Chrome backend. Flying Pig can now Auto-Connect to an existing Chrome tab through Chrome DevTools MCP and run a minimal su...; context-index.js update; avoided: none
- `flyingpig__context-maintenance__flat-harness`: pass, 9/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 0/10; missing: none; avoided: none
- `flyingpig__context-maintenance__progressive-harness`: pass, 10/10; answer 10/10; retrieval 10/10; save 10/10; efficiency 10/10; missing: none; avoided: none

