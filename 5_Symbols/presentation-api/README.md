# Presentation API — SPEC-018

Turns `{ title, voiceover }` into a queued Canva-presentation-generation job.
Full architecture and the capability constraint this design works around:
[`4_Formula/voiceover_presentation_api_spec.md`](../../4_Formula/voiceover_presentation_api_spec.md).

**The one thing to understand before using this:** Canva's AI design
generation (`generate-design-structured`) only exists inside an agent
session with the Canva MCP connector attached — there is no public REST
endpoint for it. So this API cannot generate a Canva design by itself. What
it *can* do, entirely as deterministic code: parse a voiceover script into a
Canva-ready outline, and queue/track a job. Generating the actual design is
a manual step you (or an agent) run interactively.

## Setup

```bash
npm install
npm test        # run the parser unit tests
npm run dev      # start the API on http://127.0.0.1:4021
```

## End-to-end runbook

1. **Submit a job:**
   ```bash
   curl -s -X POST http://127.0.0.1:4021/api/presentations \
     -H 'Content-Type: application/json' \
     -d '{"title": "My Deck", "voiceover": "Act 1 — Problem\n\n..."}' | jq
   ```
   Returns `{ id, status: "pending", outline: { title, presentation_outlines: [...] }, ... }`.
   The `outline` field is already shaped for `request-outline-review` /
   `generate-design-structured`.

2. **Check pending jobs** (what an agent should do when asked to "process
   presentation jobs"):
   ```bash
   curl -s http://127.0.0.1:4021/api/presentations/jobs/pending | jq
   ```

3. **Generate the design** — in a Claude Code session with the Canva MCP
   connector attached, run the real tool chain against the job's `outline`:
   `request-outline-review` (with `outline.presentation_outlines` as `pages`)
   → user approves → `generate-design-structured` → pick a candidate →
   `create-design-from-candidate`. This step is not scriptable — see the
   constraint above.

4. **Write the result back** (pure deterministic code, no MCP call):
   ```bash
   npm run complete-job -- --id <job_id> --design-id <id> \
     --edit-url <url> --view-url <url>
   ```
   Or on failure: `npm run complete-job -- --id <job_id> --error "<message>"`.

5. **Poll the result:**
   ```bash
   curl -s http://127.0.0.1:4021/api/presentations/<job_id> | jq
   ```

## API Surface

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/presentations` | `{ title, voiceover }` → parses outline, creates a `pending` job |
| `GET` | `/api/presentations/:id` | Job status/result |
| `GET` | `/api/presentations/jobs/pending` | List pending jobs (for the agent runbook above) |
| `PATCH` | `/api/presentations/:id` | Write back `{ status, design_id, edit_url, view_url }` |

## Parser

`src/parser.ts` — deterministic, no LLM call. Splits on `Act N — ...`
headings, then on inline `Panel N` mentions within each Act, extracts
quoted dialogue as `Speech bubble: "..."` bullets, and turns the rest into
narrative bullets. See `src/__tests__/parser.test.ts`, which runs it against
the actual Coordinator/Sub-Agents voiceover script and asserts it reproduces
the same 8-slide breakdown that was originally built by hand.

## Job store

Local JSON file at `.data/jobs.json` (gitignored). Not Supabase yet — see
SPEC-018 for why a DB dependency wasn't added for a v1 job queue.

## Security

Binds to `127.0.0.1` only. No auth layer — same trust model as this
project's other local CLI tools (`5_Symbols/mcp-server/src/cli.ts`). Do not
expose this beyond localhost without adding one.
