## Current understanding

The repository state points to a recently completed desktop beta/update-path task for Flying Pig. The current product is a supervised Mac desktop app: Electron starts a local Python helper, waits for `/health`, loads the helper-served dashboard as the cockpit, and keeps a separate controlled Chrome work window for customer-service chat work. The release/update path is an unsigned no-pay macOS beta: packaged builds check GitHub Releases, tell users when a newer version exists, and open the release page for manual replacement rather than doing in-place auto-update.

Context files are intentionally absent in this eval (`AGENTS.md`, `CONTEXT.md`, `NOW.md`, `PLAN.md`, `.context-harness`), so the maintenance action should be to create/update those context files from repo evidence, not to rely on prior harness state. The repo also has an older `PLANS.md` whose bootstrap status is stale relative to the README, desktop docs, and release docs.

Recommended context updates:

- `CONTEXT.md`: record the durable architecture and operating model: Flying Pig is a supervised desktop beta; Electron is the normal product entry point; Python helper owns browser-use, CDP, LLM calls, run state, dashboard static hosting, and evidence; the dashboard is the single cockpit; the work window is separate and user-prepared; user approval is required for consequential actions; release artifacts must exclude PII, API keys, credentials, tokens, cookies, logs, recordings, databases, and user-specific account data.
- `NOW.md`: record the immediate current state: version is `1.0.2`; unsigned beta update-checking baseline should be `v1.0.2`; GitHub Releases manual-download update path exists; development runs skip update checks; packaged builds check releases; remaining live-release gates are release privacy scan, published asset verification for the chosen tag, and a supervised Amex smoke with a present tester.
- `PLAN.md`: replace the stale bootstrap plan with active next work: publish/verify the `v1.0.2` desktop release assets, compute final bundle checksums after docs are finalized, run/update release privacy scan, perform supervised Amex smoke, keep signed/notarized in-place auto-update deferred until Developer ID credentials exist, and keep full dashboard-driven mock-agent coverage as a known future improvement unless a deterministic LLM/CDP setup is available.
- `AGENTS.md`: add repo working rules and commands for future agents: normal product entry point is `npm run desktop:dev`; debug-only helper/CLI entry points are `flyingpig-helper`, `flyingpig-helper --open-dashboard`, `python scripts/start.py --help`, `python scripts/daemon.py --help`; keep browser automation in the Python helper, not frontend JS; do not store Amex credentials; do not publish artifacts containing secrets/PII; before release run the verification commands below.

## Active blockers or uncertainty

- No actual harness context files exist in this mode, so all proposed updates are inferred from repository files only.
- `PLANS.md` still describes the early greenfield/bootstrap state and should not be treated as current without reconciling it with `README.md`, `docs/beta.md`, `docs/desktop-auto-update.md`, and desktop source.
- The unsigned beta path is intentional, but reliable in-place macOS auto-update remains blocked on paid Apple Developer ID signing/notarization credentials.
- The previous `v1.0.1` release is documented as not update-capable because it lacks `latest-mac.yml`; the first update-capable no-pay baseline is expected to be `v1.0.2` unless the release version changes.
- The supervised live Amex smoke is still human/tester-gated because it requires login/MFA and explicit approval before sending messages.
- Full dashboard-driven mock-agent coverage is documented as blocked on deterministic browser-use LLM or configured live LLM plus a separate CDP work window.

## Immediate next step

Create/update `NOW.md` first with the current release state and next action: verify/publish the `v1.0.2` unsigned desktop beta update assets, then run the release privacy scan and supervised Amex smoke. Then update `CONTEXT.md`, `PLAN.md`, and `AGENTS.md` so future agents stop following the stale bootstrap `PLANS.md` and use the desktop-beta architecture and release gates.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/README.md` — current product status, setup, desktop entry point, safety model, and developer commands.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/docs/beta.md` — beta scope, pre-beta gates, release evidence, operating rules, and live-smoke blockers.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/docs/desktop-auto-update.md` — unsigned beta update behavior, release flow, verification gates, signing blocker, and `v1.0.2` baseline note.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/docs/public-beta-quickstart.md` — user-facing install, first-run, safety boundaries, and manual update language.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/docs/desktop-dashboard-shell-plan.md` — approved Electron/Python-helper architecture and original context-update expectations.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/package.json` — version `1.0.2` and canonical npm scripts.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/desktop/main.js` — Electron startup, helper supervision, dashboard loading, update menu behavior.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/desktop/auto_update.js` — manual GitHub Release update-check mode and install-mode fallback.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/desktop/electron-builder.json` — packaging target, GitHub publish config, unsigned macOS zip, helper resource exclusions.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/.github/workflows/desktop-release.yml` — release CI gates and update-asset verification.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/scripts/verify_desktop_update_release.mjs` — local/GitHub update-feed asset verification contract.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/scripts/test_desktop_shell.mjs` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/desktop/helper_supervisor.test.mjs` — focused desktop readiness and helper-supervision tests.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__context-maintenance__no-harness/repo/PLANS.md` — stale bootstrap-era plan; useful as history but not as current context.

