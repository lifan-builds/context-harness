# Judge Prompt: agent-guild__context-maintenance__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Status check after Codex hook config fix. The repo-local Codex hook config still uses the current structured root-level hooks.EventName = [{ hooks = [{ type = "command", command...
- must mention: Run npm run start, open http://127.0.0.1:4173, then start a fresh trusted Codex session in /Users/lfan/Project/agent-guild and confirm the dashboard receives real lifecycle hook...
- must mention: Status check after Codex hook config fix. The repo-local Codex hook config still uses the current structured root-level hooks.EventName =...
- must mention: NOW.md
- must mention: PLAN.md
- must mention: CONTEXT.md
- must mention: context-index.js update
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-operating-constraints
