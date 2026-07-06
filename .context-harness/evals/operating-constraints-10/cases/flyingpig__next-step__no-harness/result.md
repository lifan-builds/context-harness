## Current understanding

Flying Pig is in a desktop-first public Mac beta shape. The intended product path is: open the Electron desktop app, let it supervise the Python helper sidecar, use the helper-served dashboard as the cockpit, and keep a separate controlled Chrome work window for the customer-service chat. Direct helper/CLI entry points remain development/debug surfaces only.

The repository appears to have moved from v1.0.1 release evidence toward a v1.0.2 update-capable beta baseline:

- `package.json`, `package-lock.json`, and `pyproject.toml` are at version `1.0.2`.
- `docs/desktop-auto-update.md` says published `v1.0.1` lacks `latest-mac.yml`, so the first no-pay update-checking baseline should be `v1.0.2`.
- `desktop/auto_update.js` implements the unsigned beta behavior: packaged apps check GitHub Releases and open the latest release page rather than doing in-place auto-update.
- `.github/workflows/desktop-release.yml` builds the unsigned macOS beta, publishes desktop artifacts, and verifies the GitHub update feed assets.
- `scripts/verify_desktop_update_release.mjs` verifies `latest-mac.yml`, zip size/hash, app bundle presence, optional signing/Gatekeeper checks, and required GitHub release assets.

So the next step looks like a release closeout/publish step for the v1.0.2 update-capable beta, not a new feature implementation pass.

## Active blockers or uncertainty

- I did not find release evidence or release notes for `v1.0.2`; `docs/releases/` only contains `v1.0.1-zh.md`.
- `docs/beta.md` still has at least one stale pre-beta gate naming `dist/flyingpig-beta-1.0.1.zip`, while `scripts/build_beta_release.py` defaults to `1.0.2`.
- The case repo is not a clean standalone git checkout from the inspected path, so I would not use `git status` here as evidence of Flying Pig source state.
- The release still needs a PII/secrets/artifact scan before publishing; the docs explicitly require checking for PII, API keys, credentials, tokens, cookies, logs, recordings, databases, and user-specific account data.
- A live supervised Amex smoke remains inherently blocked on tester presence, Amex login/MFA, and explicit confirmation before sending messages.
- I did not run tests/builds because this read-only eval only allowed inspection commands.

## Immediate next step

Close out the v1.0.2 unsigned desktop beta release baseline:

1. Inspect and reconcile release metadata/version references before publishing, especially the stale `1.0.1` gate in `docs/beta.md` versus the `1.0.2` package/build defaults.
2. Run the full local pre-release gates from the repository root.
3. Build the helper sidecar and desktop package.
4. Verify local update artifacts, especially `dist/desktop/latest-mac.yml` and the zip it references.
5. Run the desktop release workflow or push the `v1.0.2` tag to publish artifacts.
6. Verify the public GitHub release has the desktop zip, blockmap, and `latest-mac.yml`.
7. Perform the required release privacy scan on both the source bundle and desktop zip.
8. Record release evidence and any manual smoke status after verification.

If this is treated as an implementation task instead of closeout, the only concrete implementation-adjacent item I see is to fix/update release documentation and evidence around `v1.0.2`; I did not see an obvious missing code path in the update checker itself from inspection.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/README.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/package.json`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/package-lock.json`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/pyproject.toml`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/docs/beta.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/docs/desktop-auto-update.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/docs/public-beta-quickstart.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/docs/releases/v1.0.1-zh.md`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/.github/workflows/desktop-release.yml`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/desktop/auto_update.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/desktop/main.js`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/desktop/electron-builder.json`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/scripts/build_beta_release.py`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/scripts/verify_desktop_update_release.mjs`
- `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo/scripts/check_macos_signing_setup.mjs`

## Verification command/check

Run from `/Users/lfan/Project/context-harness/.context-harness/evals/operating-constraints-10/cases/flyingpig__next-step__no-harness/repo` when not in read-only eval mode:

```bash
ruff check src scripts tests
pytest tests -q -m "not slow"
npm run test:dashboard
npm run test:desktop
python scripts/build_beta_release.py --clean
npm run build:helper
npm run desktop:package
npm run desktop:verify-update
npm run desktop:verify-update -- --github --tag=v1.0.2
```

Also perform an artifact privacy scan before publishing/release acceptance. The scan should cover source and desktop zips for common API-key/private-key patterns, `.env`, cookies, logs, recordings, databases, local user paths, email/account data, credentials, tokens, and user-specific account artifacts. Manual acceptance should include opening the packaged app, checking the update menu behavior, opening the work window, confirming Start gating, and, when a tester is available, a supervised Amex smoke with explicit user confirmation before any outbound send.

## Confidence and why

Confidence: medium-high. The repository docs and code consistently point to desktop-first beta release closeout, and the `v1.0.2` update baseline is specifically called out in `docs/desktop-auto-update.md`. Confidence is not higher because I did not run tests/builds, did not inspect external GitHub release state, and the case copy does not provide reliable standalone git history/status for determining whether release evidence has already been recorded elsewhere.
