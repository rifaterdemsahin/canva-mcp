# Design Workflow — Canva MCP Connection

> **Stage 3: Simulation** — Visual designs for the Canva MCP connection architecture, OAuth flow, and two-server setup. This file documents the design-first workflow.

## Canva MCP Architecture

The project runs **two MCP servers side-by-side** from the same host:

| Server | Purpose | How to start |
|--------|---------|-------------|
| **canva-cli** (native) | 11 Canva tools (search designs, create designs, export, docs) | `npx @canva/cli@latest mcp` |
| **canva-custom-tools** (custom) | `generate_design_brief` + `stage_assets` | `node 5_Symbols/mcp-server/dist/index.js` |

Both are driven over stdio from the same MCP config. The user authenticates as `info@pexabo.com` via OAuth through the Canva connector.

## Connection Paths

### 1. claude.ai Canva connector — OAuth via browser
Each MCP host (Claude Code, Kilo, Cursor, etc.) authenticates independently via Canva's OAuth flow. The token is cached locally per machine.

### 2. Native Canva CLI — `npx @canva/cli@latest mcp`
Already runs and answers `tools/list` with 11 tools. ✅ Verified 2026-07-12.

### 3. Custom workspace-assistant — `node 5_Symbols/mcp-server/dist/index.js`
Already runs and answers `tools/list` with 2 custom tools. ✅ Verified 2026-07-12 (e2e 4/4).

## Design Workflow Checklist

- [x] **TSK-008** — Set OKR: Canva MCP on for `info@pexabo.com` (Real Agent)
- [x] **TSK-014** — Create project menu + implementation pages (Symbols Agent)
- [x] **TSK-015** — Custom MCP server e2e test 4/4 (Test Agent)
- [x] **TSK-016** — Native Canva CLI MCP `initialize` + `tools/list` (Test Agent)
- [x] **TSK-017** — Claude Canva connector OAuth as `info@pexabo.com` (User action)
- [ ] **TSK-009** — Wire `stage_assets` upload to Canva API (Symbols Agent)
- [x] **TSK-010** — Real Canva app credentials in Key Vault (Environment Agent) ✅
- [ ] **TSK-018** — Validate `stage_assets` against Canva schema (Test Agent)

## Simulation Assets

```
3_Simulation/
├── canva_oauth_01_access_restricted.jpg     # Admin restriction blocks OAuth
├── canva_oauth_02_admin_apps_integrations.jpg # Admin settings page
├── canva_oauth_03_allow_canva_ai_connector.jpg # Whitelist the connector
├── canva_oauth_04_consent_allow.jpg         # Allow button active after fix
├── canva_oauth_05_auth_landing.jpg          # auth.html start page
├── canva_oauth_06_consent_granted.jpg       # Scopes approved
├── canva_oauth_07_auth_code_callback.jpg    # PKCE auth code received
├── canva_mcp_architecture_flow.png          # Two-server architecture diagram (pending)
├── canva_tool_list.png                      # Side-by-side tool list (pending)
├── agentic_workflow.svg                     # Agent workflow diagram
└── image_prompts.md                         # Screenshot & prompt documentation
```

## Design Guidelines

- Dark mode, glassmorphism panels, neon teal + purple accents
- No device frames — request raw UI from AI generators
- Diagrams use Mermaid-style flow notation in PNG form
- Move obsolete designs to `_obsolete/`

## Integration with Specs

| Design File | Spec Reference |
|-------------|---------------|
| `canva_oauth_01`–`07` (screenshots) | `SPEC-012` — Canva OAuth PKCE Flow |
| `canva_mcp_architecture_flow.png` | `SPEC-008` — MCP server lifecycle |
| `canva_tool_list.png` | `SPEC-009` — Custom tool spec |
