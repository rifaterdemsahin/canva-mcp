# Canva MCP Simulation — Image Prompts

> **Stage 3: Simulation** — Prompts used to generate visual mockups and architecture diagrams for the Canva MCP project.

---

## Active Prompts

### 1. Canva MCP Architecture Flow (`canva_mcp_architecture_flow.png`)
- **Asset Name:** `canva_mcp_architecture_flow.png`
- **Target:** Architecture diagram showing two MCP servers (native CLI + custom) connected to a single MCP host
- **AI Generator:** Midjourney v6 / DALL-E 3
- **Prompt:**
  ```text
  Architecture diagram showing two MCP servers connected to a single MCP host application. Left side: MCP Host (Claude/Kilo/Cursor), center: two parallel boxes labeled "Canva CLI MCP (native, 11 tools)" and "Workspace Assistant MCP (custom, 2 tools)", right: Canva cloud API. Clean dark mode, neon teal and purple connections, glassmorphism server nodes, no device frame --ar 16:9
  ```
- **Generated Date:** 2026-07-12
- **Linked Asset:** [canva_mcp_architecture_flow.png](canva_mcp_architecture_flow.png)
- **Status:** Pending generation

### 2. Canva OAuth Flow (`canva_oauth_flow.png`)
- **Asset Name:** `canva_oauth_flow.png`
- **Target:** OAuth sequence diagram — user authenticates `info@pexabo.com` through Canva connector
- **AI Generator:** Midjourney v6 / DALL-E 3
- **Prompt:**
  ```text
  OAuth sequence diagram showing authentication flow. User → MCP Host → Canva OAuth page → Browser login as info@pexabo.com → token back to MCP host. Dark mode UI, neon teal arrows, purple authentication nodes, glassmorphism panels, no device frame --ar 16:9
  ```
- **Generated Date:** 2026-07-12
- **Linked Asset:** [canva_oauth_flow.png](canva_oauth_flow.png)
- **Status:** Pending generation

### 3. Canva Tool List (`canva_tool_list.png`)
- **Asset Name:** `canva_tool_list.png`
- **Target:** Side-by-side comparison of tools from native vs custom MCP servers
- **AI Generator:** Midjourney v6 / DALL-E 3
- **Prompt:**
  ```text
  Split screen UI showing two lists of MCP tools side by side. Left panel: "Canva CLI MCP" with 11 tool names (Connect docs, Apps SDK docs, UI Kit catalog, etc.). Right panel: "Workspace Assistant" with 2 tool names (generate_design_brief, stage_assets). Dark mode, neon teal accents, glassmorphism cards, terminal aesthetic, no device frame --ar 16:9
  ```
- **Generated Date:** 2026-07-12
- **Linked Asset:** [canva_tool_list.png](canva_tool_list.png)
- **Status:** Pending generation

---

## Guidelines for Image Generation
1. **No Device Frames:** Always request raw UI without laptop/phone/tablet frames
2. **Aspect Ratios:** Desktop diagrams use `--ar 16:9`; mobile `--ar 9:16`
3. **Consistency:** Use dark mode, neon teal `#00d4aa` + purple `#8b5cf6`, glassmorphism across all assets
4. **Mermaid-style:** Architecture/flow diagrams should read like Mermaid sequence or flow diagrams rendered as PNGs
