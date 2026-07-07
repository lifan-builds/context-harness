# Current understanding

The isolated repo copy is `flight-plan`, a private local Python/uv CLI for family travel operations: parsing a Markdown timeline, checking visa-stay constraints, querying Seats.aero award availability, and comparing cash fares. The context-harness state says the v3 migration for `flight-plan` is complete, with no recorded blockers, and the resume path should use `AGENTS.md` plus generated context-index cards before planning or editing.

Product-level current work is the CFH Spring 2026 return-flight search from Seattle to Shanghai/Hangzhou, preferably with a Japan stopover. The basic CLI is functional; `PLANS.md` says completed work includes timeline parsing, Seats.aero client setup, flight-check commands, and a fix for the `destination_airport` API parameter. Remaining planned work is automated caching and cpp evaluation, plus possible daily checks driven from `ACTIVE_SEARCH.md`.

# Active blockers or uncertainty

- No active blockers are recorded in `NOW.md`.
- `CONTEXT.md` flags that project-specific verification commands are not yet documented there; README gives practical CLI commands.
- Environment/API uncertainty: Seats.aero checks require `SEATS_AERO_API_KEY` in `.env` or the environment. I did not read `.env` because it may contain secrets.
- Documentation mismatch: `README.md` says Python 3.10+, while `pyproject.toml` requires Python `>=3.13`.
- Domain/booking uncertainty: `ACTIVE_SEARCH.md` next steps require point-balance information and exact TYO to PVG/HGH cash-price checks before booking decisions.
- Technical constraint from `PLANS.md`: Cloudflare blocks automated access to the Seats.aero web frontend, so the Partner API should be used instead.

# Immediate next step

For a fresh/resumed coding session: continue to use the generated `AGENTS.md` Context Index and `node scripts/context-index.js hydrate "resume current task"` before opening bulky planning/context files.

For product work: implement automated caching and cpp evaluation for award tickets against cash fares, then use that to evaluate the active CFH SEA to China search and the Japan-stopover option. For travel planning specifically, first evaluate available point balances and check exact TYO to PVG/HGH cash fares for candidate late-April/early-May 2026 dates.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/NOW.md` — current context-harness focus, blockers, next step.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/AGENTS.md` — v3 Context Contract and generated Context Index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project overview, constraints, workflow, and migrated agent notes.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/PLANS.md` — app execution plan, progress, discoveries, next product work.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/ACTIVE_SEARCH.md` — active CFH Spring 2026 flight-search goal and next booking-analysis steps.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/README.md` — setup, usage, repository map, privacy notes.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/main.py` — Click CLI entry point for timeline, visa, API, and cash-search commands.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/seats_aero.py` — Seats.aero API wrapper referenced by `main.py` and `verify_fb.py`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/google_flights.py` — cash-fare search wrapper referenced by `main.py`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/verify_fb.py` — direct Flying Blue/Seats.aero check script.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/pyproject.toml` — Python requirement and dependencies.

# Verification command/check

Recommended non-secret local smoke check:

```bash
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo" && uv run main.py get-timeline && uv run main.py visa-check
```

API-specific check, only when `SEATS_AERO_API_KEY` is configured:

```bash
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo" && uv run main.py check-flights
```

I did not run these commands during the read-only eval because `uv run` may create or update local environment/cache artifacts and the API check depends on secrets.

# Context Evidence

1. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/prompt.md` for exact eval instructions.
2. Invoked the `context-catch-up` skill for the isolated repo copy and read-order constraints.
3. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/NOW.md` first.
4. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/CONTEXT.md` as the concise always-read layer.
5. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/AGENTS.md` for the Context Contract and Context Index.
6. Ran hydrate once with an absolute script path but inherited the parent cwd; discarded that output because it selected parent context-harness cards, not flight-plan cards.
7. Ran the required hydrate from the repo copy: `cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo" && node scripts/context-index.js hydrate "resume current task"`.
8. Correct hydrate output selected one card: `ctx-now-now` (`NOW.md#now`), summary: context-harness v3 migration completed for flight-plan.
9. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-now-now.md` before raw planning files.
10. Ran read-only file listing: `find "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo" -maxdepth 2 -type f | sort`.
11. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/README.md`, `pyproject.toml`, and `verify_fb.py`.
12. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/ACTIVE_SEARCH.md` and `main.py`.
13. Ran `git -C "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo" status --short`; it resolved to the parent git repo, not a standalone eval-copy git root, so I used it only as a caution signal.
14. Ran `git -C "/Users/lfan/Project/context-harness" diff --name-only` to understand the parent status caution; not used for flight-plan conclusions.
15. Read `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__progressive-harness/repo/PLANS.md` after hydrate/card review to inspect the repo’s living execution plan.

# Confidence and why

Medium-high. The context-harness resume path was followed in the required order after correcting the cwd for hydrate, and the answer is grounded in `NOW.md`, concise `CONTEXT.md`, `AGENTS.md`, the selected `ctx-now-now` card, README, `ACTIVE_SEARCH.md`, `PLANS.md`, and the CLI entry point. Confidence is not maximal because no runtime commands were executed, API behavior depends on a secret key, and the eval copy is nested inside the parent git repo rather than appearing as its own clean git root.