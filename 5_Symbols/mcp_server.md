# 🎨 Canva MCP Server — Code Guide

> **Stage 5: Symbols** — The TypeScript MCP server implementation in [`5_Symbols/mcp-server/`](mcp-server/).

## What it is

A proof-of-concept MCP (Model Context Protocol) server that augments the `@canva/cli` MCP capabilities with custom workspace-assistant tools for design brief generation and asset staging.

## Layout

```
5_Symbols/mcp-server/
├── src/
│   └── index.ts           # MCP server entry point, tool registration
├── tools/
│   ├── design-brief.ts    # generate_design_brief tool implementation
│   └── asset-stager.ts    # stage_assets tool implementation
├── package.json
├── tsconfig.json
├── mcp-config.json        # Ready-to-use MCP host configuration
└── .env.example           # Environment variable template
```

## Quickstart

```bash
cd 5_Symbols/mcp-server
npm install        # Install dependencies
npm run build      # Build TypeScript → dist/
npm start          # Start the custom MCP server (stdio)
npm run dev        # Development mode with hot-reload
npm run mcp        # Launch the native Canva CLI MCP server
```

## Connecting to MCP Hosts

Copy `mcp-server/mcp-config.json` into your MCP client configuration and set the environment variables:

| Variable | Description | Key Vault secret |
|---|---|---|
| `CANVA_CLIENT_ID` | Canva Developer App Client ID | `canva-mcp-CANVA-CLIENT-ID` |
| `CANVA_CLIENT_SECRET` | Canva Developer App Client Secret | `canva-mcp-CANVA-CLIENT-SECRET` |

Secrets live in the existing Azure Key Vault `dp-kv-deliverypilot` — fetch them with `5_Symbols/toolbox/secrets.sh get <name>` (never commit real values).

- **Cursor:** Settings → Features → MCP Servers → Add new server, paste the `mcpServers` block from `mcp-config.json`.
- **Claude Desktop:** Edit `claude_desktop_config.json` and add the `mcpServers` block.
- **VS Code:** Use the GitHub Copilot Chat MCP configuration or the VS Code MCP extension.

## PoC Checklist

- [x] **MCP Server lifecycle** — Stdio server start, tool list, and tool call handling via `@modelcontextprotocol/sdk`.
- [x] **Custom tool: `generate_design_brief`** — Accepts structured input (client name, description, brand colors, deliverables, tone) and returns a formatted Canva Design Kit brief.
- [x] **Custom tool: `stage_assets`** — Accepts image URLs and returns a JSON asset manifest that can be consumed by the Canva Assets API.
- [ ] **Canva SDK compliance** — Verify the manifest output matches Canva's `POST /v1/brand-assets` expected schema.
- [ ] **End-to-end asset sync** — Wire the `stage_assets` manifest to the Canva CLI MCP for actual upload.
