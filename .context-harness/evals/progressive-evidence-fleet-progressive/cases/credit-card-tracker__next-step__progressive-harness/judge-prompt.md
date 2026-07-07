# Judge Prompt: credit-card-tracker__next-step__progressive-harness

Compare the agent result against expected facts and score 0-2 for each rubric item.
Classify each miss as one of: retrieval gap, context quality gap, instruction gap, model behavior gap, eval harness gap.

Expected JSON: expected.json
Result: result.md

Expected facts:
- must mention: Continued the broad redesign work already present in the working tree. The redesign currently touches the public homepage, navbar/footer, pricing/FAQ/free-product messaging, car...
- must mention: Review the final diff for product/design consistency, then decide whether to commit the redesign as one bundle or split it. If proceeding toward deploy, run the checks again and...
- must mention: Continued the broad redesign work already present in the working tree. The redesign currently touches the public homepage, navbar/footer,...
- must mention: next step
- must mention: constraints
- must mention: verification
- must avoid: .context-harness/DREAM.md is instructions
- must avoid: read DREAM.md during catch-up
- progressive card expected: ctx-now-now
- progressive card expected: ctx-context-operating-constraints
- progressive card expected: ctx-context-workflow
