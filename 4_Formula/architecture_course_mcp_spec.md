# SPEC-016: Claude AI Architecture Course — Modular Shape Slide Deck via Canva MCP

- **Status:** ✅ Verified (2026-07-12) — delivered as design `DAHPLyS5QQk` ("Presentation - Claude AI Architecture"), edit URL https://www.canva.com/d/4gyIYtFyKOp-xjO
- **Owner:** Formula Agent (plan) → Symbols Agent (tool-chain execution) → Test Agent (verification)
- **Related OKR:** Objective 6 in `1_Real_Unknown/okrs.md`
- **Related Files:** `1_Real_Unknown/tasks.md` (Phase 6), `7_Testing_Known/logic.md`, `4_Formula/llm_thinking_log.md`

## Description

Build a 5-slide Canva presentation ("Claude AI Architecture") entirely from the CLI via the claude.ai Canva MCP connector. Each content slide (2–5) carries one architectural shape motif on a consistent dark technical background (`#0B0F19`), with a styled header. This is a retry of the SPEC-014/SPEC-015 pattern (generate-first, then edit) applied to a multi-shape, multi-slide deck.

## Target Slide Map

| # | Slide name | Shape motif | Color | Header | Header position |
|---|-----------|-------------|-------|--------|------------------|
| 1 | `00_Title_Slide` | — | — | "Claude AI Architecture" / "Visual Asset Blueprint" | title |
| 2 | `01_User_Proxy_Shield` | Double-border rounded shield | Cyan `#06B6D4` | "User Proxy Node" — 28px bold cyan | left column |
| 3 | `02_Claude_LLM_Hexagon` | Concentric dual-hexagon | Purple `#A855F7` | "LLM Engine Core" — 28px bold purple | centered |
| 4 | `03_Memory_Bank_Cylinder` | 3D stacked cylinder | Emerald `#10B981` | "Context Window & Cache" — 28px bold emerald | right column |
| 5 | `04_Tools_Router_Octagon` | Hub-and-spoke octagon | Amber `#F59E0B` | "MCP Tools Router" — 28px bold amber | centered, radiating icons |

## Capability Scan (Environment Agent step, done before drafting this spec)

Tool schemas for the claude.ai Canva MCP connector were re-pulled and inspected directly (`request-outline-review`, `generate-design-structured`, `start-editing-transaction`, `perform-editing-operations`, `commit-editing-transaction`, `upload-asset-from-url`, `get-design`, `get-design-thumbnail`).

`perform-editing-operations` op set (unchanged from SPEC-015): `update_title`, `replace_text`, `update_fill`, `insert_fill`, `delete_element`, `find_and_replace_text`, `position_element`, `resize_element`, `format_text`, `update_autofill_field`.

**[GAP CONFIRMED] There is no operation to inject a native Canva vector shape** (no "Shield", "Hexagon", "Cylinder", "Octagon" primitive, no generic "insert_shape" op). `insert_fill` only accepts `asset_type: "image" | "video"` — i.e. it places an already-uploaded raster/video asset, not a native editable vector shape object. This matches the boundary already recorded in SPEC-015's capability matrix (media in, no shape primitives, no connectors).

**[GAP CONFIRMED] No connector/line-drawing operation exists** — same boundary as anticipated by the user's own point 4. Confirmed again here rather than assumed.

`upload-asset-from-url` requires an **already publicly-accessible HTTPS URL** — it explicitly refuses to be used to publish local/agent-generated files to a public host as a workaround. A fal.ai-hosted generation output URL (produced by the `image-generation` skill) qualifies, since that URL is the tool's own public output, not something manufactured solely to smuggle a private file onto the internet.

## Resolution — Chosen Approach (user-confirmed 2026-07-12)

Presented three options to the user (generate+insert icon images / best-effort AI layout only / pause for manual shapes). **User chose: best-effort AI layout only.**

- No custom shape image generation or `insert_fill` step. The shape motifs (double-border shield, concentric dual-hexagon, 3D stacked cylinder, hub-and-spoke octagon) and their exact hex colors are written directly into each slide's `request-outline-review` description text, and the deck-wide style/background (`#0B0F19` dark technical theme) is passed as the presentation style, so Canva's own design AI interprets and renders them as **native, fully-editable Canva elements**.
- **Accepted tradeoff:** no determinism guarantee that the AI renders exactly "a double-border rounded shield" vs. some other cyan graphic matching the theme/description — this is a known limitation of `generate-design-structured`, explicitly accepted by the user in exchange for native (non-raster) output.
- Editing transaction is still used post-generation for header formatting only: `start-editing-transaction` → locate each header text element → `format_text` (28px, bold, spec color, spec alignment) per slide → `commit-editing-transaction`.
- `upload-asset-from-url` / `insert_fill` are **not used** in this run — retained in the spec as the rejected/deferred alternative in case the AI-only output needs a follow-up retry.

## Known Manual Step (accepted limitation, same class as SPEC-014/015)

Cross-slide connectors/flow lines (data pipeline arrows linking the four architecture nodes) have no MCP/API path. Manual step to hand to the user after the deck is committed:
1. Open the design in the Canva editor.
2. Select **Elements** → press **L** (line tool).
3. Draw lines and let endpoints **snap** to each text box/shape to connect the AI data pipeline flow across slides.

## Verification Plan (Test Agent) — Results

- `get-design` on `DAHPLyS5QQk` — ✅ `updated_at` 1783870762 > `created_at` 1783870697 (bumped after commit).
- `get-design-pages` rendered all 5 page thumbnails for visual review — ✅ all 5 present, shape motifs visible per slide (e.g. slide 2's shield rendered in cyan matching `#06B6D4`).
- Edit URL surfaced to the user: https://www.canva.com/d/4gyIYtFyKOp-xjO — ✅.
- Manual connector steps restated to the user after commit (not a smoke-test failure — documented capability boundary, not a bug) — ✅.

## Delivery Notes (post-execution)

- Outline approved by the user, `generate-design-structured` returned 4 candidates; candidate 1 was selected as it matched the 5-slide spec exactly (other candidates had 6 thumbnails, implying an extra AI-inserted slide).
- Canva does not expose a settable "page name" field via any MCP tool (`get-design-pages` returns index + thumbnail only, no name/label field) — the `00_Title_Slide` … `04_Tools_Router_Octagon` names are a documentation convention for this spec/task tracking, not an actual Canva page property.
- "Column" header positioning (left/right) was approximated via `format_text`'s `text_align` (start/end) rather than `position_element` frame relocation, because the AI-generated layout places a large background graphic across roughly the right two-thirds of slides 3–5; physically moving the header frame into that space would have overlapped the artwork and separated the header from its body text below it.

## Last Updated

2026-07-12