## Verification command/check

For a completed desktop/update-release task, the strongest practical verification should be:

```bash
ruff check src scripts tests
pytest tests -q -m "not slow"
npm run test:dashboard
npm run test:desktop
npm run build:helper
npm run desktop:package
npm run desktop:verify-update
npm run desktop:verify-update -- --github --tag=v1.0.2
```

Before publishing or declaring release-ready, also run a release artifact privacy scan covering the source bundle and desktop zip for PII, API keys, credentials, tokens, cookies, logs, recordings, databases, `.env`, and user-specific account data. Manual/human verification remains required for a supervised Amex smoke: launch `npm run desktop:dev`, open the work window, prepare Amex login/MFA and chat, verify Start gating, approve any outbound message/checkpoint, and confirm transcript/result capture.

I did not run these verification commands during this eval because the prompt restricted commands to read-only inspection, and these commands can create caches, build outputs, release artifacts, browser processes, or external GitHub checks.

## Context Evidence

- `README.md` says the current product shape is a native desktop app that starts a local Python helper, loads the helper-served dashboard as cockpit, and keeps the controlled Chrome window separate as the work area. It also lists the normal app command as `npm run desktop:dev` and release build commands as `npm run build:helper` and `npm run desktop:package`.
- `package.json` has version `1.0.2` and scripts for desktop dev/package/publish, helper build, dashboard tests, desktop tests, signing checks, and update verification.
- `desktop/main.js` creates the Electron window, starts `HelperSupervisor`, waits for helper readiness, loads `/dashboard/?helperUrl=...`, wires update menu actions, and opens manual download/install update actions through `configureAutoUpdates`.
- `desktop/auto_update.js` implements the unsigned/manual download mode by checking `https://api.github.com/repos/lifan-builds/flyingpig/releases/latest`, comparing versions, and opening the latest release page instead of installing in place.
- `desktop/electron-builder.json` publishes to `lifan-builds/flyingpig`, targets macOS zip, disables signing identity/notarization for current beta, and excludes logs, sqlite/db files, `.env`, recordings, logs, and cookies from helper resources.
- `.github/workflows/desktop-release.yml` runs `ruff check src scripts tests`, `pytest tests -q -m "not slow"`, `npm run test:desktop`, `npm run build:helper`, `npm run desktop:publish`, and `npm run desktop:verify-update -- --github --tag=...`.
- `docs/desktop-auto-update.md` explicitly states the current no-paid-Apple-account beta update path, manual replacement behavior, required release verification, optional future signing secrets, `v1.0.1` missing `latest-mac.yml`, `v1.0.2` as the first intended update-checking baseline, and no valid local Developer ID identity.
- `docs/beta.md` records release evidence and operating rules, including automated gates, release privacy scanning, and the live Amex smoke blocker requiring a first-cohort tester with login/MFA and explicit confirmation.
- `docs/desktop-dashboard-shell-plan.md` says the desktop shell task should update `PLAN.md` and `NOW.md` after completion and preserve Python-helper ownership of browser-use/CDP/LLM/run-state behavior.
- A direct check confirmed `AGENTS.md`, `CONTEXT.md`, `NOW.md`, `PLAN.md`, and `.context-harness` are absent from the repo copy.

## Confidence and why

High confidence on the architecture, release/update path, context files to create, and verification commands because they are corroborated across README, package scripts, desktop source, release workflow, and beta/update docs. Medium confidence on the exact identity of the just-completed task because the eval provides no chat transcript or git history, so I inferred it from the strongest current-state signals: version `1.0.2`, unsigned desktop update docs, desktop release workflow, auto-update code, and release verification script.