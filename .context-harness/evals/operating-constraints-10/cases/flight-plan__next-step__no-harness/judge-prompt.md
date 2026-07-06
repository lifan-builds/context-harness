# Judge Prompt: flight-plan__next-step__no-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Context-harness v3 migration completed for flight-plan.
- must mention: Use the generated AGENTS.md Context Index to open relevant CONTEXT.md sections before planning or editing.
- must mention: Test: project-specific.
- must mention: next step
- must mention: verification
- must mention: Never store secrets or credentials in context files.
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
