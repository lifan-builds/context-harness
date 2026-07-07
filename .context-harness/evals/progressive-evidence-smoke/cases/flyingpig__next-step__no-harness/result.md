# Current understanding

Flying Pig is in a public Mac beta / desktop-first closeout phase, not an early scaffold phase. The repo already has a supervised Electron desktop shell, helper-served dashboard, controlled work-window model, decision checkpoints, beta docs, release workflow, updater code, and release evidence for v1.0.1. The clearest active work from repository evidence is the v1.0.2 unsigned Mac beta update baseline: `package.json` and `pyproject.toml` are versioned `1.0.2`, `docs/desktop-auto-update.md` says v1.0.1 lacks `latest-mac.yml`, and the first no-pay update-checking baseline should be `v1.0.2`.

# Active blockers or uncertainty

- No repository source files should be changed for this eval; in real work, any release-prep edits should be separate and reviewed.
- The v1.0.2 closeout likely needs GitHub release/tag access and `gh` authentication to publish and verify assets.
- `docs/beta.md` lists `npm run test:dashboard` as a pre-beta gate, but `.github/workflows/desktop-release.yml` currently runs `ruff`, non-slow `pytest`, and `npm run test:desktop` before publishing. Before tagging, decide whether to add the dashboard smoke to CI or run it manually and record evidence.
- A supervised live Amex smoke remains inherently human-gated: tester must be present, logged in/MFA-complete, and must explicitly approve outbound messages. The repo records this as not completed for a prior release.
- The current beta is intentionally unsigned; Developer ID signing/notarization is deferred and should not block the no-pay unsigned update baseline.

# Immediate next step

Close out v1.0.2 as the first update-capable unsigned Mac beta baseline. Start with a release rehearsal from a clean checkout: install dependencies, run the documented pre-beta gates, build the helper sidecar and desktop zip, verify local `latest-mac.yml`/zip/blockmap integrity, scan artifacts for secrets/PII/user data, then tag/publish `v1.0.2` and run the GitHub asset verifier. If one implementation change is allowed before release, first align `.github/workflows/desktop-release.yml` with the documented beta gate by adding `npm run test:dashboard` before publish, then rerun the same release checks.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__no-harness/repo/README.md` — states desktop app is the normal product entry point and lists dev/test commands.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__no-harness/repo/docs/beta.md` — beta scope, pre-beta gates, prior release evidence, live Amex smoke blocker.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__no-harness/repo/docs/desktop-auto-update.md` — current update strategy and note that v1.0.2 should be the first update-checking baseline.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__no-harness/repo/package.json` — version `1.0.2` and desktop/helper/test/release scripts.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__no-harness/repo/pyproject.toml` — Python package version `1.0.2`, dependencies, pytest/ruff config.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__no-harness/repo/desktop/auto_update.js` and `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__no-harness/repo/desktop/auto_update.test.mjs` — manual GitHub-release update behavior and coverage.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__no-harness/repo/scripts/verify_desktop_update_release.mjs` — local/GitHub release asset verifier for update feed assets.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__no-harness/repo/desktop/electron-builder.json` — GitHub publish config, unsigned macOS zip target, helper resource filters.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-smoke/cases/flyingpig__next-step__no-harness/repo/.github/workflows/desktop-release.yml` — release workflow for tag/manual dispatch.

# Verification command/check

Recommended release rehearsal and closeout checks, run from the repo root in real work:

```bash
npm ci
python -m pip install -e ".[dev]"
ruff check src scripts tests
pytest tests -q -m "not slow"
npm run test:dashboard
npm run test:desktop
npm run build:helper
npm run desktop:package
npm run desktop:verify-update
# scan dist artifacts for .env, dbs, cookies, logs, recordings, private keys, API keys, tokens, emails, and user-specific account data
npm run desktop:verify-update -- --github --tag=v1.0.2
```

Manual release smoke: open the packaged app, confirm it starts the helper and dashboard, use **Check for Updates** / **Download Latest Version** behavior against the public GitHub release, and record whether the live Amex smoke is completed or blocked at a named stage from `docs/beta.md`.

# Context Evidence

- `README.md` says the desktop app is the only normal product entry point, starts the Python helper, loads the dashboard, and uses a separate work window.
- `docs/beta.md` records v1.0.1 automated gates, desktop package evidence, privacy scan evidence, and explicitly notes the supervised Amex smoke was not completed because a tester with login/MFA and send approval was required.
- `docs/desktop-auto-update.md` says the current unsigned beta checks GitHub Releases and opens the release page for manual replacement; it also says v1.0.1 lacks `latest-mac.yml` and v1.0.2 should be the first no-pay update-checking baseline.
- `package.json` exposes `desktop:publish`, `desktop:verify-update`, `build:helper`, `test:dashboard`, and `test:desktop` scripts at version `1.0.2`.
- `.github/workflows/desktop-release.yml` builds and publishes unsigned macOS beta artifacts, then verifies update feed assets with `npm run desktop:verify-update -- --github --tag="${RELEASE_TAG}"`.
- `scripts/verify_desktop_update_release.mjs` requires `latest-mac.yml`, the referenced zip, matching size/sha512, app bundle existence, and GitHub release assets: zip, blockmap, and `latest-mac.yml`.
- `desktop/auto_update.js` implements the no-pay manual download mode by fetching the latest public GitHub release and opening the release URL instead of attempting unsigned in-place auto-install.
- The eval repo intentionally omits `AGENTS.md`, `CONTEXT.md`, `NOW.md`, `PLAN.md`, and `.context-harness`; this plan relies on repository files only.

# Confidence and why

High confidence that the next closeout step is v1.0.2 release/update-baseline verification and publication, because multiple independent repo files converge on that state: package versions are already `1.0.2`, update docs name v1.0.2 as the first baseline, release workflow/verifier code exists, and beta docs show v1.0.1 was already packaged but not update-capable. Medium confidence on whether to edit CI first, because the docs/workflow mismatch around `npm run test:dashboard` is real but may be an intentional runtime tradeoff; treat it as a release-manager decision before tagging.