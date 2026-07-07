# Current understanding

Track 7 is almost in closeout: the on-device bypass chain is alive, Programs catalog/list/detail content has been restored from the merged local DB, cache-guard hooks prevent destructive refresh wipes, and Pulse gameplay has been repaired. The remaining active implementation issue is Program Start: `GET /workout_programs/{id}` still returns 403 and `scripts/frida_hook.js` intentionally passes unmatched detail 403s through to avoid the earlier `JsonDataException` from rewriting detail responses as `data: []`.

The decompiled flow confirms why this blocks progress: `RealPushProgramRepository.getProgramDetailsBy(id, programResultId)` combines local Room overview data with a remote `program(id)` flow; `PushProgramApi.program()` is `GET workout_programs/{id}` returning `RudderApiResponse<WorkoutProgram>`. `WorkoutProgram` requires non-null `id`, `name`, `description`, `workoutDetails`, and `timeLimit`. The existing `POST /workout_programs/{id}/start` fake `programResultId` rewrite is already in place, so the next step should target the detail GET, not the start POST first.

# Active blockers or uncertainty

- Need the exact safe replacement for `GET /workout_programs/{id}`. Do not use `data: []`; detail expects an object.
- Unclear whether a minimal object with empty `workoutDetails` is sufficient for Start, or whether Start/detail needs the cached program workout list preserved.
- Need a connected tablet and logged-in Bearer session to verify; this eval is read-only and did not exercise ADB.
- Classes remains blocked separately by lack of recoverable `experience=9` class catalog rows; do not mix that into the Program Start fix.

# Immediate next step

On the next device-connected session, implement a narrow Program Detail bypass in `scripts/frida_hook.js`:

1. Turn on diagnostic tracing (`/data/local/tmp/trace_http.enabled`), reproduce Program Start, and confirm the failing sequence around `GET /workout_programs/{id}` followed by whether `POST /workout_programs/{id}/start` is reached.
2. Inspect one restored local program/workout row from the merged DB and the decompiled mappers to decide whether to synthesize the HTTP detail JSON or hook a client layer closer to Room.
3. Preferred safe implementation path: add a specific `WORKOUT_PROGRAM_DETAIL_PATTERN` for `GET /workout_programs/<id>` that returns a valid object-shaped `WorkoutProgram` payload, ideally built from cached/local program data rather than a generic empty detail. If local data cannot be used at the OkHttp layer, hook the repository/API layer that calls `RemotePushProgramDataSource.program(id)` so it can emit a locally-derived `WorkoutProgram` without hitting the server.
4. Re-test Program Start. If the detail bypass works, verify the existing start rewrite logs `START-rewrite (push)` and that `refreshReports(true)` does not wipe the restored catalog.
5. Only after Program Start works, update `NOW.md`, `PLAN.md`, and `FINDINGS.md` with the recipe and any remaining closeout items.

# Relevant files

- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__next-step__progressive-harness/repo/scripts/frida_hook.js` — current billing/signature/403 hook; add detail-specific handling here if using HTTP rewrite.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__next-step__progressive-harness/repo/scripts/verify_chain_alive.sh` — first device health check.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__next-step__progressive-harness/repo/analysis/decompiled_apk/smali_classes7/com/ergatta/seaborn/programs/data/remote/PushProgramApi.smali` — confirms `GET workout_programs/{id}` and `POST workout_programs/{id}/start` return types.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__next-step__progressive-harness/repo/analysis/decompiled_apk/smali_classes7/com/ergatta/seaborn/programs/model/api/WorkoutProgram.smali` — required detail DTO fields.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__next-step__progressive-harness/repo/analysis/decompiled_apk/smali_classes7/com/ergatta/seaborn/programs/data/RealPushProgramRepository.smali` and nested `$getProgramDetailsBy$programFlow$1$1$1.smali`, `$startProgramById$2.smali` — confirms detail and start call flow.
- `/Users/lfan/Project/context-harness/.context-harness/evals/progressive-evidence-fleet-progressive/cases/ergatta__next-step__progressive-harness/repo/FINDINGS.md` — Discovery #13 records the exact blocker and why list-style JSON broke detail parsing.

# Verification command/check

Run from the repo root on a connected, logged-in tablet:

```bash
./scripts/verify_chain_alive.sh
adb shell "su -c 'touch /data/local/tmp/trace_http.enabled'"
adb push scripts/frida_hook.js /data/local/tmp/frida_hook.js
adb shell "am force-stop com.ergatta.seaborn"
adb shell "am start -n com.ergatta.seaborn/.LoginRegisterActivity"
# sign in, open Programs, choose one restored program, tap Start
adb shell "logcat -d -s FridaHook BootHelper" | grep -E "workout_programs|catalog-403|START-rewrite|PASS-THROUGH|injected"
```

Expected checks: no unmatched pass-through 403 for `GET /workout_programs/{id}`, a valid detail object is accepted without Moshi errors, `START-rewrite (push)` appears for `POST /workout_programs/{id}/start`, the workout/interval UI opens, and restored catalog counts remain stable after relaunch. If closing Track 7, also pull the DB and confirm counts remain around 84 PushPrograms / 848 Workouts / 38,163 Intervals.

# Context Evidence

1. Read `prompt.md`.
2. Read always-on layer: `NOW.md`, then concise `CONTEXT.md`.
3. Ran `node scripts/context-index.js hydrate "plan next implementation step"`; selected cards: `ctx-plan-done-criteria`, `ctx-plan-discoveries-from-prep-2026-05-15`, `ctx-plan-execution-plan-when-device-is-connected`, `ctx-plan-findings-device`, `ctx-plan-open-questions-deferred-until-evidence-demands-an-answer`, `ctx-plan-progress-2026-05-17`, `ctx-plan-three-sub-paths-ordered-by-roi`.
4. Opened selected cards: `ctx-plan-execution-plan-when-device-is-connected`, `ctx-plan-progress-2026-05-17`, `ctx-plan-done-criteria`, `ctx-plan-open-questions-deferred-until-evidence-demands-an-answer`.
5. Inspected `scripts/frida_hook.js`, `scripts/verify_chain_alive.sh`, targeted excerpts from `PLAN.md`, `FINDINGS.md`, and `EVALUATION.md`.
6. Used targeted read-only search/decompiled inspection for program detail/start flow: `PushProgramApi.smali`, `WorkoutProgram.smali`, `RealPushProgramRepository*.smali`.
7. Save/update routing for a real session: after implementing and verifying, update `NOW.md` current focus/blockers, `PLAN.md` progress/done criteria, and `FINDINGS.md` Discovery/Error Log if new failure mode or recipe is learned. No repository source files were modified in this eval.

# Confidence and why

Medium-high. The active blocker is explicit in `NOW.md`, `PLAN.md`, and `FINDINGS.md`, and the decompiled call path confirms the detail endpoint and DTO shape. Confidence is not higher because I could not run the tablet flow, inspect live DB rows, or prove whether a minimal synthesized `WorkoutProgram` is enough versus needing a locally-derived full `workoutDetails` list.