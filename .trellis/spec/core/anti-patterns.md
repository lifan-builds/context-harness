# Anti-Patterns and Drift Checks

## Framework Creep

Do not turn Context Harness into a large workflow framework, mandatory worktree system, general knowledge base, or ADR process. Its purpose is lightweight durable context that improves task solving.

Do not add a new companion skill for every action. Preserve the invocation-intent boundaries in `architecture.md`.

## Generated-State Edits

Do not hand-edit `.context-harness/index.json`, cards, chunks, or the managed `AGENTS.md` Context Index. Edit `CONTEXT.md`, `NOW.md`, or `PLAN.md`, then regenerate.

Do not duplicate large source context into `AGENTS.md`; it is an activation and navigation layer.

## Implicit Migration

Do not add migration or repair behavior to `context-init` or `context-catch-up`. Existing, legacy, partial, or customized layouts belong to explicit `context-upgrade`. Never invoke upgrades implicitly.

## Canonical Versus Installed Copies

Do not treat globally installed skills, copied project scripts, or local Trellis platform files as canonical Context Harness source. Accepted product changes begin in this repository and are deployed outward after validation.

## Portability Regressions

Do not add third-party runtime dependencies, asynchronous service assumptions, shell-specific product behavior, or machine-specific absolute defaults. The hard-coded local project-root default in `eval-agent-problem-solving.js` is evaluation tooling, not a runtime convention to copy.

Keep the CommonJS marker with installed scripts so parent ESM packages cannot change execution semantics.

## Docs and Runtime Drift

Search all readers, writers, docs, tests, evaluators, and installers before changing a schema field, constant, managed marker, file list, command, or threshold.

Known drift to avoid copying:

- `examples/cold-resume-demo.md` predates the current hydrate-before-`PLAN.md` recovery contract; use `context-catch-up/SKILL.md` and executable behavior as authoritative.
- README line-count targets are guidance; runtime thresholds in `context-index.js` are enforcement.
- `install-project.js` duplicates helpers for self-containment; other scripts should use `lib.js`.

## Weak Verification

Do not accept tautological tests. Mentally remove the implementation: if the test still passes, it does not protect the behavior.

Do not treat every AI review finding as real. Trace the actual trust boundary, read design comments, and verify variable origins before prioritizing a warning.

Do not validate retrieval changes only with synthetic fixtures. Run real-project shadow evaluation.

## Guardrail Bypasses

Do not use or normalize `--no-verify`, `--no-gpg-sign`, or `core.hooksPath` overrides. Do not weaken secret and linter-configuration protections in `guard.js` to bypass a workflow problem.
