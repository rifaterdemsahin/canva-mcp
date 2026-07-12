# 🏆 Objectives and Key Results (OKRs)

> **Stage 1: Real Unknown** — Define measurable and time-bound goals for the project. Owned by the **Real Agent**; validated by the **Test Agent** in Stage 7.

---

## 🎯 Objective 1: Turn on the Canva MCP for the Pexabo workspace and use it for real work
*The Canva MCP runs connected to the `info@pexabo.com` Canva account and serves design workflows from MCP hosts.*

- **KR 1.1:** Canva MCP authenticated against the `info@pexabo.com` account — connection verified by a successful live tool call (e.g., listing designs) ✅ Claude connected; Kilo/DeepSeek MCP config added to `kilo.json`; OAuth PKCE flow completed — access token obtained ✅
- **KR 1.2:** Native `@canva/cli` MCP server (`npm run mcp`) starts and answers `tools/list` — 100% of runs
- **KR 1.3:** Custom workspace-assistant server answers `initialize` + `tools/list` + `tools/call` over stdio with both custom tools — verified by the automated e2e check ✅ (see `7_Testing_Known/validation_report.md`)
- **KR 1.4:** Canva app credentials for Pexabo stored in Key Vault `dp-kv-deliverypilot` (`canva-mcp-CANVA-CLIENT-ID=OC-AZ9VpNJiU0ps` / `-SECRET`) with real values — no secrets in git ✅

## 🎯 Objective 2: Publish the project site with a project menu and implementation pages
*Visitors can follow how the Canva MCP is used, from the live GitHub Pages site.*

- **KR 2.1:** Project menu links to the implementation pages (Implementation, Canva Connection, MCP Server code guide, OKRs) — every link resolves ✅
- **KR 2.2:** Implementation pages document the end-to-end flow: account → auth → MCP host config → tool calls
- **KR 2.3:** Smoke test suite passes 10/10 locally and 11/11 against the deployed site on every push

## 🎯 Objective 3: Prove the custom Canva workspace-assistant tools end-to-end
*Custom MCP tools augment the native Canva MCP.*

- **KR 3.1:** `generate_design_brief` returns a well-formed Canva Design Kit brief for structured input
- **KR 3.2:** `stage_assets` returns a JSON manifest that validates against Canva's `POST /v1/brand-assets` schema
- **KR 3.3:** A staged asset manifest is uploaded to Canva through the authenticated MCP (end-to-end sync)

## 🎯 Objective 4: Create a multimedia document using MCP tools
*An MCP tool chain can produce a Canva document that contains both video and image elements, demonstrating rich-media design automation.*

- **KR 4.1:** `create_video_document` MCP tool creates a Canva design with a video-capable preset type (e.g. Instagram Reel, TikTok, YouTube Thumbnail) — design ID and edit URL returned
- **KR 4.2:** `add_image_elements` MCP tool adds one or more image elements to an existing Canva design, accepting a design ID and image URLs — elements verified present in the design

## 🎯 Objective 5: Create a new presentation from the CLI with an animated lower third (Retry) ✅
*The CLI session (claude.ai Canva MCP in Claude Code) creates a brand-new presentation and delivers a lower-third text with fade-in — retrying the flow that previously ended in a manual Apps SDK step.*

> **✅ Delivered 2026-07-12 — user-confirmed.** How it worked and the test of the outputs are specified in **[SPEC-015 → `4_Formula/lower_third_mcp_spec.md`](../4_Formula/lower_third_mcp_spec.md)** (tool chain, lower-third formula, 7-point evidence table). Flow narrative: [`7_Testing_Known/canva_lower_third_flow.md`](../7_Testing_Known/canva_lower_third_flow.md); logic chain row 5 in [`7_Testing_Known/logic.md`](../7_Testing_Known/logic.md).

- **KR 5.1:** A new presentation is created entirely from the CLI via the Canva MCP (`request-outline-review` → `generate-design-structured`) — design ID and edit URL returned ✅ design `DAHPLnGsNgc` ("Presentation - Tuncer Karaarslan"), edit URL https://www.canva.com/d/hf5wrKoK43CfXHi
- **KR 5.2:** Lower-third text "tuncer karaarslan" is present in the design and positioned in the bottom band of the slide via MCP editing operations (`position_element` / `resize_element` / `format_text`) — verified by element coordinates in the editing transaction ✅ element at top 930 / left 384 / width 1152 on a 1920×1080 page, transaction committed
- **KR 5.3:** Fade-in animation: applied programmatically if any MCP/API path exists; if none exists, the capability boundary is confirmed via Canva's official Help tool and documented with the exact manual steps (accepted limitation, tracked in `7_Testing_Known/logic.md`) ✅ Canva Help confirmed: animations are editor-only — select element → **Animate** → **Fade** → **On enter**

## 🎯 Objective 6: Build a 5-slide "Claude AI Architecture" course deck with per-slide shape motifs ✅
*The CLI session creates a dark-theme (`#0B0F19`) presentation, one architectural shape (Shield/Hexagon/Cylinder/Octagon) per content slide, entirely via the Canva MCP.*

