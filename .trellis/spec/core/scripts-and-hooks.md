# Scripts and Hooks

## Runtime Style

Use dependency-free synchronous CommonJS compatible with Node 18+:

```js
"use strict";

const fs = require("fs");
const path = require("path");
```

`scripts/package.json` fixes the runtime to `commonjs`; it must accompany scripts installed into projects whose parent package may declare `"type": "module"`.

Prefer small functions, explicit inputs, deterministic output, and standard-library dependencies. Match the existing double-quote and semicolon style.

## Shared Mechanics

Import reusable behavior from `scripts/lib.js` instead of reimplementing:

- `readHookInput` and `normalizeHookInput`;
- safe text/JSON reads and JSON writes;
- project root and configuration detection;
- Markdown section parsing;
- structured command execution.

Project-root detection deliberately checks for a nested `CONTEXT.md` before walking to parent package or Git markers. Preserve this ordering.

`install-project.js` is currently self-contained so it can copy/install runtime files; do not spread its duplicate hashing, Git, or filesystem helpers to other scripts.

## Hook Input and Output

Hook input may arrive through `TOOL_INPUT` or stdin and may nest fields under `tool_input`. Normalize common command, path, and working-directory aliases. Malformed input should degrade conservatively rather than crash an optional hook.

Blocking output is contractual:

```json
{"decision":"block","reason":"..."}
```

A blocked operation exits 2. Ordinary allow paths exit 0.

## Strict CLIs Versus Best-Effort Hooks

Use strict failures for direct CLIs:

- malformed commands or arguments;
- missing required context;
- invalid schemas;
- stale indexes during `check`;
- failed evaluation gates.

These normally exit 1 with an actionable stderr message.

Hooks must not break ordinary agent work merely because context support failed. `codex-context-hook.js`, `format-on-edit.js`, and `session-end.js` catch optional failures, may emit a warning, and exit 0. Security denials from `guard.js` remain hard blocks with exit 2.

Lifecycle hooks only inject compact nudges; they do not invoke skills themselves.

## Subprocesses and Safe Reads

Return structured subprocess results such as `{exitCode, stdout, stderr}` instead of throwing for expected nonzero exits. Installer records use stable status/output-hash objects.

Use safe reads for optional context and let callers decide whether absence is harmless. Validate required contracts explicitly at the owning boundary.

## Managed Files

Canonical scripts and skills live in this repository. Installed copies are deployment outputs or user-local overrides. Update logic must classify files before replacing them:

- missing or known-clean managed files may be refreshed;
- user-modified files become reported conflicts;
- unrelated dirty paths are preserved.

Never edit generated cards/chunks/indexes as if they were source. Never add evaluation CLIs or local Trellis platform scaffolding to the installed runtime list.

## Security Guardrails

Preserve `guard.js` checks that block likely secrets, edits to linter configuration, `--no-verify`, `--no-gpg-sign`, and `core.hooksPath` bypasses. Do not weaken these checks to make a workflow convenient; update the intended workflow instead.
