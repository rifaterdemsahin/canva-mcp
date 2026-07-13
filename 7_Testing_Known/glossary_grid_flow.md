# Icon-Grid Glossary Page — End-to-End Flow

> **Stage 7: Testing Known** — Documents the complete flow for turning a flat list of terms into a single "icon above label" grid page via the claude.ai Canva MCP, verified against the Glossary/Key Terms section of the `q1-multi-agent-research-...` video design (`DAHOxcN-Gx4`). **User-confirmed working:** https://www.canva.com/d/4eIJpk0QmO0T12d (design `DAHPQbzFdP8`)

---

## Flow Overview

```
User Request: "Create a new page and place Glossary/Key Terms graphics on it,
                with a label under each graphic"
    │
    ▼
Clarify ──► AskUserQuestion: graphic source (Canva stock icons vs AI-generated),
    │        layout (4-col grid vs grouped-by-category), brand kit (none)
    │
    ▼
Attempt 1 ──► generate-design(design_type: infographic) ──► 4 candidates
    │          Picked candidate 3 → create-design-from-candidate → get-design-content
    │          [GAP] Content was a generic "stats + quote" template, NOT the 14 terms
    │          (fake percentages, an attributed quote, "3 types of agents" filler)
    │
    ▼
Attempt 2 ──► generate-design(infographic, heavier negative-constraint prompt)
    │          [GAP] Generation FAILED outright ("design_generation_error")
    │
    ▼
Attempt 3 ──► generate-design(design_type: poster) ──► 4 candidates
    │          Screened candidate 1: create-design-from-candidate → get-design-content
    │            → 3 duplicate labels, 1 garbled label, 1 term missing entirely
    │          Screened candidate 2: → wrong template entirely (event/registration poster)
    │          Screened candidate 3: → clean grid, only 1 duplicate label (1 term repeated,
    │            "Coordination" missing) → SELECTED
    │
    ▼
Fix ──► start-editing-transaction(DAHPQbzFdP8) ──► located element_id of the
    │     duplicate label via the transaction's richtexts array
    │     → perform-editing-operations(replace_text: "Coordination")
    │     → shown to user for approval (draft transaction link given)
    │     → user confirmed "this one works"
    │     → commit-editing-transaction
    │
    ▼
7_Testing_Known ──► this document + SPEC-019
    │
    ▼
(Next, pending user go-ahead) ──► resize-design(1920x1080) → merge-designs
                                    (insert_pages, after_page_number: 10) into DAHOxcN-Gx4
```

---

## Stage-by-Stage Detail

### Clarification (before any generation)

Two `AskUserQuestion` calls before spending any generation calls:
1. Graphic source: **Canva stock icon library** (chosen) vs AI-generated custom icons (fal.ai + upload).
2. Layout: **4-column grid** (chosen) vs grouped-by-category with section headers.
3. Brand kit: **none** (chosen) — plain style, resized to match later.

### Attempt 1 — `infographic` design type (failed)

`generate-design(design_type: "infographic", query: <detailed grid + 14 verbatim terms + icon+label instruction>)` returned 4 candidates. `create-design-from-candidate` + `get-design-content` on candidate 3 showed the AI substituted its own "stats/quote" infographic template — a headline paragraph, a quote with an "AI Research Team" attribution, and fabricated stats ("3 Types of agents involved", "5 Average efficiency rating", "1 Total unique models") — none of the 14 term names appeared as labels at all.

**Lesson:** `infographic` as a design type appears to have a strong template prior toward narrative/stats layouts that a literal-list prompt does not reliably override.

### Attempt 2 — `infographic` retry with stronger constraints (failed)

Retried with explicit negative constraints ("NO quotes, NO fake statistics, NO percentages...") and a stricter cell-by-cell spec. The job returned `status: "failed"`, `error.code: "design_generation_error"` — no candidates produced at all.

**Lesson:** over-constraining the infographic prompt didn't fix the template bias and cost a full generation cycle. Switching design type was faster than continuing to fight the same one.

### Attempt 3 — `poster` design type (succeeded, needed screening)

`generate-design(design_type: "poster", ...)` returned 4 candidates. Screened by converting each to an editable design (`create-design-from-candidate`) and reading its actual text (`get-design-content`) **before** describing any option to the user:

