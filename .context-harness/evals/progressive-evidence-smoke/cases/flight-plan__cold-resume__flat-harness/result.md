# Current understanding

Context-harness v3 migration for `flight-plan` is complete. The current project focus is to resume work by using the generated `AGENTS.md` Context Index to open the relevant `CONTEXT.md` sections before planning or editing.

`flight-plan` is a local Python 3.x CLI project for tracking aware flights and planning optimal routes with the `seats.aero` API and Google Flights. It centrally manages a family flight schedule, with primary routes around Seattle (`SEA`) and Hangzhou/Shanghai (`HGH`, `PVG`, `SHA`). Data is stored locally in Markdown/JSON under `data/`.

# Active blockers or uncertainty

- No active blockers are recorded in `NOW.md`.
- The main uncertainty is that project-specific verification commands are not documented in `CONTEXT.md`.
- CLI framework details are still uncertain: `argparse` or `click` is listed as to be determined.
- Any command requiring `SEATS_AERO_API_KEY` depends on a populated local `.env`; secrets must not be stored in context files.

# Immediate next step

Before planning or editing, follow `AGENTS.md`: start from `NOW.md`, then use the Context Index to open the relevant `CONTEXT.md` sections for the task. For implementation work, the likely first context sections are `Project Overview`, `Development Workflow`, `Project Structure`, `Architecture Decisions`, and `Flight Booking Principles`.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__flat-harness/repo/NOW.md` — current focus, blockers, immediate next step.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__flat-harness/repo/AGENTS.md` — session-start contract and Context Index.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__flat-harness/repo/CONTEXT.md` — durable project facts, constraints, workflow notes, and imported agent guide.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__flat-harness/repo/PLAN.md` — not present in this flat harness copy, so no PLAN sections were available.
- Project files named by context as relevant for future work: `data/`, `flight-plan.py` or `/src`, Seats.aero/API integration, and local schedule files such as `notion_export.md` and `schedule.json`.

# Verification command/check

No project-specific verification command is documented. The current concrete check is to confirm that absence before relying on a test command:

```sh
grep -n "Project-specific verification commands are not yet documented" /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flight-plan__cold-resume__flat-harness/repo/CONTEXT.md
```

For future source work, first inspect the Python project metadata and any existing verification scripts, then document the confirmed command in context. Run commands from the project root and ensure `.env` contains `SEATS_AERO_API_KEY` for API-dependent flows.

# Context Evidence

- `NOW.md` says the current focus is: "Context-harness v3 migration completed for flight-plan."
- `NOW.md` records no active blockers.
- `NOW.md` says the immediate next step is to use the generated `AGENTS.md` Context Index to open relevant `CONTEXT.md` sections before planning or editing.
- `AGENTS.md` says to read `NOW.md` first at session start/resume, then choose relevant `CONTEXT.md` sections from the Context Index.
- `AGENTS.md` says to respect `CONTEXT.md` Operating Constraints before planning or editing.
- `CONTEXT.md` says not to store secrets or credentials in context files and to preserve project-specific instructions when migrating context.
- `CONTEXT.md` says project-specific setup, run, test, and lint commands are not yet defined.
- `CONTEXT.md` flags that project-specific verification commands are not yet documented.
- `CONTEXT.md` imported notes describe the project as a Python CLI using Seats.aero and Google Flights for family flight schedule and award tracking.

# Confidence and why

High confidence for the current focus, blockers, next step, operating constraints, and verification-command uncertainty because those are explicitly recorded in the flat harness files. Medium confidence for future implementation file targets because `CONTEXT.md` describes expected structure and entrypoints, but `PLAN.md` is absent and the documented verification workflow is incomplete.