> **✅ Delivered 2026-07-12** as design `DAHPLyS5QQk` ("Presentation - Claude AI Architecture"), edit URL https://www.canva.com/d/4gyIYtFyKOp-xjO. Full plan, the discovered capability gap, and the user-confirmed approach are in **[SPEC-016 → `4_Formula/architecture_course_mcp_spec.md`](../4_Formula/architecture_course_mcp_spec.md)**. Logic chain row 6 in [`7_Testing_Known/logic.md`](../7_Testing_Known/logic.md).

- **KR 6.1:** 5-slide outline approved via `request-outline-review` and generated via `generate-design-structured` ✅ design `DAHPLyS5QQk`, 5 pages, edit URL above (Canva pages have no settable "name" field via MCP — slide labels `00_Title_Slide`…`04_Tools_Router_Octagon` are documentation-only, tracked in the spec's slide map)
- **KR 6.2:** Each of the 4 shape motifs (shield/hexagon/cylinder/octagon) present on its own slide in the specified color ✅ delivered via user-chosen "best-effort AI layout only" (shape + color baked into the outline description text, rendered natively by Canva's design AI) — **not** via generated icon image + `insert_fill`, since no native shape-insert op exists (capability gap confirmed in SPEC-016) and the user opted for native-but-non-deterministic rendering over deterministic raster images
- **KR 6.3:** Each slide header formatted to spec (28px bold, specified color, specified alignment) via `format_text`, transaction committed ✅ all 4 `format_text` ops succeeded; "column" placement approximated via text alignment (start/center/end) rather than frame relocation, to avoid overlapping the AI-generated artwork
- **KR 6.4:** Layout verified via `get-design` (`updated_at` 1783870762 > `created_at` 1783870697) with thumbnails + edit URL rendered for review ✅; manual connector steps (Elements → L → snap) communicated to the user as an accepted limitation, not a bug

## 🎯 Objective 7: Reusable native shape components for the Claude AI Architect course (SPEC-017)
*A Canva App delivers true native, editable shape elements (not AI-interpreted layout, not raster images) that the user can drop into any course deck — closing the gap SPEC-016 accepted as a tradeoff.*

> **Status:** Code delivered 2026-07-12; KR 7.3 needs the user's manual verification pass (no CLI/API path exists to click an app's button from outside the editor). Full plan in **[SPEC-017 → `4_Formula/architecture_components_app_spec.md`](../4_Formula/architecture_components_app_spec.md)**.

- **KR 7.1:** A demo presentation showcasing the 4 reusable components (Shield/Hexagon/Cylinder/Octagon) is created via the CLI Canva MCP and opened for the user — design ID and edit URL returned ✅ design `DAHPLyaJNJ8`, edit URL https://www.canva.com/d/NzrcdLRkdh4dT1k
- **KR 7.2:** The existing `lower-third-text` Canva App is extended with 4 native-shape insert buttons (`addElementAtPoint({ type: "shape" })`), each with hand-authored SVG paths and the exact course hex colors — reused rather than duplicated, per SPEC-014's app scaffold ✅ shipped, typechecked clean against `@canva/design`'s actual type declarations
- **KR 7.3:** User confirms each shape renders correctly as a native, editable Canva element after manually previewing the app and clicking each button on the demo deck — ⏳ pending (manual steps documented in SPEC-017)

## 🎯 Objective 8: Voiceover-to-Presentation API (SPEC-018) ✅
*A reusable local API turns { title, voiceover } into a queued Canva-generation job, generalizing the manual process used for the Coordinator/Sub-Agents comic deck.*

> **✅ Delivered 2026-07-12** — `5_Symbols/presentation-api/`, live-verified end-to-end with design `DAHPMbFhUJE`. Full plan + test evidence in **[SPEC-018 → `4_Formula/voiceover_presentation_api_spec.md`](../4_Formula/voiceover_presentation_api_spec.md)**.

- **KR 8.1:** `POST /api/presentations { title, voiceover }` deterministically parses the voiceover into a `request-outline-review`-ready outline (Act/Panel headings, quoted dialogue) and returns a `pending` job immediately ✅ verified live against the real Coordinator/Sub-Agents script
- **KR 8.2:** An executor (agent-run, not the API process itself — Canva's AI design generation is MCP-connector-exclusive) services pending jobs via the real MCP tool chain and writes back `design_id`/`edit_url` ✅ `npm run complete-job` CLI, exercised live
- **KR 8.3:** `GET /api/presentations/:job_id` returns job status/result; parser has unit tests reproducing the comic-deck's 8-section breakdown ✅ 11/11 unit tests passing (3 real bugs found and fixed by the tests before shipping — see SPEC-018 verification section)
- **KR 8.4:** One live end-to-end run produces a real Canva design, verified via `get-design` ✅ design `DAHPMbFhUJE`, 11 pages, edit URL https://www.canva.com/d/koayZBYCG9Sqbwi

---

## 🧪 Outcome Tracking & Validation
*How and when will these Key Results be evaluated? (Links back to Stage 7)*
- Final validation checklist is located in [7_Testing_Known/README.md](../7_Testing_Known/README.md)
- Live-connection evidence is recorded in [7_Testing_Known/validation_report.md](../7_Testing_Known/validation_report.md)
