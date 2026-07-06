# Current understanding

Flying Pig is a supervised Mac desktop beta for customer-service chat automation. The intended product path is now desktop-first: users open the Electron app, the app starts a local Python helper sidecar, loads the helper-served dashboard as the single cockpit, and launches a separate Controlled Chrome work window for the actual support chat. Browser-use/CDP execution, LLM calls, run state, safety preflight, checkpoints, evidence, model settings, and dashboard protocol remain helper-owned.

The current active focus appears to be the unsigned `v1.0.2` desktop beta/update baseline. `package.json` and `pyproject.toml` are at `1.0.2`; the desktop release workflow defaults to `v1.0.2`; `docs/desktop-auto-update.md` says `v1.0.1` was not update-capable because it lacked `latest-mac.yml`, so the first no-pay update-checking baseline should be `v1.0.2`. The beta remains manual-download/manual-replace rather than in-place auto-update.

# Active blockers or uncertainty

- No Developer ID signing/notarization is configured, so the Mac beta stays unsigned and update behavior is manual GitHub-release download, not reliable in-place auto-update.
- DMG packaging is deferred due to a local native-addon signing issue in the DMG license toolchain; current packaging target is zip.
- A supervised live Amex smoke has not been completed in the latest beta evidence because it requires a first-cohort tester present with Amex login/MFA completed and explicit confirmation before sending.
- A full dashboard-driven mock-agent run is blocked from being a normal gate because it needs either deterministic browser-use LLM behavior or configured live LLM credentials plus a separate CDP work window.
- The repo copy has no `dist/` artifacts, so I cannot verify from files alone whether `v1.0.2` has already been built or published.
- `PLANS.md` is stale bootstrap-era context; the current state is better inferred from README, beta docs, ADRs, desktop release docs, source, and package versions.

# Immediate next step

Cut and verify the `v1.0.2` unsigned desktop beta/update baseline, then run the required privacy scan and arrange the supervised Amex smoke with a tester. Concretely: build the helper sidecar, package/publish the desktop zip/update assets, verify the GitHub release contains the zip, blockmap, and `latest-mac.yml`, and record whether the Amex smoke reaches chat, gates outbound messages behind user confirmation, and captures transcript/result evidence.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/README.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/package.json`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/pyproject.toml`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/docs/beta.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/docs/desktop-auto-update.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/docs/adr/0004-electron-native-desktop-shell.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/docs/adr/0005-desktop-first-product-path.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/.github/workflows/desktop-release.yml`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/main.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/auto_update.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/helper_supervisor.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/electron-builder.json`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/scripts/check_macos_signing_setup.mjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/scripts/verify_desktop_update_release.mjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/src/daemon/server.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/src/daemon/preflight.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/src/daemon/run_session.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/dashboard/dashboard.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/fleet-upgrade-10/cases/flyingpig__cold-resume__no-harness/repo/dashboard/dashboard_protocol.js`

# Verification command/check

From the repo copy or real working repo, the main automated gate is:

```bash
npm ci && \
python -m pip install -e ".[dev]" && \
ruff check src scripts tests && \
pytest tests -q -m "not slow" && \
npm run test:dashboard && \
npm run test:desktop && \
npm run build:helper && \
npm run desktop:package && \
npm run desktop:verify-update
```

For the actual published `v1.0.2` update baseline, run after publishing:

```bash
npm run desktop:verify-update -- --github --tag=v1.0.2
```

Also keep the non-automated release checks from `docs/beta.md`: scan built artifacts for PII/API keys/credentials/tokens/cookies/logs/recordings/user data, then perform the supervised Amex smoke with explicit user confirmation before sends.

# Confidence and why

Confidence: medium-high. The README, ADRs, beta checklist, desktop update doc, package versions, release workflow, and desktop/helper source all point to the same current direction: desktop-first supervised beta plus `v1.0.2` unsigned update baseline. Confidence is not full because the no-harness repo copy lacks live context files and built/published artifacts, and some project docs (`PLANS.md`, parts of `EVALUATION.md`) are clearly older than the current desktop-beta state.
