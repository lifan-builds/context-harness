# Eval Result: ergatta / cold-resume / progressive-harness

## Current understanding

This is a research/exploration repo for an Ergatta tablet bypass stack built around Frida runtime hooking, an on-device injector, and a Boot Helper APK. The current project focus is **Track 7: Real Catalog Content**. On-device phases 0-3 are complete: the catalog is visible from a merged DB plus cache-guard hooks, Pulse gameplay/distance/bars were fixed by DB repair v2, and the bypass chain has previously verified alive after force-stop/relaunch.

The main unfinished work is **Program Start**. Program lists/details can populate from cache, and `POST /workout_programs/<id>/start` has synthetic handling, but `GET /workout_programs/{id}` still returns 403. The hook intentionally passes detail 403 responses through because rewriting a detail endpoint as `data: []` caused Moshi/Retrofit JSON parsing failures.

Classes remain empty for a different reason: the available current/live DB and March snapshot contain no recoverable real Classes catalog rows (`Workouts.experience=9`) or associated history/media metadata. Restoring real Classes requires a legitimate source of those class payloads/rows, not just a local repair.

## Active blockers or uncertainty

- **Program Start blocker:** `GET /workout_programs/{id}` detail endpoint returns HTTP 403; the current URL-aware hook avoids crashes by passing detail responses through, so Start remains blocked until the detail 403 is handled or bypassed client-side.
- **Classes blocker:** no local recoverable `experience=9` class catalog/cache exists in the audited DB sources; a clean restoration needs an older/entitled DB/API capture or other legitimate source of real class rows and metadata.
- **Operational uncertainty:** the report relies on stored context and selected evidence, not a live tablet run in this eval. The next operator should confirm the bypass chain before changing anything on-device.

## Immediate next step

Resume the Program Start investigation on a connected tablet: first run the chain health check, then reproduce/tace the failing `GET /workout_programs/{id}` detail call and decide whether to synthesize a valid detail payload or bypass the detail requirement client-side. If Classes are revisited, do not synthesize fake minimal rows first; instead locate a legitimate DB/API source containing `Workouts.experience=9` plus class media/instructor metadata.

## Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/NOW.md` — current focus, blockers, and immediate next step.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/CONTEXT.md` — durable project summary, workflow, constraints, glossary, and learned patterns.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/PLAN.md` — Track 7 status; Program Start remains open; Phase 0 says to verify the chain with `./scripts/verify_chain_alive.sh`.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/FINDINGS.md` — Discovery #13 documents catalog restoration and Program Start 403; Discovery #15 documents Pulse repair verification; Discovery #16 documents lack of recoverable Classes cache.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/scripts/frida_hook.js` — hook patterns for list endpoints, program start synthesis, detail pass-through behavior, and 403 rewrites.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/scripts/verify_chain_alive.sh` — health check for adb device, frida-server PID, injector daemon PID, and recent `injected + eternalized` BootHelper logcat marker.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/scripts/repair_pulse_catalog_on_tablet.sh` — canonical Pulse catalog repair helper referenced by context, currently not the active blocker.

## Verification command/check

When a tablet is connected, start with:

```bash
cd /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo && ./scripts/verify_chain_alive.sh
```

Expected healthy result: exit 0 and `chain alive: frida-server + injector + hook`. Then reproduce Program Start and inspect the `GET /workout_programs/{id}` detail 403 behavior before modifying the hook.

## Context Evidence

1. Read eval prompt: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/prompt.md`.
2. Listed repo copy root: `ls -la /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo`.
3. Listed context-harness directory: `ls -la /Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/.context-harness`.
4. Read always-read current layer first: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/NOW.md`.
5. Read concise always-read context: `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/CONTEXT.md`.
6. Ran required hydrate before opening PLAN/bulky context: `node scripts/context-index.js hydrate "resume current task"` from the repo copy. Hydrate selected cards: `ctx-now-now` and `ctx-plan-open-questions-deferred-until-evidence-demands-an-answer`.
7. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-now-now.md`.
8. Read selected card `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__cold-resume__progressive-harness/repo/.context-harness/cards/ctx-plan-open-questions-deferred-until-evidence-demands-an-answer.md`.
9. Ran targeted read-only search: `rg -n "Program Start|workout_programs|Classes|verify_chain_alive|repair_pulse|GET /workout_programs" NOW.md CONTEXT.md README.md FINDINGS.md PLAN.md scripts`.
10. Read targeted `PLAN.md` excerpts covering Track 7 status and Phase 0 verification.
11. Read targeted `FINDINGS.md` excerpts covering Discoveries #13-#16.
12. Read targeted `scripts/frida_hook.js` excerpt covering endpoint pattern handling and detail/list distinctions.
13. Read `scripts/verify_chain_alive.sh` to confirm what the verification command checks.

## Confidence and why

Confidence: **high** for the current focus, blockers, next step, relevant files, and verification command because they are consistent across NOW, CONTEXT, selected hydrate cards, PLAN, FINDINGS, and the hook/verification scripts. Confidence is **not absolute** for live device state because this eval did not run adb against a connected tablet; the first real-world check should be `./scripts/verify_chain_alive.sh`.
