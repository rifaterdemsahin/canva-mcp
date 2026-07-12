# 🎯 Problem Statement

> **Stage 1: Real Unknown** — Clearly define the pain point, gap, or opportunity before starting.

---

## 🔍 Core Problem / Pain Point
*Describe the primary problem you are trying to solve. What is broken, inefficient, or missing?*

- **Current State:** Preparing Canva design work (briefs, brand assets) is manual — designers copy requirements between chat tools, docs, and Canva, and asset uploads are staged by hand.
- **Ideal State:** An AI assistant connected over MCP generates structured design briefs and asset manifests directly from conversation, feeding the Canva CLI MCP for real uploads.
- **The Gap:** The native `@canva/cli` MCP server exposes Canva APIs but has no workspace-assistant tooling (brief generation, asset staging manifests) — this PoC fills that gap with custom MCP tools.

## 👥 Target Audience & Stakeholders
*Who is experiencing this pain point? Who will benefit from the solution?*

- **Primary User:** Designers and design-ops engineers who drive Canva workflows from MCP hosts (Claude Desktop, Cursor, VS Code).
- **Secondary Stakeholders:** Clients receiving faster, more consistent design briefs; developers extending the Canva MCP ecosystem.

## 💡 Proposed Value Proposition
*How does solving this problem add value? What are the high-level benefits?*

- Structured `generate_design_brief` output means every engagement starts from a consistent Canva Design Kit brief.
- `stage_assets` manifests make asset ingestion scriptable and verifiable against the Canva Assets API schema.
- Running both the native Canva CLI MCP and custom tools side-by-side proves an extension pattern others can reuse.

## 🚀 Constraints & Scope Boundaries
*What is explicitly out of scope or a known constraint for this problem definition?*

- PoC only — no production hardening, rate limiting, or multi-tenant auth.
- Secrets must come from the existing Azure Key Vault `dp-kv-deliverypilot` (no new vaults).
- Actual end-to-end upload to Canva (`POST /v1/brand-assets`) is a later milestone, not part of the initial PoC.
