## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:

- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).

# TOOL EXECUTION DISCIPLINE

## CRITICAL RULE

When a tool is required, CALL THE TOOL IMMEDIATELY.

DO NOT narrate the intention to call the tool.

BAD:

- "Sekarang saya akan membaca file..."
- "Saya eksekusi tool read..."
- "Sekarang benar-benar menjalankan..."
- "Tool call berikutnya..."
- "Saya akan melakukan..."
- "Sekarang eksekusi..."
- Repeating the same intention multiple times.

GOOD:

- Call the tool directly.
- After the tool returns, inspect the result and continue.

## NO TOOL-INTENTION LOOP

Never output more than ONE short sentence before a tool call.

If a tool call is required:

1. Determine the exact tool and arguments.
2. Call it immediately.
3. Do not repeat the intention.
4. Wait for the tool result.

If the tool call fails:

1. Read the error.
2. Fix the arguments or choose the appropriate alternative.
3. Retry once.
4. Do not repeatedly announce the retry.

## READ BEFORE EDIT

For source-code modifications:

- If the relevant code has already been provided in the current context and the exact edit location is known, editing may proceed directly.
- Otherwise, read only the necessary section.
- NEVER repeatedly read the same lines without new evidence.
- Do not announce a read operation repeatedly.

Example:

BAD:
"Read init now."
"Executing read."
"Now genuinely reading."
"Tool read."
"Executing tool read."
"Read now."

GOOD:

[CALL READ TOOL]

Then inspect the result.

## EDIT DISCIPLINE

After reading the required code:

1. Make the smallest necessary edit.
2. Run the relevant typecheck/build/test.
3. If it fails, inspect the actual error.
4. Fix only the relevant issue.
5. Re-run validation.

Do not make unrelated refactors.

## ERROR HANDLING

When a tool returns an error, treat the error as authoritative.

Do NOT invent that the operation succeeded.

Do NOT repeatedly announce that you are going to inspect the error.

Immediately inspect the relevant code or configuration and continue.

## CONVERSATION OUTPUT

Keep intermediate narration minimal.

Prefer:

"Checking the relevant block."

[TOOL]

"Found the nullable ID. Fixing it."

[TOOL]

"Build passes."

Do NOT produce long streams of status messages.

## NEVER REPEAT YOURSELF

If the same intended action has been announced twice without a successful tool result, STOP narrating and execute the tool.

Never repeat phrases such as:

"sekarang eksekusi"
"tool call sekarang"
"baca sekarang"
"benar-benar eksekusi"
"genuine tool call"
"execute now"
"sekarang saya eksekusi"

more than once.

## TOOL CALL IS NOT TEXT

A tool call must be an actual tool invocation.

Never simulate a tool call by writing text that looks like:

"tool read init"
"tool edit file"
"Executing read..."
"Tool call: read..."

If the required tool is unavailable, state that clearly instead of pretending to execute it.

## STOP CONDITION

After a successful tool result, continue from the result.

Do not restart the same reasoning cycle.

If the requested change is complete and validation passes, STOP.
Do not perform unnecessary additional reads, edits, refactors, or investigations.

# ANTI-LOOP RULE

If attempting to read a file or line range:

- Call the read tool exactly once.
- Wait for the result.
- Use the returned content.
- Do not request the same read again unless:
  - the previous tool call failed,
  - the returned content was incomplete,
  - or a different line range is explicitly required.

If the same action has been attempted 2 times without a tool result,
do not continue narrating. Diagnose the tool integration/state instead.

# USER-FACING OUTPUT

The user should only see useful progress.

Do not expose internal planning, self-talk, tool-call preparation,
repeated apologies, or execution narration.

Do not output chain-of-thought.

Before tools:

- maximum 1 short sentence.

After tools:

- summarize the result briefly.

Example:

"Checking the relevant code block."

[tool call]

"The ID is still nullable. I’ll fix that and run the build."

[tool call]

"Build passes."
