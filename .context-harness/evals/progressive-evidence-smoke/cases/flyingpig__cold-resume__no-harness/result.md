# Current understanding

Flying Pig is an early supervised Mac desktop beta for customer-service chat automation, currently centered on American Express. The intended product path is one native Electron app: it starts/supervises a local Python helper sidecar, loads the helper-served dashboard as the cockpit, and opens a separate controlled Chrome work window where the user logs in, handles MFA, prepares the chat, and watches the agent work. The agent uses browser-use plus site adapters, model/provider configuration, structured user-attention events, decision checkpoints, evidence capture, and reconnectable helper state. Legacy helper/CLI/API paths remain for development/debugging only, not as user-facing beta paths.

The current focus appears to be hardening and releasing the desktop-first public Mac beta, including the unsigned/no-pay update-checking path for version 1.0.2, release asset verification, privacy scanning, and first-cohort supervised Amex validation.

# Active blockers or uncertainty

- The beta remains unsigned on macOS. Reliable in-place auto-update is blocked until a paid Apple Developer ID signing/notarization setup exists; current behavior only checks GitHub Releases and opens the release page for manual replacement.
- The latest docs call out that the supervised live Amex smoke requires a tester/user present with Amex login/MFA completed and explicit approval before any consequential send. This is the main validation blocker for live beta confidence.
- A full dashboard-driven mock AgentBrain/browser-use run is not part of the normal dashboard smoke because it needs a deterministic LLM or configured live provider plus a separate CDP work window; existing dashboard tests are protocol/UI smoke coverage.
- Release artifacts must continue to be scanned for PII, API keys, credentials, tokens, cookies, logs, recordings, databases, and user-specific account data before publishing.

# Immediate next step

Run the v1.0.2 desktop beta release gate from the isolated repo, then perform the manual supervised Amex smoke with a prepared tester session. Start with the automated gates:

```bash
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo" && ruff check src scripts tests && pytest tests -q -m "not slow" && npm run test:dashboard && npm run test:desktop
```

If publishing the update-checking beta, continue with `npm run build:helper`, `npm run desktop:publish`, and `npm run desktop:verify-update -- --github --tag=v1.0.2`, followed by the release privacy scan and a supervised Amex smoke.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/README.md` — product status, desktop app flow, install/run/test commands, safety model.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/docs/adr/0005-desktop-first-product-path.md` — accepted decision that Electron desktop is the only normal product path.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/docs/beta.md` — beta scope, pre-beta gates, release evidence, known live-smoke and mock-run limitations.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/docs/desktop-auto-update.md` — current unsigned beta update path, v1.0.2 baseline note, signing/notarization blocker.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/docs/public-beta-quickstart.md` — user-facing first-run flow and safety boundaries.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/package.json` — desktop scripts and current version `1.0.2`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/pyproject.toml` — Python package metadata, dependencies, ruff/pytest configuration, console scripts.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/.github/workflows/desktop-release.yml` — release workflow gates and publish/verify sequence.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/desktop/electron-builder.json` — unsigned zip packaging and helper resource filters.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/src/agent/brain.py` — browser-use AgentBrain orchestration.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/src/daemon/run_session.py` — reconnectable run state and structured user-attention/checkpoint event protocol.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/dashboard/` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/desktop/` — active dashboard and Electron shell surfaces.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/tests/` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo/scripts/test_dashboard_protocol.mjs` / `scripts/test_helper_dashboard.mjs` / `scripts/test_desktop_shell.mjs` — automated verification surfaces.

# Verification command/check

Primary local beta gate:

```bash
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo" && ruff check src scripts tests && pytest tests -q -m "not slow" && npm run test:dashboard && npm run test:desktop
```

Release/update path checks:

```bash
cd "/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__cold-resume__no-harness/repo" && npm run build:helper && npm run desktop:publish && npm run desktop:verify-update -- --github --tag=v1.0.2
```

Manual product check: open the desktop app, click **Open Work Window**, prepare Amex chat in the controlled work window, confirm model/work-window/chat/task readiness, start a supervised run, approve any checkpoint before sending, and verify the final result includes outcome, transcript/evidence path, failure stage if any, and human-escalation status.

# Context Evidence

- `README.md` says the app is an early local beta, the normal product entry is `npm run desktop:dev`, and the desktop app starts the helper, waits for `/health`, and loads the dashboard; it also lists `ruff check src scripts tests`, `pytest tests -q -m "not slow"`, `npm run test:dashboard`, and `npm run test:desktop` as development commands.
- `docs/adr/0005-desktop-first-product-path.md` accepts the Electron desktop app as the only normal user-facing product path and relegates helper/CLI/API usage to development/debugging.
- `docs/beta.md` defines beta scope as Amex, supervised-only, native desktop shell plus helper-served dashboard and separate work window. Its pre-beta gates include lint, non-slow tests, dashboard/desktop tests, release bundle, privacy scan, supervised Amex smoke, cancel behavior, helper-offline UX, work-window connection, model setup, and stale CDP cleanup.
- `docs/beta.md` release evidence shows recent automated gates passed for v1.0.1-era work, but the manual supervised Amex smoke was not completed because it requires a first-cohort tester with login/MFA and explicit send confirmation.
- `docs/desktop-auto-update.md` says the current no-paid-Apple-account beta update path checks GitHub Releases and opens the release page, not in-place auto-update; it names v1.0.2 as the first no-pay beta update-checking baseline and notes no valid local Developer ID identity.
- `package.json` and `pyproject.toml` both show version `1.0.2`, with Electron packaging/test scripts and Python browser-use/helper dependencies.
- `.github/workflows/desktop-release.yml` installs Node/Python dependencies, runs `ruff`, `pytest`, and `npm run test:desktop`, builds the helper, publishes desktop artifacts, and verifies GitHub update assets.
- `src/daemon/run_session.py` exposes explicit statuses such as `WAITING_ON_LOGIN`, `WAITING_ON_AUTH`, `CHECKPOINT_PENDING`, `COMPLETED`, `FAILED`, and event types for decision checkpoints, OTP/auth/login, irreversible actions, offers, recovery, and result-ready.
- `src/agent/brain.py` constructs `AgentBrain` with browser-use `Agent`, site adapters, chatbot detector, escalation manager, LLM runtime, MCP/browser execution, user input tools, and evidence recording.

# Confidence and why

Confidence: medium-high. The README, ADRs, beta docs, package manifests, workflow, and selected source files consistently point to the same desktop-first supervised beta focus and the same verification gates. The main uncertainty is that this repo copy has no usable git history/context-harness state by design, and some planning docs are stale bootstrap artifacts, so I weighted current README/beta/ADR/update docs over the older `PLANS.md` scaffold notes.