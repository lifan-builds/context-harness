# Fresh Agent Problem-Solving Eval

Run: `2026-07-06-012128`
Repos: 5
Cases: 20
Modes: no-harness, progressive-harness

| Repo | Scenario | No harness | Progressive | Delta | Main gap |
|---|---|---:|---:|---:|---|
| `agent-nexus` | cold-resume | 9/10 needs-review | 10/10 pass | 1 | model behavior gap |
| `agent-nexus` | next-step | 9/10 needs-review | 9/10 needs-review | 0 | model behavior gap |
| `context-harness` | cold-resume | 10/10 pass | 10/10 pass | 0 | none |
| `context-harness` | next-step | 9/10 needs-review | 10/10 pass | 1 | model behavior gap |
| `credit-card-tracker` | cold-resume | 6/10 needs-review | 9/10 needs-review | 3 | model behavior gap |
| `credit-card-tracker` | next-step | 5/10 needs-review | 7/10 needs-review | 2 | model behavior gap |
| `flight-plan` | cold-resume | 6/10 needs-review | 9/10 needs-review | 3 | model behavior gap |
| `flight-plan` | next-step | 7/10 needs-review | 7/10 needs-review | 0 | model behavior gap |
| `flyingpig` | cold-resume | 9/10 needs-review | 10/10 pass | 1 | model behavior gap |
| `flyingpig` | next-step | 6/10 needs-review | 9/10 needs-review | 3 | model behavior gap |

## Case Details

- `agent-nexus__cold-resume__no-harness`: needs-review, 9/10; missing: Push Agent Nexus release changes, then restart AI IDEs or agent hosts if updated skill metadata is not visible.; avoided: none
- `agent-nexus__cold-resume__progressive-harness`: pass, 10/10; missing: none; avoided: none
- `agent-nexus__next-step__no-harness`: needs-review, 9/10; missing: ### Never; avoided: none
- `agent-nexus__next-step__progressive-harness`: needs-review, 9/10; missing: ### Never; avoided: none
- `context-harness__cold-resume__no-harness`: pass, 10/10; missing: none; avoided: none
- `context-harness__cold-resume__progressive-harness`: pass, 10/10; missing: none; avoided: none
- `context-harness__next-step__no-harness`: needs-review, 9/10; missing: ### Never; avoided: none
- `context-harness__next-step__progressive-harness`: pass, 10/10; missing: none; avoided: none
- `credit-card-tracker__cold-resume__no-harness`: needs-review, 6/10; missing: Implemented, deployed, and production-verified the public Neon quota hardening plan: anonymous public catalog/guide/referral/sitemap surfaces now use a static shared catalog ins...; User chose to wait for the July 2026 Neon quota reset instead of upgrading Neon or cutting over to an empty fallback. Expected reset boundary is 2026-07-01T00:00:00Z / June 30,...; Setup: npm install; avoided: none
- `credit-card-tracker__cold-resume__progressive-harness`: needs-review, 9/10; missing: Setup: npm install; avoided: none
- `credit-card-tracker__next-step__no-harness`: needs-review, 5/10; missing: Implemented, deployed, and production-verified the public Neon quota hardening plan: anonymous public catalog/guide/referral/sitemap surfaces now use a static shared catalog ins...; User chose to wait for the July 2026 Neon quota reset instead of upgrading Neon or cutting over to an empty fallback. Expected reset boundary is 2026-07-01T00:00:00Z / June 30,...; Setup: npm install; ### Never; avoided: none
- `credit-card-tracker__next-step__progressive-harness`: needs-review, 7/10; missing: Setup: npm install; ### Never; avoided: none
- `flight-plan__cold-resume__no-harness`: needs-review, 6/10; missing: Use the generated AGENTS.md Context Index to open relevant CONTEXT.md sections before planning or editing.; Test: project-specific.; current focus; avoided: none
- `flight-plan__cold-resume__progressive-harness`: needs-review, 9/10; missing: Test: project-specific.; avoided: none
- `flight-plan__next-step__no-harness`: needs-review, 7/10; missing: Test: project-specific.; ### Never; avoided: none
- `flight-plan__next-step__progressive-harness`: needs-review, 7/10; missing: Test: project-specific.; ### Never; avoided: none
- `flyingpig__cold-resume__no-harness`: needs-review, 9/10; missing: Fix the dashboard/helper CDP launch/status path: use an app-owned alternate CDP port or honor FLYINGPIGCDPPORT, preserve the requested CDP host, and report port ownership confli...; avoided: none
- `flyingpig__cold-resume__progressive-harness`: pass, 10/10; missing: none; avoided: none
- `flyingpig__next-step__no-harness`: needs-review, 6/10; missing: Investigated the installed/local packaged Flying Pig desktop app work-window connection failure. The helper is healthy, but Open Work Window is blocked by a CDP loopback/port co...; Fix the dashboard/helper CDP launch/status path: use an app-owned alternate CDP port or honor FLYINGPIGCDPPORT, preserve the requested CDP host, and report port ownership confli...; ### Never; avoided: none
- `flyingpig__next-step__progressive-harness`: needs-review, 9/10; missing: ### Never; avoided: none

