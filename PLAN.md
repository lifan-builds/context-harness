# Plan

## Findings
- Codex supports hooks through `~/.codex/config.toml` and project-level `.codex/config.toml`.
- Codex hook events include `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Notification`, and `Stop`.
- Plugin-provided hooks are supported in plugin manifests, but currently require `experimental_use_rmcp_client = true` and `experimental_plugin_hooks = true`.
- Context-harness should prefer hooks for reminders, guardrails, and closeout prompts, while keeping skills as the manual entry points.
- `AGENTS.md` should remain the automatic activation layer, but its durable-context content should be a generated high-level index into `CONTEXT.md`, not a duplicate of full context.
