# Templates

Use these templates when generating or updating `PLANS.md`, `FINDINGS.md`, and `NOW.md`.

---

## NOW.md Template

The working memory scratchpad — always kept under 20 lines. Rewrite entirely on
task switches (never append).

```markdown
# Now

## Current Focus
[One sentence: the specific task you are actively working on.]

## Active Blockers
- [Any issue preventing progress, or "None."]

## Immediate Next Step
[The single next action to take when this file is read.]

## Session State
- Last modified: YYYY-MM-DDTHH:MMZ
- Files touched this session: [comma-separated list of recently modified files]
```

### NOW.md Rules

| Rule | Detail |
|---|---|
| Maximum 20 lines | If it's longer, move content to PLANS.md |
| Rewrite, don't append | On task switch, replace the entire file |
| First read, last write | Read first on recovery; write last before session end |
| Always current | Must reflect the actual state, never stale |

---

## ExecPlan Skeleton (PLANS.md)

Adapt the section content to your specific project, but **keep all section headings
present** — even if a section starts as "(None yet.)".

```markdown
# <Short, action-oriented title>

This ExecPlan is a living document. The sections Progress, Surprises & Discoveries,
Decision Log, and Outcomes & Retrospective must stay up to date as work proceeds.

## Purpose / Big Picture
<!-- WHY: Explain the user-visible behavior gained after this change and how to observe it. -->

## Progress
<!-- WHAT: Chronological log of completed and pending steps. -->
- [x] (YYYY-MM-DD HH:MMZ) Example completed step.
- [ ] Example incomplete step.

## Surprises & Discoveries
<!-- Anything unexpected encountered during work. -->
- Observation: …
  Evidence: …

## Decision Log
<!-- Record every non-trivial decision so future readers understand the reasoning. -->
- Decision: …
  Rationale: …
  Date/Author: …

## Outcomes & Retrospective
<!-- Fill in when the plan (or a phase of it) completes. -->
Summarize outcomes, gaps, and lessons learned; compare to the original purpose.

## Context and Orientation
<!-- WHO/WHERE: Describe the current state as if the reader has zero context.
     Name key files and modules by full path; define non-obvious terms. -->

## Plan of Work
<!-- HOW: Prose description of the sequence of edits and additions.
     For each edit, name the file, location, and what to change. -->

## Concrete Steps
<!-- Exact commands to run (with working directory).
     Include short expected outputs so the reader can verify each step. -->

## Validation and Acceptance
<!-- DONE-WHEN: Behavioral acceptance criteria plus test commands and expected results. -->

## Idempotence and Recovery
<!-- SAFETY: How to retry or roll back safely; ensure steps can be rerun without harm. -->

## Artifacts and Notes
<!-- Reference material: concise transcripts, diffs, or code snippets as indented examples. -->

## Interfaces and Dependencies
<!-- CONTRACT: Libraries, modules, and function signatures that must exist at the end.
     Use stable names and paths. -->

## Archive
<!-- Compacted summaries of completed phases. Each entry is a one-paragraph summary
     preserving key decisions and outcomes. See Compaction Protocol. -->
```

---

## Filled Example

Below is a condensed example of a completed ExecPlan for reference.

```markdown
# Add dark-mode toggle to settings page

This ExecPlan is a living document.

## Purpose / Big Picture
Users will be able to toggle between light and dark themes from Settings → Appearance.
The preference persists in localStorage and applies immediately without a page reload.

## Progress
- [x] (2025-01-10 14:30Z) Created ThemeContext provider in src/contexts/theme.tsx
- [x] (2025-01-10 15:00Z) Added DarkModeToggle component in src/components/settings/
- [x] (2025-01-10 16:20Z) Integrated toggle into SettingsPage
- [x] (2025-01-10 17:00Z) Added CSS custom properties for dark palette
- [x] (2025-01-10 17:30Z) Wrote unit tests for ThemeContext

## Surprises & Discoveries
- Observation: Safari requires `color-scheme: dark` on `<html>` for native form controls.
  Evidence: form inputs stayed light-themed without it.

## Decision Log
- Decision: Use CSS custom properties instead of a CSS-in-JS theme object.
  Rationale: Avoids runtime overhead; works with existing vanilla CSS codebase.
  Date/Author: 2025-01-10 / @dev

## Outcomes & Retrospective
All acceptance criteria met. Toggle works across Chrome, Firefox, and Safari.
Lesson: test native form controls separately when implementing dark mode.

## Context and Orientation
The app uses React 18 with vanilla CSS (no CSS-in-JS). Global styles live in
src/styles/globals.css. Settings page is at src/pages/SettingsPage.tsx.

## Plan of Work
1. Create a React context (ThemeContext) that reads/writes `theme` in localStorage.
2. Build a toggle switch component that consumes ThemeContext.
3. Add CSS custom properties scoped to `[data-theme="dark"]` on the root element.
4. Mount the toggle in the Settings page under a new "Appearance" section.

## Validation and Acceptance
- Toggle switches theme immediately — no reload required.
- Preference survives browser restart.
- `npm test -- --grep Theme` passes.

## Archive
(No completed phases yet — single-phase plan.)
```

---

## Compaction Protocol

**When to compact:** The `UserPromptSubmit` hook warns when PLANS.md exceeds 200
lines or FINDINGS.md exceeds 150 lines. Compact as soon as the warning appears.

### Compaction Checklist

