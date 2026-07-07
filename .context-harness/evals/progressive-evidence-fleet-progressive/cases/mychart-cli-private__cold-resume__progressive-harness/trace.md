# Trace notes

- Read eval prompt: `prompt.md`.
- Invoked `context-catch-up` because this is a fresh-agent/cold-resume eval.
- Context read order:
  1. `repo/NOW.md` first.
  2. `repo/AGENTS.md` for context contract/index.
  3. `repo/CONTEXT.md` directly; concise enough for this eval and has schema v3 marker plus required sections.
- Hydrate command run from repo root:
  - `node scripts/context-index.js hydrate "resume current task"`
  - Selected cards: `ctx-context-context-contract`, `ctx-now-now`.
- Opened selected cards before raw task context:
  - `repo/.context-harness/cards/ctx-context-context-contract.md`
  - `repo/.context-harness/cards/ctx-now-now.md`
- Opened `repo/PLAN.md` after hydrate/cards.
- Supporting read-only inspection:
  - `repo/package.json` for scripts and verification command.
  - `repo/README.md`, `repo/PRIVACY.md`, `repo/EVALUATION.md`, `repo/FINDINGS.md` for architecture/privacy/contract context.
  - `git -C <repo> status --short -- .` reported no changes inside the case repo path.
  - Listed top-level repo files.
  - Targeted `rg` search for `public release`, `sanitized`, `history rewrite`, `patient/family`, fixtures, and related blocker terms.
- Context/harness drift:
  - No blocking drift found. `AGENTS.md`, `NOW.md`, and `CONTEXT.md` have schema v3 markers; hydrate worked.
- Save/update routing if this were an active non-eval session:
  - No repo/context edits performed due read-only eval.
  - Public-release decisions and task-local audit findings would go to `PLAN.md`.
  - Durable privacy/release constraints would stay in `CONTEXT.md`.
  - Session focus/blockers/next step would be refreshed in `NOW.md` at closeout.