| Candidate | Result |
|---|---|
| 1 (`DAHPQWC65CY`) | Real terms present, but 3 duplicate labels, 1 garbled label ("Orchestrating Coinions"), "Reconciling Contradictions" missing entirely |
| 2 (`DAHPQdXYBRc`) | Wrong template — an unrelated event/registration poster ("Registration open until...", a street address, a website) |
| 3 (`DAHPQbzFdP8`) | Clean 4-column icon grid, 14 cells, only 1 duplicate label ("Integrated Research Output" ×2, "Coordination" missing) — **selected** |

**Lesson:** even a successful generation needs per-candidate content verification — thumbnails alone would not have caught the duplicate/garbled/wrong-template issues; only reading the actual text content did.

### Fix — targeted text replacement, not regeneration

Rather than regenerating again (cost: a full new job + re-screening), the single bad label was fixed directly:
1. `start-editing-transaction(DAHPQbzFdP8)` — returned the full `richtexts` array with `element_id` per text run.
2. Matched the duplicate ("Integrated Research Output" at `top: 1123.93, left: 531.645`) to `element_id: PBFgjr18h1yZMpyc-LBqxYb4DJGCnkjWv`.
3. `perform-editing-operations(replace_text, element_id, text: "Coordination")` — draft only, not yet saved.
4. Draft link (`edit_design_url` from the transaction response) shown to the user for review.
5. User confirmed the draft looked correct ("this one works").
6. `commit-editing-transaction` — saved permanently.

### Remaining step (pending user go-ahead, not yet executed)

To land this as a page inside the main video design (`DAHOxcN-Gx4`, currently 10 pages):
1. `resize-design(DAHPQbzFdP8, type: custom, width: 1920, height: 1080)` — the poster generates at a different (taller/narrower) canvas than the video's 1920×1080 pages; must match before insertion.
2. `merge-designs(type: modify_existing_design, design_id: DAHOxcN-Gx4, operations: [{type: insert_pages, source: {type: design, design_id: <resized page design>}, after_page_number: 10}])` — requires a fresh "would you like me to proceed?" confirmation per the tool's own rules (insert-only, not delete, so the exact-phrase confirmation is not required).

---

## Capability Boundaries — Key Learnings

| Layer | What It Does | What It Can't Do |
|-------|--------------|-------------------|
| `generate-design(design_type: infographic)` | Generates a themed infographic from a text query | Reliably render a literal enumerated list as grid cells — defaults to a stats/quote narrative template |
| `generate-design(design_type: poster)` | Reliably renders a literal icon+label grid from an explicit term list | Guarantee zero duplicate/garbled labels, or guarantee the right poster sub-template (event posters are a competing template) |
| `get-design-content` | Reads exact text content of any candidate/design, catching errors thumbnails would miss | Nothing — this is the mandatory verification step, always cheap relative to a bad regeneration |
| `perform-editing-operations` (`replace_text`) | Fixes a specific wrong/duplicate label in place, preserving the correct icon and layout | Insert brand-new text or icon elements — only pre-existing elements can be targeted |
| `resize-design` | Resizes a design to a preset (`presentation`, `whiteboard`) or custom pixel size | Resize to a "video" preset — no such preset exists; custom width/height is required for video canvases |
| `merge-designs` (`insert_pages`) | Appends pages from one design into another at a specific position | Merge individual elements — only whole pages |

---

## Reuse Checklist (for the next term list)

- [ ] Confirm term list, count, and any category groupings with the user
- [ ] Ask: stock icons vs AI-generated icons; grid vs grouped layout; brand kit or not
- [ ] `generate-design(design_type: "poster", ...)` with the verbatim term list and explicit grid dimensions (not `infographic`)
- [ ] For each candidate considered: `create-design-from-candidate` → `get-design-content` → check for duplicates/garbled text/wrong template **before** showing it to the user
- [ ] Fix any single bad label via `start-editing-transaction` → `replace_text` → show draft link → get user approval → `commit-editing-transaction`
- [ ] `resize-design` (custom width/height) to match the target design's existing page size
- [ ] `merge-designs` (`insert_pages`, correct `after_page_number`) — confirm with user first
- [ ] Give the user a direct link at every step (candidates, draft transaction, committed design, final merged design)

---

## Related

- SPEC-019: [`4_Formula/specs.md`](../4_Formula/specs.md)
- CLAUDE.md "Always Share Links" rule (added 2026-07-13 as a direct result of this task)
- Target design: `DAHOxcN-Gx4` ("q1-multi-agent-research-the-web-search-and-document-analysis-agents")
- Generated glossary page: `DAHPQbzFdP8` — https://www.canva.com/d/4eIJpk0QmO0T12d
