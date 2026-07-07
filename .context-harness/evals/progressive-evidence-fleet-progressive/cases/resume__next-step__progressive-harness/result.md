# Current understanding

Active work is OpenAI recruiter-screen preparation for the applied `Senior Software Engineer, Infrastructure` role in Bellevue, likely around Statsig infrastructure. The prep artifact already exists at `interview-prep/openai-recruiter-round-statsig-infrastructure.md` and is aligned with local role evidence in `job-search/openings.md` and the application archive manifest.

This should be treated as closeout/rehearsal work, not a source-editing implementation task. The strongest framing is: launch-critical experimentation, analytics, rollout-safety, observability, and product/model measurement infrastructure at Google scale.

# Active blockers or uncertainty

- No blocker for recruiter-round prep.
- The actual recruiter call/team focus is still unconfirmed: Statsig may emphasize experimentation, dynamic config, analytics ingestion, observability, launch tooling, or product/model measurement.
- Level calibration is an uncertainty because Lifan is Staff at Google but applied to a Senior-titled OpenAI role.
- Screenshot extraction was incomplete only because pages 1/13 and 13/13 were missing from the source folder; that does not block recruiter prep.

# Immediate next step

Do a focused 20-30 minute rehearsal using `interview-prep/openai-recruiter-round-statsig-infrastructure.md`:

1. Rehearse the 30-second pitch and 2-minute opening script aloud.
2. Practice concise answers for: "Why OpenAI?", "Why this Statsig infrastructure role?", "Have you used Statsig directly?", level calibration, location, compensation, and AI safety.
3. Prepare the three story anchors in priority order:
   - Google Maps launch-readiness infrastructure.
   - Maps Happiness Indicator / product metrics and 200+ experiment reviews.
   - AWS Anomaly Detection GA service for backend/platform reliability.
4. Use the recruiter questions section to confirm the actual team focus and next interview loop.
5. After the call, update `NOW.md` with the confirmed next step and, if technical rounds are scheduled, create or update a task-local prep plan for coding/system-design/deep-dive topics.

# Relevant files

- `NOW.md` — current focus, blockers, immediate next step, touched files.
- `CONTEXT.md` — durable constraints and project conventions.
- `.context-harness/cards/ctx-now-now.md` — selected card for active focus.
- `.context-harness/cards/ctx-context-operating-constraints.md` — selected card for constraints.
- `.context-harness/cards/ctx-context-do-not.md` — selected card for do-not rules.
- `.context-harness/cards/ctx-context-project-structure.md` — selected card for repo structure.
- `interview-prep/openai-recruiter-round-statsig-infrastructure.md` — primary prep guide.
- `interview-prep/openai-seen-questions.md` — backup interview-loop signals.
- `job-search/openings.md` — canonical role tracker and fit notes.
- `job-search/applications/openai-senior-software-engineer-infrastructure-seattle-2026-06-30/manifest.md` — submitted application archive evidence.

# Verification command/check

Read-only consistency check used:

```bash
rg -n "Statsig|Senior Software Engineer, Infrastructure|Bellevue|Applied|Submitted|recruiter|next round|interview loop" NOW.md interview-prep/openai-recruiter-round-statsig-infrastructure.md job-search/openings.md job-search/applications/openai-senior-software-engineer-infrastructure-seattle-2026-06-30/manifest.md
```

Expected verification outcome: the role, location, submitted/applied status, Statsig framing, and recruiter-prep guidance remain consistent across `NOW.md`, the prep guide, tracker, and application archive. Manual verification is also required: rehearse answers aloud and confirm they remain honest about not having owned Statsig by name while bridging to adjacent launch/experimentation infrastructure.

# Context Evidence

Used in order:

1. `NOW.md` — read first; current focus is OpenAI recruiter prep and immediate next step is to use the Statsig infrastructure prep guide.
2. `CONTEXT.md` — read for durable facts and operating constraints; it is larger than the hydrate budget but confirms this is a career-management workspace and forbids fabrication.
3. `AGENTS.md` — read for the context contract and index guidance.
4. `node scripts/context-index.js hydrate "plan next implementation step"` from the case repo — selected cards: `ctx-now-now`, `ctx-context-operating-constraints`, `ctx-context-do-not`, `ctx-context-project-structure`.
5. Selected cards listed above — used before additional raw project files.
6. Raw project files: OpenAI recruiter prep guide, seen-questions guide, openings tracker, application manifest.
7. Read-only `rg` consistency check across the OpenAI prep/tracking files.

Save/update routing if this were a live session: update `NOW.md` after the rehearsal or recruiter call with confirmed next step, blockers, and touched files; record any next-round technical prep plan in task-local planning context; do not change durable `CONTEXT.md` unless the user teaches a lasting preference, constraint, or correction.

# Confidence and why

High. `NOW.md`, the selected hydrate cards, the dedicated OpenAI prep guide, `job-search/openings.md`, and the application manifest all point to the same active work: close out recruiter-round readiness for the Bellevue OpenAI Infrastructure/Statsig application. The main uncertainty is external, not repository-internal: the recruiter must confirm exact team focus, level calibration, and next interview format.