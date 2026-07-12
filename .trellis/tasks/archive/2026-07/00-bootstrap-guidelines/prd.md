# Bootstrap Context Harness Engineering Specs

## Goal

Replace Trellis's generated full-stack placeholders with source-backed guidance for the actual Context Harness repository.

## Scope

- Analyze root and companion skills, Node/CommonJS scripts, lifecycle hooks, generated context state, and evaluation tooling.
- Preserve existing Context Harness source contracts; do not modify product behavior.
- Remove irrelevant frontend, database, service, and state-management templates.

## Architecture Context

Context Harness is a documentation-led portable agent-context package. Model-facing skills own semantic judgment; synchronous Node scripts own deterministic filesystem mechanics; Markdown files are durable source state; `.context-harness/` contains generated retrieval artifacts; evaluation scripts are separate from the installed runtime.

## Final Spec Files

- `.trellis/spec/core/index.md`
- `.trellis/spec/core/architecture.md`
- `.trellis/spec/core/context-contracts.md`
- `.trellis/spec/core/scripts-and-hooks.md`
- `.trellis/spec/core/testing.md`
- `.trellis/spec/core/anti-patterns.md`

## Completion Status

- [x] Document real package and workflow boundaries
- [x] Document Markdown, manifest, hydration, and ownership contracts
- [x] Document Node script, hook, error, and installation conventions
- [x] Document black-box testing and real-project evaluation practices
- [x] Include concrete source paths, examples, and anti-patterns
- [x] Remove irrelevant generated frontend/backend templates
- [x] Verify indexes and remove placeholder content

## Acceptance Criteria

- [x] Specs describe the repository as it exists now.
- [x] Important rules are backed by product source, tests, or existing context documents.
- [x] No placeholder sections or copied generic application guidance remain.
- [x] The root index matches the final spec file set.
