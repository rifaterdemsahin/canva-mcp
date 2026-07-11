# Canva MCP — Workspace Assistant (PoC)

A proof-of-concept MCP (Model Context Protocol) server that augments the `@canva/cli` MCP capabilities with custom workspace-assistant tools for design brief generation and asset staging.

## Quickstart

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start the custom MCP server (stdio)
npm start

# Development mode with hot-reload
npm run dev

# Launch the native Canva CLI MCP server
npm run mcp
```

## Connecting to MCP Hosts

### Claude Desktop / Cursor / VS Code

Copy `mcp-config.json` into your MCP client configuration and set the environment variables:

| Variable | Description |
|---|---|
| `CANVA_CLIENT_ID` | Canva Developer App Client ID |
| `CANVA_CLIENT_SECRET` | Canva Developer App Client Secret |

**For Cursor:** Settings → Features → MCP Servers → Add new server, paste the `mcpServers` block from `mcp-config.json`.

**For Claude Desktop:** Edit `claude_desktop_config.json` and add the `mcpServers` block.

**For VS Code:** Use the GitHub Copilot Chat MCP configuration or the VS Code MCP extension.

## PoC Checklist

This proof of concept validates:

- [x] **MCP Server lifecycle** — Stdio server start, tool list, and tool call handling via `@modelcontextprotocol/sdk`.
- [x] **Custom tool: `generate_design_brief`** — Accepts structured input (client name, description, brand colors, deliverables, tone) and returns a formatted Canva Design Kit brief.
- [x] **Custom tool: `stage_assets`** — Accepts image URLs and returns a JSON asset manifest that can be consumed by the Canva Assets API.
- [ ] **Canva SDK compliance** — Verify the manifest output matches Canva's `POST /v1/brand-assets` expected schema.
- [ ] **End-to-end asset sync** — Wire the `stage_assets` manifest to the Canva CLI MCP for actual upload.

## Project Structure

```
canva-mcp/
├── src/
│   └── index.ts          # MCP server entry point, tool registration
├── tools/
│   ├── design-brief.ts    # generate_design_brief tool implementation
│   └── asset-stager.ts    # stage_assets tool implementation
├── package.json
├── tsconfig.json
├── mcp-config.json        # Ready-to-use MCP host configuration
└── .env.example           # Environment variable template
```

## License

MIT
