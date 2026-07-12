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

---

## 🧪 Outcome Tracking & Validation
*How and when will these Key Results be evaluated? (Links back to Stage 7)*
- Final validation checklist is located in [7_Testing_Known/README.md](../7_Testing_Known/README.md)
- Live-connection evidence is recorded in [7_Testing_Known/validation_report.md](../7_Testing_Known/validation_report.md)
