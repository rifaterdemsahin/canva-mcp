# Claude AI Architecture Course Deck — End-to-End Flow

> **Stage 7: Testing Known** — Documents the complete multi-stage flow for building the 5-slide "Claude AI Architecture" course deck (shield/hexagon/cylinder/octagon shape motifs on a dark theme) entirely from the CLI via the claude.ai Canva MCP. Captures what each stage contributed, the capability boundary discovered, the decision the user made about it, and the final working approach. **User-confirmed working:** https://www.canva.com/design/DAHPLyS5QQk/CzMe-9NYGmFZxzuaSXrlrw/edit

---

## Flow Overview

```
User Request: "Create a 5-slide Canva presentation — dark theme #0B0F19, one named
                shape motif per slide (Shield/Hexagon/Cylinder/Octagon), styled
                headers, verified layout, reminder of manual connector steps"
    │
    ▼
1_Real_Unknown ──► Objective 6 (KR 6.1–6.4) added to okrs.md; Phase 6 tasks (TSK-027…032)
    │
    ▼
2_Environment ──► Re-pulled live MCP tool schemas (not assumed from memory):
    │               perform-editing-operations op set unchanged from SPEC-015 —
    │               NO shape-insert op, NO connector/line op. insert_fill only
    │               takes pre-uploaded image/video assets, not vector shapes.
    │
    ▼
4_Formula ──► SPEC-016: documented the gap, presented 3 options to the user
    │           (generate+insert icon images / best-effort AI layout only /
    │           pause for manual shapes). User chose: best-effort AI layout only.
    │           Thinking log entry written BEFORE any write call (planning gate).
    │
    ▼
Execution (Symbols Agent tool chain) ──► request-outline-review → user approved
    │                                     → generate-design-structured (4 candidates)
    │                                     → create-design-from-candidate (best match)
    │                                     → design DAHPLyS5QQk (5 pages)
    │                                     → start-editing-transaction
    │                                     → perform-editing-operations (4× format_text)
    │                                     → commit-editing-transaction
    │
    ▼
7_Testing_Known ──► get-design (updated_at bumped) + 5 page thumbnails shown to user
    │                 → user opened the design and confirmed it works
    │                 → this document + logic.md row 6
    │
    ▼
6_Semblance ──► Retrospective appended to lessons_learned.md (no errors — clean flow)
```

---

## Stage-by-Stage Detail

### Stage 1 — Real Unknown (Task Reception)

**Input:** Build a 5-slide outline with `request-outline-review`. Dark technical background theme `#0B0F19`. One shape motif per content slide: `01_User_Proxy_Shield` (cyan shield), `02_Claude_LLM_Hexagon` (purple dual-hexagon), `03_Memory_Bank_Cylinder` (emerald 3D cylinder), `04_Tools_Router_Octagon` (amber octagon). Each with a specific styled, positioned header. Verify with `get-design`, and remind the user of the manual connector steps.

**Objective 6** (KR 6.1–6.4) and **Phase 6** (TSK-027…032) recorded before any tool call, per the framework's planning gate.

### Stage 2 — Environment (Capability Discovery)

Re-pulled (not assumed) the live tool schemas for `request-outline-review`, `generate-design-structured`, `start-editing-transaction`, `perform-editing-operations`, `commit-editing-transaction`, `upload-asset-from-url`, `get-design`.

| Capability | Supported via MCP? | Notes |
|-----------|--------------------|-------|
| Generate a themed presentation from an outline | ✅ | `request-outline-review` → `generate-design-structured` |
| Insert a native vector shape (Shield/Hexagon/etc.) | ❌ | No such op exists in `perform-editing-operations` |
| Insert an image/video asset | ✅ | `insert_fill` — but only pre-uploaded media, not a vector shape object |
| Reposition/resize/format existing elements | ✅ | `position_element`, `resize_element`, `format_text` |
| Draw a connector/line between elements | ❌ | No such op exists anywhere in the tool set |

This matches (and re-confirms) the exact boundary already recorded in SPEC-014/015 — a stable platform limitation, not a one-off gap. Later cross-checked against Canva's public MCP docs (`canva.dev/docs/mcp/tools/`), which independently confirm the same ~32-tool surface has no shape/connector primitives. See `2_Environment/canva_capability_research.md` for the full external research, including the one real workaround that does exist (Apps SDK native shapes via `addElementAtPoint({ type: "shape", ... })`) — not used here because it reintroduces the Apps SDK/dev-server/Developer-Portal phase SPEC-015 was built to eliminate.

### Stage 4 — Formula (Specs & Decision)

**SPEC-016** (`4_Formula/architecture_course_mcp_spec.md`) documented the gap and three options. Presented directly to the user via a structured question rather than silently picking one:

1. Generate + insert icon images (`image-generation` skill → `upload-asset-from-url` → `insert_fill`) — deterministic shapes/colors, but raster, not native.
2. **Best-effort AI layout only** — describe the shape + exact hex color in the outline text, let Canva's design AI render it as a native element. No fidelity guarantee.
3. Pause — ship named slides + dark theme + headers only, user adds shapes manually.

**User chose option 2.** Accepted tradeoff: native/editable output, no guarantee the AI renders *exactly* "a double-border rounded shield" (in practice it did render a clean, on-theme cyan shield — see thumbnail below).

Editing-transaction scope was narrowed accordingly: only header formatting (`format_text`) was needed post-generation — no `insert_fill`/`upload-asset-from-url` calls were made in this run.

### Stage 5 — Symbols (Tool-Chain Execution)

