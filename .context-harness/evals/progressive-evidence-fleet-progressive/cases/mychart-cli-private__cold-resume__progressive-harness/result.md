# Current understanding

The active focus is a public-release audit for `mychart-cli`, a local-first Node/Puppeteer CLI that extracts patient-owned MyChart records into a gitignored `.awesome-mychart/store.json` and exports filtered JSONL/Markdown for local agent workflows such as Baby. The project has already moved away from the old Chrome extension path; it is now an agent-facing CLI, with no built-in Ask AI or LLM provider behavior.

# Active blockers or uncertainty

- Do not make the existing GitHub repo public as-is.
- Current fixtures contain patient/family-like names.
- Historical commits contain patient/family identifiers and live-run medical-context notes.
- No committed `.env`, browser profile, `.awesome-mychart/store.json`, or obvious API-token assignment was reported in the current audit notes, but patient-data indicators remain in current fixtures and history.
- Release-path uncertainty remains: choose either a sanitized no-history public snapshot or a full history rewrite with verification before changing GitHub visibility.
- Live MyChart validation can still be blocked by MFA/CAPTCHA/manual verification; credentials, browser profiles, `.awesome-mychart/`, Baby `mychart-imports/`, and raw exports must stay local and gitignored.

# Immediate next step

Choose the public-release path:

1. Preferred/safest: create a sanitized current snapshot with fresh history, excluding or replacing unsafe fixtures and local medical-context evidence.
2. Alternative: perform a full history rewrite, then verify both current tree and all rewritten history before changing `lifan-builds/mychart-cli` visibility.

Do not start by flipping GitHub visibility.

# Relevant files

- `NOW.md` — current public-release audit focus, blockers, and next step.
- `PLAN.md` — confirms remaining public-release blocker and current CLI direction.
- `CONTEXT.md` — durable constraints: keep sensitive paths local, no public release from existing history, no built-in Ask AI/LLM provider path.
- `AGENTS.md` — context-harness contract and index.
- `package.json` — scripts: `npm run mychart`, `npm test`, live harness commands.
- `README.md` — local-first CLI usage, live harness, export workflow.
- `PRIVACY.md` — privacy promises and gitignored sensitive storage locations.
- `EVALUATION.md` — regression, privacy/safety, live harness, and Baby compatibility contracts.
- `src/cli.mjs`, `src/browser/`, `src/extraction/`, `src/core/`, `src/storage/` — current CLI/runtime/extraction/storage implementation areas.
- `scripts/mychart-cli-lib.mjs` — stable Baby/downstream compatibility facade.
- `tests/*.test.mjs` — node:test regression suite.

# Verification command/check

Functional regression check:

```bash
node --test tests/*.test.mjs
```

Before any public release, also run a privacy/public-safety check over both the sanitized current tree and whatever history will be published; the current context says existing history is not safe to publish.

# Context Evidence

- Read `prompt.md` in the eval case.
- Used `context-catch-up` for a fresh-session boundary.
- Read `repo/NOW.md` first.
- Read `repo/AGENTS.md` and concise `repo/CONTEXT.md`; both carry `<!-- context-harness:schema v3 -->` and the expected context contract/index sections.
- Ran from `repo/`: `node scripts/context-index.js hydrate "resume current task"`.
  - Hydrate selected cards: `ctx-context-context-contract`, `ctx-now-now`.
- Opened selected cards before raw task context:
  - `.context-harness/cards/ctx-context-context-contract.md`
  - `.context-harness/cards/ctx-now-now.md`
- Read `repo/PLAN.md` after hydrate/cards.
- Read supporting docs/metadata: `package.json`, `README.md`, `PRIVACY.md`, `EVALUATION.md`, `FINDINGS.md`.
- Ran read-only inspection commands:
  - `git -C <repo> status --short -- .` — no case repo path changes reported.
  - file listing for top-level repo files.
  - targeted `rg` search for public-release and privacy blocker terms.

# Confidence and why

High. `NOW.md`, `PLAN.md`, and `CONTEXT.md` agree on the same active focus, blocker, and next action; hydrate returned the matching resume card; supporting docs confirm the local-first architecture, privacy constraints, scripts, and verification contract. The only remaining uncertainty is the product/release decision between sanitized fresh-history snapshot and verified history rewrite.