---
id: ctx-context-learned-patterns
kind: lesson
importance: 0.78
confidence: confirmed
source: CONTEXT.md#learned-patterns
chunk: .context-harness/chunks/ctx-context-learned-patterns.md
tokens_est: 1041
tags: [context, learned-patterns, lesson]
---

# CONTEXT.md: Learned Patterns

## Summary
When splitting context-harness into companion skills, keep the split based on invocation intent because too many maintenance-like skills make the harness harder to choose.

## Use when
- avoiding repeated mistakes or applying prior corrections
- update context with durable lessons

## Key facts
- When splitting context-harness into companion skills, keep the split based on invocation intent because too many maintenance-like skills make the harness har...
- When learning from external skill systems like Superpowers or metaprompting skills, treat them as reusable patterns to adapt through our own agent workflow,...
- When writing skill frontmatter, use quoted or block scalar descriptions if the text contains colon-space because Codex may skip skills whose YAML metadata fa...
- Plan stress-tests should ask the user only high-leverage questions where human judgment materially helps the agent; details that can be inferred from context...
- When adapting context-harness to Codex, treat hooks as the active lifecycle path for enforcing context habits; keep plugin hooks optional until pluginhooks s...

## Retrieval order
- Read `NOW.md` and concise `CONTEXT.md` as the always-read layer.
- Use this card before opening bulky `PLAN.md`, chunks, or raw source sections for this topic.
- Open raw detail only when this summary is insufficient for the task.

## Open next only if needed
- `CONTEXT.md#learned-patterns`
- `.context-harness/chunks/ctx-context-learned-patterns.md`
