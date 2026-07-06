# Fresh Agent Problem-Solving Eval

Run: `2026-07-06-031926`
Repos: 5
Cases: 20
Modes: no-harness, progressive-harness

| Repo | Scenario | No harness | Progressive | Delta | Main gap |
|---|---|---:|---:|---:|---|
| `agent-nexus` | cold-resume | 9/10 needs-review | 10/10 pass | 1 | model behavior gap |
| `agent-nexus` | next-step | 7/10 needs-review | 9/10 needs-review | 2 | model behavior gap |
| `context-harness` | cold-resume | 7/10 needs-review | 10/10 pass | 3 | model behavior gap |
| `context-harness` | next-step | 7/10 needs-review | 9/10 needs-review | 2 | model behavior gap |
| `credit-card-tracker` | cold-resume | 6/10 needs-review | 9/10 needs-review | 3 | model behavior gap |
| `credit-card-tracker` | next-step | 5/10 needs-review | 9/10 needs-review | 4 | model behavior gap |
| `flight-plan` | cold-resume | 7/10 needs-review | 9/10 needs-review | 2 | model behavior gap |
| `flight-plan` | next-step | 6/10 needs-review | 7/10 needs-review | 1 | model behavior gap |
| `flyingpig` | cold-resume | 9/10 needs-review | 10/10 pass | 1 | model behavior gap |
| `flyingpig` | next-step | 6/10 needs-review | 9/10 needs-review | 3 | model behavior gap |

## Case Details

- `agent-nexus__cold-resume__no-harness`: needs-review, 9/10; missing: Push Agent Nexus release changes, then restart AI IDEs or agent hosts if updated skill metadata is not visible.; avoided: none
- `agent-nexus__cold-resume__progressive-harness`: pass, 10/10; missing: none; avoided: none
- `agent-nexus__next-step__no-harness`: needs-review, 7/10; missing: Push Agent Nexus release changes, then restart AI IDEs or agent hosts if updated skill metadata is not visible.; Never classify packages by type — auto-discover all assets (skills, hooks, commands, agents) from file patterns (SKILL.md, hooks.json, etc.); avoided: none
- `agent-nexus__next-step__progressive-harness`: needs-review, 9/10; missing: Never classify packages by type — auto-discover all assets (skills, hooks, commands, agents) from file patterns (SKILL.md, hooks.json, etc.); avoided: none
- `context-harness__cold-resume__no-harness`: needs-review, 7/10; missing: The prioritized eval gaps are addressed in the working tree: harness drift is treated as a follow-up, eval scoring avoids key lexical false positives, and context cleanup guidan...; Review the focused gap-fix diff, then run any desired follow-up real-world eval batch before commit/push and local deployment.; avoided: none
- `context-harness__cold-resume__progressive-harness`: pass, 10/10; missing: none; avoided: none
- `context-harness__next-step__no-harness`: needs-review, 7/10; missing: The prioritized eval gaps are addressed in the working tree: harness drift is treated as a follow-up, eval scoring avoids key lexical false positives, and context cleanup guidan...; Review the focused gap-fix diff, then run any desired follow-up real-world eval batch before commit/push and local deployment.; avoided: none
- `context-harness__next-step__progressive-harness`: needs-review, 9/10; missing: Keep context-harness lightweight; do not turn it into a large process framework.; avoided: none
- `credit-card-tracker__cold-resume__no-harness`: needs-review, 6/10; missing: Implemented, deployed, and production-verified the public Neon quota hardening plan: anonymous public catalog/guide/referral/sitemap surfaces now use a static shared catalog ins...; User chose to wait for the July 2026 Neon quota reset instead of upgrading Neon or cutting over to an empty fallback. Expected reset boundary is 2026-07-01T00:00:00Z / June 30,...; Setup: npm install; avoided: none
- `credit-card-tracker__cold-resume__progressive-harness`: needs-review, 9/10; missing: Setup: npm install; avoided: none
- `credit-card-tracker__next-step__no-harness`: needs-review, 5/10; missing: Implemented, deployed, and production-verified the public Neon quota hardening plan: anonymous public catalog/guide/referral/sitemap surfaces now use a static shared catalog ins...; User chose to wait for the July 2026 Neon quota reset instead of upgrading Neon or cutting over to an empty fallback. Expected reset boundary is 2026-07-01T00:00:00Z / June 30,...; Setup: npm install; Never run destructive production database commands such as prisma migrate reset, db push --force-reset, or manual data deletion unless the user explicitly asks and the target is...; avoided: none
- `credit-card-tracker__next-step__progressive-harness`: needs-review, 9/10; missing: Setup: npm install; avoided: none
- `flight-plan__cold-resume__no-harness`: needs-review, 7/10; missing: Use the generated AGENTS.md Context Index to open relevant CONTEXT.md sections before planning or editing.; Test: project-specific.; avoided: none
- `flight-plan__cold-resume__progressive-harness`: needs-review, 9/10; missing: Test: project-specific.; avoided: none
- `flight-plan__next-step__no-harness`: needs-review, 6/10; missing: Use the generated AGENTS.md Context Index to open relevant CONTEXT.md sections before planning or editing.; Test: project-specific.; Never store secrets or credentials in context files.; avoided: none
- `flight-plan__next-step__progressive-harness`: needs-review, 7/10; missing: Test: project-specific.; Never store secrets or credentials in context files.; avoided: none
- `flyingpig__cold-resume__no-harness`: needs-review, 9/10; missing: Rebuild/repackage or run the source helper/app, then verify from the actual UI: open Chrome, visit chrome://inspect/#remote-debugging, allow remote debugging, click Auto-Connect...; avoided: none
- `flyingpig__cold-resume__progressive-harness`: pass, 10/10; missing: none; avoided: none
- `flyingpig__next-step__no-harness`: needs-review, 6/10; missing: Implemented source changes so Flying Pig can use a Claude-Code-style Auto-Connect Existing Chrome path through a helper-owned Chrome DevTools MCP bridge. The dashboard now has A...; Rebuild/repackage or run the source helper/app, then verify from the actual UI: open Chrome, visit chrome://inspect/#remote-debugging, allow remote debugging, click Auto-Connect...; Never hardcode secrets or PII — environment variables only; manual login flow for auth'd sites; avoided: none
- `flyingpig__next-step__progressive-harness`: needs-review, 9/10; missing: Never hardcode secrets or PII — environment variables only; manual login flow for auth'd sites; avoided: none