No new source code was written for this task (unlike SPEC-014's Canva App) — the entire deliverable is a Canva MCP tool chain run directly in the CLI session:

1. **`request-outline-review`** — 5 pages, each description embedding the shape motif, exact hex color, and `#0B0F19` background; deck-wide style set to `"dark technical background #0B0F19, geometric line-art icons, neon accent colors, minimal sci-fi architecture-diagram aesthetic"`, audience `educational`.
2. User reviewed the outline widget and approved it ("complete it").
3. **`generate-design-structured`** — returned 4 design candidates. Candidate 1 was selected because it had exactly 5 page thumbnails matching the approved 5-page outline (the other 3 candidates returned 6 thumbnails, implying an AI-inserted extra slide, which would have drifted from spec).
4. **`create-design-from-candidate`** — produced design `DAHPLyS5QQk` ("Presentation - Claude AI Architecture"), 5 pages, 1920×1080.
5. **`start-editing-transaction`** — enumerated every text/shape/fill element across all 5 pages via the returned `richtexts`/`fills` arrays, and located the 4 header text elements by matching their text content ("User Proxy Node", "LLM Engine Core", "Context Window & Cache", "MCP Tools Router").
6. **`perform-editing-operations`** — one batched call, 4× `format_text`:
   - "User Proxy Node" → 28px, bold, `#06B6D4`, `text_align: start` (already left-positioned by the AI layout — left column, no move needed)
   - "LLM Engine Core" → 28px, bold, `#A855F7`, `text_align: center`
   - "Context Window & Cache" → 28px, bold, `#10B981`, `text_align: end` (approximates "right-hand column" via alignment, since the AI layout puts a full-height background graphic across roughly the right two-thirds of slides 3–5 — physically relocating the header frame there via `position_element` would have overlapped the artwork and separated the header from its body copy below)
   - "MCP Tools Router" → 28px, bold, `#F59E0B`, `text_align: center`

   All 4 operations reported `"status": "success"`.
7. **`commit-editing-transaction`** — succeeded.

### Stage 6 — Semblance (Errors & Fixes)

No errors encountered — clean flow from outline to commit. Retrospective appended to `6_Semblance/lessons_learned.md` covering: why upfront schema-scanning beats mid-execution failure, why presenting concrete options beats silent substitution, and the "don't fight the AI's chosen grid with `position_element`" lesson for future header-placement tasks.

### Stage 7 — Testing Known (This Document + Validation)

**Design created:**
- Design ID: `DAHPLyS5QQk`
- Title: "Presentation - Claude AI Architecture"
- Type: presentation (5 pages, 1920×1080)
- Edit URL: `https://www.canva.com/design/DAHPLyS5QQk/CzMe-9NYGmFZxzuaSXrlrw/edit` — **user-confirmed working, 2026-07-12**

**Verification performed:**
- `get-design` — `updated_at` (1783870762) confirmed bumped past `created_at` (1783870697), proving the commit landed.
- `get-design-pages` — all 5 page thumbnails rendered and shown to the user before hand-off; slide 2's shield motif came back cyan and clearly legible, matching the `#06B6D4` spec color.

**Remaining manual step for the user (unchanged capability boundary — no MCP/API path exists):**
1. Open the design in the Canva editor.
2. Select **Elements** → press **L** for the line tool.
3. Draw lines, letting endpoints **snap** to the shapes/text boxes on each slide to connect the AI data-pipeline flow across slides 2–5.

---

## Capability Boundaries — Key Learnings

| Layer | What It Does | What It Can't Do |
|-------|--------------|-------------------|
| claude.ai Canva MCP (`request-outline-review` → `generate-design-structured`) | Generate a themed multi-slide design from text, including AI-interpreted shapes/colors | Guarantee a *specific* shape primitive renders exactly as described |
| claude.ai Canva MCP (editing transactions) | Reposition/resize/format existing elements; insert pre-uploaded image/video media | Insert a native vector shape; draw a connector/line between elements |
| Canva Apps SDK (`addElementAtPoint`, not used here) | Insert a *true* native vector shape (`type: "shape"`, SVG paths, exact hex fill) | Requires a full custom-App phase (scaffold, dev server, Developer Portal) — the exact overhead SPEC-015/016 avoided |
| Canva Editor (manual) | Everything — shapes, connectors, animations | Programmatic access |

**The gap (reconfirmed, third time — SPEC-014, SPEC-015, SPEC-016):** No Canva MCP surface can insert a native shape or connector element. The only programmatic path to a true native shape is the Apps SDK, which reintroduces the manual dev-server/portal overhead this MCP-first approach was built to eliminate. See `2_Environment/canva_capability_research.md` for the concrete Apps SDK shape-object spec if a future task needs deterministic shape fidelity badly enough to accept that overhead.

---

## Related

- SPEC-016: [`4_Formula/architecture_course_mcp_spec.md`](../4_Formula/architecture_course_mcp_spec.md)
- Objective 6: [`1_Real_Unknown/okrs.md`](../1_Real_Unknown/okrs.md)
- Phase 6 tasks: [`1_Real_Unknown/tasks.md`](../1_Real_Unknown/tasks.md)
- Logic chain row 6: [`7_Testing_Known/logic.md`](logic.md)
- Thinking log: [`4_Formula/llm_thinking_log.md`](../4_Formula/llm_thinking_log.md) (2026-07-12 — "Claude AI Architecture Course Deck (SPEC-016, planning gate)")
- External capability research: [`2_Environment/canva_capability_research.md`](../2_Environment/canva_capability_research.md)
- Retrospective: [`6_Semblance/lessons_learned.md`](../6_Semblance/lessons_learned.md)
