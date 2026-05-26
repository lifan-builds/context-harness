# Plan

## Findings
- Codex supports hooks through `~/.codex/config.toml` and project-level `.codex/config.toml`.
- Codex hook events include `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Notification`, and `Stop`.
- Plugin-provided hooks are supported in plugin manifests, but currently require `experimental_use_rmcp_client = true` and `experimental_plugin_hooks = true`.
- Context-harness should prefer hooks for reminders, guardrails, and closeout prompts, while keeping skills as the manual entry points.
- `AGENTS.md` should remain the automatic activation layer, but its durable-context content should be a generated high-level index into `CONTEXT.md`, not a duplicate of full context.
- Research scan for self-improving skills: strongest adjacent patterns are Reflexion-style verbal feedback, Self-Refine/GEPA-style artifact optimization, Voyager/AutoSkill-style skill libraries, Toolformer/LATM-style tool creation, and SkillOps-style lifecycle management.
- For context-harness, the practical direction is not autonomous rewriting of skills after every run; use evidence-gated improvement with telemetry/findings, eval checks, human review for `SKILL.md` changes, and lifecycle states for skill artifacts.
- SkillOpt source-code scan: its trainer uses six stages (`rollout`, `reflect`, `aggregate`, `select`, `update`, `evaluate`) and persists `history.json`, `runtime_state.json`, `best_skill.md`, per-step `candidate_skill.md`, `merged_patch.json`, `ranked_edits.json`, and edit-apply reports.
- SkillOpt represents edits as structured operations (`append`, `insert_after`, `replace`, `delete`) with `target`, `content`, `support_count`, and `source_type`; this maps well to a small context-harness proposal format instead of full-file rewrites.
- SkillOpt's validation gate is intentionally pure: accept only when candidate score beats the current score, track a separate best skill, and let the trainer handle persistence. Context-harness should borrow that separation for user-approved skill updates.
- SkillOpt protects managed regions and tracks rejected edits/failure patterns in a step buffer so the optimizer avoids repeating bad patches; context-harness can approximate this with `PLAN.md` candidate status and rejected-patch notes before adding a script.
- Token scan: the always-read surface is already small; low-risk savings came from compacting generated `AGENTS.md` index text, Codex hook nudges, and repeated prose in `context-maintain` rather than weakening behavioral rules.
