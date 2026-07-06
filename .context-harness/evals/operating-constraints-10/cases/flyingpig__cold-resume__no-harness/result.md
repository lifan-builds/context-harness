- Current understanding
  - Flying Pig is an early local beta for supervised customer-service automation. The normal product entry point is the Electron desktop app, which starts a local Python helper, serves the dashboard as the cockpit, and controls a separate Chrome work window for the support chat.
  - The beta is currently Mac/Amex-centered and human-in-the-loop: users log in and handle MFA in the work window, then approve consequential messages, offers, sensitive verification, or irreversible actions.
  - The freshest inferred focus is the unsigned Mac beta update/release path for version 1.0.2. `package.json`, `pyproject.toml`, the API version, `scripts/build_beta_release.py`, and `.github/workflows/desktop-release.yml` all point at 1.0.2, while `docs/desktop-auto-update.md` says v1.0.2 should be the first no-pay beta update-checking baseline because v1.0.1 lacked `latest-mac.yml`.
  - `PLANS.md` appears stale: it still describes initial bootstrap and says the next step is architecture/scaffold, but README/docs/source show the project is already a desktop beta with helper, dashboard, work-window orchestration, tests, packaging, and release flow.

- Active blockers or uncertainty
  - No release evidence for v1.0.2 is present in the remaining repo files; latest evidence in `docs/beta.md` is for v1.0.1 on 2026-05-24.
  - The app remains unsigned and manual-install for now. `docs/desktop-auto-update.md` says the local machine has no valid Developer ID identity, which is acceptable for the unsigned beta path but blocks reliable in-place signed/notarized macOS updates.
  - DMG packaging is deferred because of a native-addon signing issue in the DMG license toolchain; the active macOS target is zip only.
  - A full dashboard-driven mock-agent run is still called out as blocked by the need for a deterministic browser-use LLM or configured live LLM provider plus a separate CDP work window. Existing dashboard tests are protocol/UI smoke, not a full browser-use AgentBrain run from the dashboard.
  - A supervised live Amex smoke requires a tester present with login/MFA completed and explicit confirmation before sending messages, so it cannot be treated as a fully automated gate.
  - Release artifacts must still be scanned before publishing for PII, API keys, credentials, tokens, cookies, logs, recordings, databases, and user-specific account data.

- Immediate next step
  - Treat the next concrete step as validating and publishing the v1.0.2 unsigned Mac beta/update baseline: run the standard gates, build the helper/desktop package, publish through the desktop release workflow, verify GitHub release update assets including `latest-mac.yml`, and perform the release privacy scan. After that, update release evidence/docs if source edits are allowed in a non-eval session.

- Relevant files
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/README.md` — current product shape, development commands, packaging notes, safety model.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/docs/beta.md` — beta scope, pre-beta gates, release evidence, known live/full-run blockers.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/docs/desktop-auto-update.md` — current update strategy and v1.0.2 baseline notes.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/.github/workflows/desktop-release.yml` — GitHub Actions release flow for unsigned macOS beta.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/package.json` — version 1.0.2 and desktop/helper/test scripts.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/pyproject.toml` — Python package version/dependencies/test config.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/auto_update.js` — manual GitHub-release update-check behavior for unsigned beta.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/electron-builder.json` — zip target, unsigned macOS packaging, bundled helper resources, release publish config.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/scripts/verify_desktop_update_release.mjs` — local/GitHub update-asset verifier.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/scripts/build_beta_release.py` — source beta zip builder defaulting to 1.0.2.
  - `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/src/daemon/server.py`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/src/daemon/run_session.py`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/src/agent/run_orchestration.py`, `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/dashboard/dashboard.js`, and `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/main.js` — main runtime surfaces behind the desktop/helper/dashboard flow.

- Verification command/check
  - Core pre-release gates from the repo docs/workflow:
    - `ruff check src scripts tests`
    - `pytest tests -q -m "not slow"`
    - `npm run test:dashboard`
    - `npm run test:desktop`
    - `npm run build:helper`
    - `npm run desktop:package`
    - `npm run desktop:verify-update -- --github --tag=v1.0.2`
  - Required manual/release checks: scan built artifacts for PII/secrets/local data; run a supervised Amex smoke with a prepared work window and user approvals when a tester is available.

- Confidence and why
  - Medium-high. The README, beta docs, auto-update docs, package versions, workflow, and packaging scripts agree that the current area is a desktop Mac beta and v1.0.2 update-capable unsigned release path. Confidence is not higher because `PLANS.md` and some beta evidence are stale or version-skewed, and there is no v1.0.2 release evidence in the repo files I inspected.
