- Current understanding
  - Flying Pig is in a supervised Mac desktop beta shape: the Electron app is the normal product entry point, starts/supervises the Python helper sidecar, loads the helper-served dashboard as the cockpit, and keeps a separate controlled Chrome work window for customer-service automation. Evidence: `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/README.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/docs/adr/0005-desktop-first-product-path.md`, `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/docs/adr/0004-electron-native-desktop-shell.md`.
  - The active focus appears to be the unsigned Mac beta update/release baseline for `v1.0.2`, not new product architecture. `package.json`, `pyproject.toml`, `scripts/build_beta_release.py`, and `.github/workflows/desktop-release.yml` all point at `1.0.2`/`v1.0.2`; `docs/desktop-auto-update.md` says `v1.0.1` lacked `latest-mac.yml` and the first no-pay update-checking baseline should be `v1.0.2`.
  - The intended update behavior is manual download from GitHub Releases for unsigned builds: packaged apps check the public latest release and open the release page rather than doing in-place auto-update. Evidence: `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/auto_update.js`, `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/docs/desktop-auto-update.md`.

- Active blockers or uncertainty
  - No Developer ID signing identity is configured, so reliable signed/notarized in-place macOS auto-update is intentionally not available; unsigned beta users manually download and replace the app.
  - Published/release evidence in `docs/beta.md` is for `1.0.1`, while current version/configuration is `1.0.2`; I did not find in-repo evidence that `v1.0.2` has already been published and verified.
  - `docs/desktop-auto-update.md` explicitly notes `v1.0.1` is not update-capable because it lacks `latest-mac.yml`.
  - Live supervised Amex smoke remains dependent on a tester being present for login/MFA and explicit send approvals. `docs/beta.md` says it was not completed in that run.
  - Full dashboard-driven mock-agent coverage is still blocked by needing either a deterministic browser-use LLM or live provider credentials plus a separate CDP work window; current committed dashboard tests are protocol/UI smoke rather than full browser-use agent execution.
  - Minor doc drift: `docs/beta.md` still says `python scripts/build_beta_release.py --clean` produces `dist/flyingpig-beta-1.0.1.zip`, while `scripts/build_beta_release.py` defaults to `1.0.2`.

- Immediate next step
  - Publish or verify the `v1.0.2` unsigned Mac beta update baseline, then update release evidence/docs after verification. Concretely: run the pre-release gates, build the helper sidecar, publish desktop artifacts through the GitHub release workflow/tag path, verify the GitHub release contains the zip, blockmap, and `latest-mac.yml`, and perform the release privacy scan before broadening beta use.

- Relevant files
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/README.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/package.json`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/pyproject.toml`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/.github/workflows/desktop-release.yml`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/docs/desktop-auto-update.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/docs/beta.md`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/auto_update.js`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/auto_update.test.mjs`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/desktop/electron-builder.json`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/scripts/verify_desktop_update_release.mjs`
  - `/Users/lfan/Project/context-harness/.context-harness/evals/manual-realworld-10/cases/flyingpig__cold-resume__no-harness/repo/scripts/build_beta_release.py`

- Verification command/check
  - Main current-focus check after publish: `npm run desktop:verify-update -- --github --tag=v1.0.2`
  - Pre-release gate set documented in the repo: `ruff check src scripts tests`, `pytest tests -q -m "not slow"`, `npm run test:dashboard`, `npm run test:desktop`, then `npm run build:helper` and `npm run desktop:publish` through the release workflow. The release artifact scan for PII/API keys/credentials/tokens/cookies/logs/recordings/databases/user data remains a required manual/automated check.

- Confidence and why
  - Medium-high. The release/update focus is supported by converging version numbers, workflow defaults, update documentation, updater code/tests, and verification scripts. Confidence is not maximal because this no-harness eval lacks the repo's usual session context, there is no git metadata inside the case repo, and release evidence for `v1.0.2` is not present in the copied files.