# 🏆 Objectives and Key Results (OKRs)

> **Stage 1: Real Unknown** — Define measurable and time-bound goals for the project. Owned by the **Real Agent**; validated by the **Test Agent** in Stage 7.

---

## 🎯 Objective 1: Turn on the Canva MCP for the Pexabo workspace and use it for real work
*The Canva MCP runs connected to the `info@pexabo.com` Canva account and serves design workflows from MCP hosts.*

- **KR 1.1:** Canva MCP authenticated against the `info@pexabo.com` account — connection verified by a successful live tool call (e.g., listing designs) ✳ in progress
- **KR 1.2:** Native `@canva/cli` MCP server (`npm run mcp`) starts and answers `tools/list` — 100% of runs
- **KR 1.3:** Custom workspace-assistant server answers `initialize` + `tools/list` + `tools/call` over stdio with both custom tools — verified by the automated e2e check ✅ (see `7_Testing_Known/validation_report.md`)
- **KR 1.4:** Canva app credentials for Pexabo stored in Key Vault `dp-kv-deliverypilot` (`canva-mcp-CANVA-CLIENT-ID` / `-SECRET`) with real values — no secrets in git

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

---

## 🧪 Outcome Tracking & Validation
*How and when will these Key Results be evaluated? (Links back to Stage 7)*
- Final validation checklist is located in [7_Testing_Known/README.md](../7_Testing_Known/README.md)
- Live-connection evidence is recorded in [7_Testing_Known/validation_report.md](../7_Testing_Known/validation_report.md)
