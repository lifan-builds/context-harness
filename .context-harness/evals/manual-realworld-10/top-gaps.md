# Top Context-Harness Design Gaps from 10 Real-World Evaluations

Run: `.context-harness/evals/manual-realworld-10`  
Scope: 5 real repos × 2 scenarios, paired `no-harness` vs `progressive-harness` = 10 evaluations / 20 fresh-agent runs.

## Quantitative result

- Average no-harness score: 6.6/10
- Average progressive-harness score: 8.2/10
- Average lift: +1.6
- Progressive improved 8/10 pairs, tied 1/10, regressed 1/10.
- Largest improvements:
  - `context-harness / next-step`: +5
  - `credit-card-tracker / cold-resume`: +3
  - `flight-plan / cold-resume`: +3
  - `flyingpig / next-step`: +3
- Regression:
  - `flight-plan / next-step`: -4

## Top 5 gaps

### 1. Version skew between the new progressive contract and installed project scripts

**Evidence:** Most progressive runs attempted `node scripts/context-index.js hydrate ...`, but many real repos still had older `scripts/context-index.js` supporting only `update|list|query|section|check`. Agents either had to recover with fallback commands or, in `flight-plan / next-step`, over-prioritized fixing the harness/tooling drift and missed the intended product next step.

**Why this matters:** The progressive design assumes the harness runtime and instructions evolve together across all projects. In the real fleet, they do not. A fresh agent can be told to use a command that does not exist.

**Likely fix:** Add capability/version discovery and compatibility guidance. `AGENTS.md` or the eval prompt should not blindly require `hydrate` unless the local script supports it. `context-index.js check` should report unsupported generated-contract commands clearly, and upgrade/deploy workflows should surface script/contract skew as a fleet migration gap.

### 2. Progressive context can make agents chase harness health instead of the user task

**Evidence:** `flight-plan / next-step / progressive-harness` scored 3/10 while no-harness scored 7/10. The progressive agent found stale index/hydrate-command problems and made “close out context-harness migration first” the immediate next step, whereas the no-harness agent identified the project’s real product next step: cpp/caching evaluation for active flight searches.

**Why this matters:** Context-harness is meant to improve task solving, not become the task. When harness health warnings are visible, agents need a priority rule for when to fix harness drift vs proceed with the actual project work.

**Likely fix:** Add explicit guidance: if harness tooling is stale or a progressive command is missing, record it as a context/tooling follow-up, use available fallback context paths, and continue solving the user’s requested task unless the drift blocks correctness or safety.

### 3. Current eval scoring is too lexical and creates false failures

**Evidence:** The frequent missing item `### Never` appeared in 9 cases. That is a markdown heading extracted from `CONTEXT.md#Rules`, not a semantic fact agents should literally mention. The `mustAvoid` checks also flagged some answers for `.context-harness/DREAM.md is instructions` even when they merely mentioned Dream/Compact workflow context or the word “instructions,” not that DREAM.md should be used as operational instructions.

**Why this matters:** The eval loop is now useful, but its deterministic score is only a triage signal. Overly literal expected facts can hide real design gaps or misclassify successful answers as failures.

**Likely fix:** Improve expected-fact generation and scoring:
- extract actual rule bullets, not headings;
- make `mustAvoid` exact phrase / semantic-negative checks instead of bag-of-words;
- add a lightweight judge rubric pass for qualitative state accuracy and actionability.

### 4. Workflow/setup verification facts are present but not salient enough

**Evidence:** `Setup: npm install` was missed in 4 cases and `Test: project-specific.` was missed in 4 cases. Progressive mode often got the task state right but still omitted setup/test details from `CONTEXT.md#Workflow`.

**Why this matters:** Verification commands are a core part of real-world problem solving. The current cards/context make workflow discoverable, but agents do not consistently promote setup/test commands into the answer.

**Likely fix:** Make workflow cards more action-oriented for planning/resume queries. The hydrate output or AGENTS contract should nudge agents to always include `CONTEXT.md#Workflow` setup/test/verification when the requested output asks for verification.

### 5. Context quality varies: active state can compete with stale or lower-level project docs

**Evidence:** No-harness agents frequently latched onto older source/docs plans, e.g. `credit-card-tracker` tracker-focus/domain-migration docs or `flyingpig` release-closeout material, while progressive agents usually found the active `NOW.md`/`PLAN.md` state. However, even progressive mode missed some long, truncated active facts in `credit-card-tracker` and `flyingpig`, and had to reconcile multiple project-state documents.

**Why this matters:** Context-harness improves selection, but it still depends on context freshness and clear priority ordering among `NOW.md`, `PLAN.md`, `CONTEXT.md`, and project-specific planning docs.

**Likely fix:** Strengthen the priority model: `NOW.md` active focus overrides older project docs; `PLAN.md` active sections override archives; generated cards should distinguish active vs historical sections. For projects with many local planning docs, context-maintain should compact or explicitly mark stale plans.

## Follow-up focus chosen

The next implementation focused on gaps 2 and 3, per user priority. Gap 4 was intentionally not prioritized. For gap 5, the direction is to clean, mark, or archive existing project docs when they are suitable natural homes for stale competing state. For gap 1, compatibility is less important than a one-time fleet migration after this work lands.

Implemented follow-up changes:

- Progressive eval prompts now say stale/broken harness files or commands should be mentioned as follow-ups unless they block the read-only task, and should not replace the requested project understanding/planning task.
- `AGENTS.md`, the AGENTS template, and `context-catch-up` now include the same priority rule for non-blocking harness drift.
- Eval expected facts now extract content lines from rules instead of headings like `### Never`.
- `mustAvoid` scoring now requires exact normalized phrase matches, avoiding DREAM/Compact bag-of-words false positives.
- `context-maintain` Dream/Compact guidance now explicitly allows cleaning, marking, or archiving existing project docs when they compete with active context and the right home is obvious.

## Overall conclusion

The eval supports the direction: progressive-harness improved real-world task understanding, but the highest-value improvements are around agent behavior and eval quality rather than retrieval ranking. Context-harness should remain subordinate to the user's project task, and the eval loop should measure semantic task quality rather than markdown-token coincidence.
