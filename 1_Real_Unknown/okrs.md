# 🏆 Objectives and Key Results (OKRs)

> **Stage 1: Real Unknown** — Define measurable and time-bound goals for the project.

---

## 🎯 Objective 1: Prove a custom Canva MCP workspace assistant works end-to-end
*Validate that custom MCP tools can augment the native `@canva/cli` MCP server.*

- **KR 1.1:** MCP server starts over stdio and answers `tools/list` with both custom tools — 100% of runs
- **KR 1.2:** `generate_design_brief` returns a well-formed Canva Design Kit brief for structured input
- **KR 1.3:** `stage_assets` returns a JSON manifest that validates against Canva's `POST /v1/brand-assets` schema

---

## 🎯 Objective 2: Deliver the project on the Delivery Pilot 7-stage framework
*Documentation, navigation, and validation follow the template.*

- **KR 2.1:** Smoke test suite (`5_Symbols/toolbox/smoke_test.py`) passes 10/10 locally and in CI
- **KR 2.2:** GitHub Pages site deploys and every menu link resolves
- **KR 2.3:** All secrets are served from the existing Azure Key Vault `dp-kv-deliverypilot` — zero secrets in git history

---

## 🧪 Outcome Tracking & Validation
*How and when will these Key Results be evaluated? (Links back to Stage 7)*
- Final validation checklist is located in [7_Testing_Known/README.md](../7_Testing_Known/README.md)
