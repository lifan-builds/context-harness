# Judge Prompt: context-harness__next-step__no-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Progressive context library, real-repo retrieval shadow evaluation, and fresh-agent problem-solving eval harness are implemented and verified in the working tree.
- must mention: Review the diff, then run a small manual fresh-agent eval batch from generated prompts before commit/push and local deployment.
- must mention: Test: tests/run-all.sh
- must mention: next step
- must mention: verification
- must mention: ### Never
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
