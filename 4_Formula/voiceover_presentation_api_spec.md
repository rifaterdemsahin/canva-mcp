# SPEC-018: Voiceover-to-Presentation API

- **Status:** ✅ Verified (2026-07-12) — live end-to-end run produced design `DAHPMbFhUJE` (11 pages), edit URL https://www.canva.com/d/koayZBYCG9Sqbwi, job `46593a64-89e1-456f-9052-664e7fc391c7` marked `done`
- **Owner:** Formula Agent (plan) → Symbols Agent (API code) → Test Agent (verification)
- **Related OKR:** Objective 8 in `1_Real_Unknown/okrs.md`
- **Related Files:** `5_Symbols/mcp-server/` (existing Canva REST client this reuses), `7_Testing_Known/coordinator_subagents_comic_flow.md` (the manual process this automates), `2_Environment/canva_capability_research.md` (prior capability research)

## Description

Generalize the manual "voiceover script → Canva outline → generated presentation" workflow used for the Coordinator/Sub-Agents comic deck into a reusable local HTTP API: `POST /api/presentations { title, voiceover }` should produce a Canva presentation without the user hand-writing the outline each time.

## Capability Scan (Environment Agent step, done before drafting this spec)

Checked `5_Symbols/mcp-server/tools/canva-api.ts` (the project's existing standalone Canva client) against what `generate-design-structured` actually does in this session:

- `createDesign()` calls `POST https://api.canva.com/rest/v1/designs` — the **public Connect REST API**. This only creates a blank/empty design of a given type + title. It does **not** accept an outline and does **not** produce AI-populated slide content.
- Every AI-generated deck in this project (SPEC-015/016/017, the comic deck) was built with `request-outline-review` → `generate-design-structured` → `create-design-from-candidate` — tools that exist **only inside the claude.ai Canva MCP connector**, authenticated to this interactive session. There is no published Canva Connect REST endpoint that performs outline-to-AI-design generation; that capability is exclusive to the MCP-connected agent context (confirmed by the absence of any such endpoint in Canva's Connect API reference during SPEC-016/017 research, and by `canva-api.ts` only ever calling the plain-create endpoint).

**[CONSTRAINT] This means a headless server process cannot call "generate a Canva design from an outline" by itself — it has no credentials or protocol to reach that capability. Only an LLM agent with the Canva MCP connector attached (this Claude Code session, or a scheduled Claude cloud agent) can perform that step.**

## Resolution — Chosen Architecture

A synchronous, fully-headless REST endpoint that "does the MCP call in the background" as a single self-contained server binary is **not possible** given the constraint above. The closest honest equivalent is a **job queue**, decoupling the fast, deterministic part (accepting the request, building the outline) from the slow part that requires an agent (actually generating the Canva design):

```
POST /api/presentations { title, voiceover }
    │
    ▼
1. Validate input
2. Parse voiceover → structured outline (deterministic, no LLM call — see Parser below)
3. Write a job record { id, status: "pending", title, outline } to the job store
4. Return { job_id, status: "pending", outline } immediately (this is the "background" part —
   the caller does not block waiting for Canva generation)
    │
    ▼ (serviced manually by an agent — not automatable as a script)
5. GET /api/presentations/jobs/pending is checked by an agent (this Claude Code session,
   prompted by the user: "check pending presentation jobs"). The MCP tools
   (request-outline-review, generate-design-structured, create-design-from-candidate)
   are only invocable through the Claude Code tool-calling protocol — they are NOT
   reachable from a Node subprocess, curl, or any script, because they run inside
   this session's own MCP-connector authentication, not a bearer token a script could
   hold. So the agent runs the real MCP chain against the job's outline interactively,
   then writes the result back with a small helper CLI that IS pure deterministic code:
     npm run complete-job -- --id <job_id> --design-id <id> --edit-url <url> --view-url <url>
   which PATCHes the job store to { status: "done", ... }.
    │
    ▼
GET /api/presentations/:job_id ──► caller polls this to retrieve the final result
```

**Why this is the correct v1 shape, not a shortcut:** it matches the same "surface the capability boundary, don't silently paper over it" discipline used in SPEC-015/016/017. A `npm run process-jobs` script that pretended to call `generate-design-structured` itself would be dishonest — it has no way to reach that capability. The only truthful "background" here is: fast, scriptable steps (parse, queue, store, patch) are real code; the one step that requires AI design generation stays a human-prompted agent action, documented as a runbook, not faked as automation.

## Voiceover → Outline Parser (deterministic, no LLM)

Generalizes the manual translation done for the comic deck (`7_Testing_Known/coordinator_subagents_comic_flow.md`):

1. Split the voiceover text on lines matching `/^Act \d+\s*[—-]\s*.+/i` (or, if none found, treat the whole voiceover as one section) → each match starts a new **section**, its heading text becomes a slide title, and everything until the next `Act` heading (or `Panel` heading) becomes that section's body.
2. Within a section, further split on lines matching `/^Panel \d+\s*[—-]\s*.+/i` → each match becomes its **own** slide (mirroring how every explicit "Panel N" in the comic script got its own slide).
3. For each resulting block of prose:
   - Extract any single-quoted or double-quoted dialogue (`'...'` / `"..."`) as a literal quoted bullet (preserves speech-bubble lines verbatim, exactly as done by hand for the comic deck).
   - Extract the remaining sentences as additional hyphen bullets, per `request-outline-review`'s required bullet format.
4. First section becomes the title slide: its heading (or the user-supplied `title` field) is the presentation title; the first sentence of its body becomes the subtitle.
5. Output: `{ title, presentation_outlines: [{ title, description }, ...] }` — directly the shape `request-outline-review`/`generate-design-structured` expect.

This is pure text processing — no AI call, fully unit-testable, deterministic, and reusable across any future voiceover script (comic, architecture course, or otherwise), unlike the one-off hand-translation used for SPEC-016/comic deck.

## API Surface

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/presentations` | Accept `{ title, voiceover }`, parse to outline, create a `pending` job, return it immediately |
| `GET` | `/api/presentations/:job_id` | Return current job status/result |
| `GET` | `/api/presentations/jobs/pending` | List pending jobs (used by the agent-run executor, not end users) |
| `PATCH` | `/api/presentations/:job_id` | Executor-only: write back `{ status, design_id, edit_url, view_url }` after generation |

## Job Store (v1)

A local JSON file (`5_Symbols/presentation-api/.data/jobs.json`, gitignored) — no new infrastructure dependency for a first working version. **Not** Supabase yet: this project already has Supabase provisioned for other features, and migrating the job store there is a natural v2 step once this is proven out, per the Environment Agent's data-storage-strategy guidance (don't add a DB dependency before the workload needs it).

## Security Boundaries

- Local-only by default (binds `127.0.0.1`), matching every other tool in this repo (`npm run canva:create`, etc.) that relies on a local `.env`-sourced `CANVA_ACCESS_TOKEN` — this API does not itself hold or need a Canva token (it never calls Canva directly; the executor agent does, via the already-authenticated MCP connector).
- No auth layer in v1 (single local user, same trust model as the existing CLI scripts). Flag before any deployment beyond localhost.
- Job store contains only titles/voiceover text/design metadata — no secrets.

## Verification Plan (Test Agent) — Results

- **Unit tests (11/11 passing):** `src/__tests__/parser.test.ts` runs the parser against the actual Coordinator/Sub-Agents script and asserts it reproduces the exact same 8-section breakdown built by hand for the comic deck (title + Act1-intro + Panel1-4 + Act2 + Act3), correct dialogue extraction including a multi-sentence quote (`"Let's build! Follow all instructions!"`), and 3 fallback cases (no Act headings, empty input, inline Panel mentions without Act headings) that degrade gracefully instead of crashing.
- **Bugs found and fixed by the tests before shipping** (documented in detail in `4_Formula/llm_thinking_log.md`):
  1. The dialogue regex's opening-quote match wasn't constrained, so it latched onto the mid-word apostrophe in "team's" instead of the real dialogue's opening quote — fixed with a negative lookbehind requiring the opening quote not be preceded by a word character.
  2. The naive `[^.!?]+[.!?]+` sentence splitter silently **dropped** text around embedded non-terminating periods (e.g. "CLAUDE.md") because the character class structurally couldn't pass through a period that wasn't a valid boundary — fixed by switching to a lazy any-character body with a lookahead-only terminator check.
  3. A classic `RegExp.lastIndex`-reset gotcha: after a global regex's final failed `exec()` call, `lastIndex` resets to 0, so the sentence splitter's "remainder" slice was reading from the start of the string again, duplicating already-processed content — fixed by tracking the last successful match's end position manually instead of trusting `lastIndex` post-loop.
- **Integration test (real, not mocked):** started the dev server, `POST /api/presentations` with the real Coordinator/Sub-Agents script → job returned `pending` with the correctly-parsed 8-page outline → ran the real MCP chain (`request-outline-review` → user-approved → `generate-design-structured` → `create-design-from-candidate`) → design `DAHPMbFhUJE` (11 pages, candidate selection picked the closest page-count match, none were an exact 8) → `npm run complete-job` wrote back `{ status: "done", design_id, edit_url, view_url }` → `GET /api/presentations/:id` confirmed `status: "done"` → `get-design` independently confirmed the design is real and live.

## Last Updated

2026-07-12
