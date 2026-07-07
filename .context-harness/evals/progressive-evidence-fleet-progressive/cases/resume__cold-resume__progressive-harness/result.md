# Current understanding

The project is Lifan Chen's career-management workspace: resumes, experience source of truth, interview prep, and job-search tracking. The active focus is OpenAI recruiter-screen preparation for the applied **Senior Software Engineer, Infrastructure** role in **Bellevue, WA**, likely around **Statsig infrastructure**: experimentation, rollout safety, analytics ingestion, observability, dynamic config / launch-path infrastructure, and model/product measurement workflows.

The current prep should center on `interview-prep/openai-recruiter-round-statsig-infrastructure.md`, especially the 30-second pitch, Why OpenAI, Why this Statsig infrastructure role, and three stories:
- Google Maps launch-readiness infrastructure.
- Maps Happiness Indicator / product metrics and 200+ experiment reviews.
- AWS Anomaly Detection production service.

# Active blockers or uncertainty

- No blocker for recruiter-round prep.
- Source screenshot extraction was incomplete: screenshots covered pages 2/13 through 12/13; pages 1/13 and 13/13 were missing.
- Role framing uncertainty to preserve: this should **not** be treated as primarily an LLM eval role; lead with experimentation, rollout infrastructure, analytics, observability, and launch gates.
- Candidate gap to be ready to address: Lifan has not owned Statsig by name, but has adjacent launch-measurement, experiment-review, metric, and quality-gating experience.
- Non-blocking context note: the hydrated `ctx-now-now` card appeared to render the screenshot path without the underscore (`oaiimages`), while `NOW.md` has `/Users/lfan/Desktop/oai_images`; use `NOW.md` as source of truth if this path matters.

# Immediate next step

Rehearse the recruiter screen from `interview-prep/openai-recruiter-round-statsig-infrastructure.md`:
1. Memorize the short positioning: “I build launch-critical product infrastructure: experimentation metrics, evaluation pipelines, rollout gates, quality signals, and safe launch systems at Google scale.”
2. Practice the 2-minute opening script and shorter interrupted version.
3. Prepare crisp answers for Why OpenAI, Why Statsig infrastructure, level/location, compensation deflection, and the Statsig-experience gap.
4. Prioritize recruiter questions that clarify whether the role is experimentation, dynamic config, analytics infra, observability, or launch tooling.

# Relevant files

Project root used: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/resume__cold-resume__progressive-harness/repo`

- `NOW.md` — current focus, blockers, next step, recently touched files.
- `CONTEXT.md` — durable project facts, constraints, job-search lens, workflow, imported agent notes.
- `AGENTS.md` — context contract and generated context index.
- `PLANS.md` — broader career relaunch plan and validation expectations.
- `interview-prep/openai-recruiter-round-statsig-infrastructure.md` — primary recruiter-screen guide.
- `interview-prep/openai-seen-questions.md` — extracted OpenAI recruiter / technical / system-design question signals.
- `interview-prep/README.md` — interview-prep file index.
- `job-search/openings.md` — canonical tracker; OpenAI Infrastructure entry has status Applied, Bellevue location, key requirements, tailoring notes, and application archive pointer.
- `job-search/applications/openai-senior-software-engineer-infrastructure-seattle-2026-06-30/manifest.md` — submitted application archive and source draft.

# Verification command/check

Read-only check run from repo root:

```bash
test -f interview-prep/openai-recruiter-round-statsig-infrastructure.md \
  && test -f interview-prep/openai-seen-questions.md \
  && test -f job-search/applications/openai-senior-software-engineer-infrastructure-seattle-2026-06-30/manifest.md \
  && grep -n "Statsig experimentation and rollout infrastructure\|Submitted At\|10-minute pre-call checklist" \
    job-search/openings.md \
    job-search/applications/openai-senior-software-engineer-infrastructure-seattle-2026-06-30/manifest.md \
    interview-prep/openai-recruiter-round-statsig-infrastructure.md
```

Observed evidence:
- `job-search/openings.md:39` confirms Statsig experimentation / rollout / analytics / observability / model-product measurement requirements.
- `job-search/applications/openai-senior-software-engineer-infrastructure-seattle-2026-06-30/manifest.md:10` confirms submitted date 2026-06-30.
- `interview-prep/openai-recruiter-round-statsig-infrastructure.md:337` confirms the 10-minute pre-call checklist exists.

# Context Evidence

Used in order:
1. `prompt.md` from the eval case.
2. `NOW.md` directly, first, as required.
3. `CONTEXT.md` directly because it is concise enough for the always-read layer.
4. `AGENTS.md` for the Context Contract and generated Context Index.
5. `node scripts/context-index.js hydrate "resume current task"`.
   - Selected cards: `ctx-context-key-conventions`, `ctx-context-agent-workflows`, `ctx-context-project`, `ctx-context-project-structure`, `ctx-now-now`, `ctx-context-operating-constraints`, `ctx-context-durable-facts`.
6. Opened selected cards before bulky context: `ctx-now-now`, `ctx-context-operating-constraints`, `ctx-context-key-conventions`, `ctx-context-agent-workflows`, `ctx-context-project-structure`.
7. Opened `PLANS.md` after hydrate.
8. Opened task-relevant prep and evidence files: recruiter guide, seen questions, interview-prep README, openings tracker excerpt, application manifest.
9. Ran the read-only verification command above.

No raw chunks were opened; selected cards plus concise `CONTEXT.md` were sufficient. No repository source files were modified. If this were an active session rather than a read-only eval, routing would be: keep task-local interview-prep findings in the relevant `interview-prep/` guide or `PLANS.md`, preserve durable constraints in `CONTEXT.md`, and update `NOW.md` at closeout.

# Confidence and why

High. The current focus, blockers, next step, and relevant files are explicitly stated in `NOW.md` and corroborated by the recruiter guide, openings tracker, and application manifest. Hydrate worked and selected the expected cards. The only minor uncertainty is the non-blocking generated-card path discrepancy noted above.