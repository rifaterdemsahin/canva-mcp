# Coordinator & Sub-Agents Comic Presentation — End-to-End Flow

> **Stage 7: Testing Known** — Documents how the "AI Agent Architecture — The Coordinator & Sub-Agents" comic-panel presentation was built from a user-supplied voiceover script, entirely from the CLI via the claude.ai Canva MCP. Same generate-first pattern as SPEC-016/SPEC-017, applied to narrative/comic content instead of abstract architecture shapes.

**Design:** `DAHPMBtuFyw` — edit: https://www.canva.com/d/m5dF9rMq1M-dhX7 · view: https://www.canva.com/d/T-5Bf8CYUStCsTs (9 pages, 1920×1080)

---

## Input: the voiceover script

The user supplied a 3-act voiceover script (not a slide outline):

- **Act 1 — Problem:** 4 numbered comic panels. An orange Coordinator robot instructs blue sub-agent robots; Sub-Agent A (teal/blue) codes and tests; Sub-Agent B works in isolation on database migrations; both hand completed work back to the Coordinator. Ends with a foreshadowed bottleneck (manual coordination of separate files and bloated instructions).
- **Act 2 — Solution:** The Coordinator is overwhelmed by towering, unorganized data (coding standards, PR checklists, migration scripts). Naive concatenation into one giant file produces a chaotic pile (marked with a red X). The Coordinator devises a plan: separate universal primitives from task-specific workflows.
- **Act 3 — Lesson:** Divide and conquer — universal standards stay in the core `CLAUDE.md`; task-specific operational workflows (PR reviews, migrations, deployments) move to dedicated, on-demand Skills.

## How the script became a slide outline

The voiceover prose was restructured into a `request-outline-review` page array — one page per narrative beat, preserving every explicit "Panel N" from Act 1 as its own slide so the comic-panel structure survives into the deck:

1. Title — "The Coordinator & Sub-Agents" / subtitle "An AI Agent Architecture Story in 3 Acts"
2. Act 1 — The Problem (scene-setting)
3. Panel 1 — Kickoff ("Let's build! Follow all instructions!")
4. Panel 2 — Sub-Agent A ("Writing code and running tests!")
5. Panel 3 — Sub-Agent B ("Preparing the database migration scripts!")
6. Panel 4 — Handoff ("Here are our completed tasks!" + bottleneck foreshadowing)
7. Act 2 — The Solution (overwhelmed Coordinator, naive-concatenation failure, architectural plan)
8. Act 3 — The Lesson (divide and conquer, CLAUDE.md vs. on-demand Skills)

Each page description used hyphen-bulleted markdown per the tool's formatting rules, and every panel's dialogue was carried through verbatim as a quoted speech-bubble line so the AI generation had the actual line to render, not a paraphrase.

**Style choice (a deliberate departure from SPEC-016/017's dark `#0B0F19` theme):** `"playful, flat vector illustration, tech mascot robots, comic panel layout with speech bubbles, bright orange and blue accent colors"`. The abstract-shape decks used a dark technical theme because they illustrate system architecture; this deck illustrates a character-driven story, so a lighter, playful, mascot-illustration style was chosen to match the narrative genre. Audience: `educational`. Length: `balanced` (5–15 slides), since the script's 8 explicit beats exceed the `short` (1–5) tier used for SPEC-016/017.

## Tool chain

```
request-outline-review (8 pages, script-derived)
    │
    ▼
User reviewed the outline widget and approved ("complete it")
    │
    ▼
generate-design-structured (presentation)
    │   First attempt timed out (8-slide "balanced" generations take
    │   noticeably longer per-slide than "short" — the tool itself warns
    │   extra slides add significant latency). Retried with identical
    │   parameters; succeeded on the second call.
    ▼
4 candidates returned, page counts: 9, 4, 10, 9
    │   None matched the 8-page outline exactly. Candidate selection used
    │   the same heuristic as SPEC-016/017 (closest page count to the
    │   approved outline), picking a 9-page candidate over the 4-page
    │   (likely panel-merging, losing story granularity) or 10-page
    │   (likely over-splitting) options — 9 most plausibly means one
    │   content-dense slide (Act 2) was split in two while all 4 named
    │   panels stayed intact.
    ▼
create-design-from-candidate ──► design DAHPMBtuFyw (9 pages)
    │
    ▼
get-design-pages + get-design ──► verified page count and pulled the
                                    title-slide thumbnail for review
```

No editing transaction was run for this deck — unlike SPEC-016/017, there were no specific header-formatting or shape-placement requirements in this request, so the AI-generated layout was accepted as-is.

## Capability note (consistent with prior specs)

This is the same `request-outline-review` → `generate-design-structured` → `create-design-from-candidate` pattern used for every AI-generated deck in this project (SPEC-015/016/017). No new Canva capability was required or discovered here — the interesting part of this task was **script-to-outline translation** (turning prose with embedded dialogue and scene directions into discrete, generation-ready slide descriptions), not a new MCP capability.

## Verification

- `create-design-from-candidate` returned `page_count: 9`, matching `get-design-pages`' 9 returned page entries.
- `get-design`'s `updated_at` (1783872429) is later than `created_at` (1783872424), consistent with the design being fully materialized.
- Title-slide thumbnail pulled and shown to the user for visual confirmation.

## Related

- Sibling flow docs (same pattern, different content genre): [`canva_lower_third_flow.md`](canva_lower_third_flow.md), [`architecture_course_shape_deck_flow.md`](architecture_course_shape_deck_flow.md)
- Style/genre decision rationale is captured above rather than in a separate spec — this task was a content-generation exercise using existing, already-specced tool capabilities (SPEC-015), not a new capability gate.

## Last Updated

2026-07-12