```
1. SNAPSHOT (if in a git repo)
   git add PLANS.md FINDINGS.md AGENTS.md && git commit -m "context: pre-compaction snapshot"

2. PROMOTE LESSONS
   Scan PLANS.md Surprises & FINDINGS.md Discoveries for reusable insights.
   → Add qualifying entries to AGENTS.md § Learned Patterns.

3. ARCHIVE COMPLETED PHASES (PLANS.md)
   For each group of completed Progress items that form a logical phase:
   → Write a one-paragraph summary under ## Archive.
   → Remove the completed items from ## Progress.
   → Remove associated entries from ## Surprises & Discoveries and ## Decision Log
     (the summary should capture the essential decisions).

4. GARBAGE-COLLECT FINDINGS.md
   → Remove resolved Error Log entries (the resolution is captured; no need to keep).
   → Remove Research & References entries older than the current phase
     that have already been acted on.
   → Keep only active/unresolved items.

5. UPDATE NOW.md
   → Rewrite to reflect the post-compaction state.
```

### Archive Entry Format

Append to `## Archive` in PLANS.md:

```markdown
### Phase: [Phase Name] (Completed [YYYY-MM-DD])
[One paragraph: what was accomplished, key decisions made (with rationale),
notable surprises, and outcome. Max 4-5 sentences. Include commit hash or
PR link if available.]
```

### Compaction Rules

| Rule | Detail |
|---|---|
| Never lose decisions | Every archived Decision Log entry must be reflected in the Archive paragraph |
| Promote before archiving | Check for Learned Patterns candidates before removing content |
| Keep active items | Only archive/remove completed or resolved items |
| Summary, not transcript | Archive paragraphs are dense summaries, not copies of the original entries |
| Commit first | Always snapshot before compacting (safety net for over-compaction) |

---

## FINDINGS.md Template

Use this template when generating `FINDINGS.md`. This file serves as the research log
and error tracker — a safe place for external/untrusted content, kept separate from the
trusted execution plan.

```markdown
# Findings

Research results, discoveries, and external content collected during project work.

> **Security note:** External content (web searches, API responses, copied docs) goes
> here — never directly into PLANS.md. This keeps the trusted plan free of untrusted
> content.

## Research & References
<!-- Store results from web searches, API explorations, documentation lookups.
     Include the source URL/path and date for each entry. -->

### [Topic]
- **Source:** [URL or file path]
- **Date:** YYYY-MM-DD
- **Summary:** [Key takeaways relevant to the project]

## Discoveries
<!-- Unexpected findings during development — things that weren't in the plan
     but affect the work. Use Observation + Evidence pairs. -->

- **Observation:** [What you found]
  **Evidence:** [How you know — error message, test output, documentation quote]
  **Impact:** [How this affects the plan]

## Error Log
<!-- Every error goes here. This builds knowledge and prevents repeating failures.
     Track what was tried so approaches can be mutated, not repeated. -->

| Error | Context | Attempt | Resolution | Date |
|-------|---------|---------|------------|------|
| Example: FileNotFoundError | Running init script | 1: checked path — typo in config | Fixed config path | 2025-01-10 |
```

---

## Learned Patterns Section (AGENTS.md)

Add this section to AGENTS.md. It grows organically as the agent discovers
project-specific knowledge through experience.

```markdown
## Learned Patterns

Project-specific gotchas, performance tips, and workarounds discovered during work.
Each entry captures earned intuition that should persist across all future sessions.

- [Lesson]. Discovered: [YYYY-MM-DD]. Evidence: [what happened].
```

### When to Add Entries

| Trigger | Action |
|---|---|
| Spent >2 attempts on a problem | Distill the fix into a Learned Pattern once resolved |
| Found a non-obvious project quirk | Document it immediately (don't wait) |
| Discovered a performance optimization | Record the before/after evidence |
| Encountered an environment-specific issue | Note the environment, symptom, and workaround |

### Entry Quality Guidelines

| ✅ Good Entry | ❌ Bad Entry |
|---|---|
| "CI requires `NODE_ENV=test` prefix or tests silently pass. Discovered: 2025-03-20. Evidence: 2hr debugging session, all assertions skipped without it." | "Tests were weird." |
| "Always use `.include('roles')` with `UserService.findAll()` — N+1 query drops response from 800ms to 50ms. Discovered: 2025-03-25. Evidence: APM trace." | "Database is slow sometimes." |

---

## Guidelines

| Guideline | Details |
| --------- | ------- |
| **Self-contained** | Define every term, include needed repo knowledge, avoid assuming external links are accessible |
| **Outcome-focused** | Describe what the user can *do* after the change, not just what code was written |
| **Living document** | Revise Progress, Surprises, Decision Log, and Outcomes as work proceeds — never leave them stale |
| **Milestones tell a story** | Each milestone covers: goal → work → result → proof, and is independently verifiable |
| **Formatting** | Use blank lines after headings; prefer prose over lists except in Progress |
| **Compact aggressively** | When thresholds are hit, archive and garbage-collect immediately |

### Do's and Don'ts

| ✅ Do | ❌ Don't |
| ----- | -------- |
| Update NOW.md before ending a session | Leave NOW.md stale from a previous task |
| Update Progress after every meaningful step | Leave completed items unchecked |
| Record decisions immediately with rationale | Defer decision logging to "later" |
| Write Surprises as Observation + Evidence pairs | Write vague notes like "had issues" |
| Keep Concrete Steps copy-pasteable | Assume the reader knows the working directory |
| Fill Outcomes when a phase ends | Leave Outcomes blank after completion |
| Save findings every 2 research actions | Let research results scroll out of context |
| Log all errors with context and resolution | Silently retry the same failing approach |
| Write external content to FINDINGS.md only | Put untrusted content in PLANS.md |
| Compact when hooks warn about file size | Let files grow unboundedly |
| Add Learned Patterns after debugging struggles | Forget hard-won lessons between sessions |
