# 🛠 Project Implementation — Using the Canva MCP

> **Stage 4: Formula** — The implementation guide for this project's goal: run the Canva MCP connected to the **`info@pexabo.com`** Canva account and drive design workflows from MCP hosts. Maintained by the **Formula Agent**; executed by the **Symbols Agent**.

---

## 🎯 What we are implementing

Two MCP servers run side by side (see [`5_Symbols/mcp_server.md`](../5_Symbols/mcp_server.md)):

| Server | Command | Purpose |
|---|---|---|
| **Native Canva MCP** | `npm run mcp` (→ `npx @canva/cli@latest mcp`) | Official Canva tools — designs, assets, exports — authenticated as `info@pexabo.com` |
| **Custom workspace assistant** | `npm start` (→ `node dist/src/index.js`) | `generate_design_brief` + `stage_assets` PoC tools |

## 🔌 Step 1 — Connect the Canva account

Three ways to attach the `info@pexabo.com` account, in order of preference:

1. **claude.ai Canva connector** — in Claude Code, run `/mcp` and select **claude.ai Canva**, then sign in as `info@pexabo.com`. Tools become available in-session.
2. **Canva CLI login** — `npx @canva/cli@latest login` opens a browser OAuth flow; sign in as `info@pexabo.com`. Then `npm run mcp` serves the authenticated MCP over stdio.
3. **Developer app credentials** — a Canva Developer App (created under the Pexabo account at https://www.canva.com/developers/) provides `CANVA_CLIENT_ID` / `CANVA_CLIENT_SECRET`, stored in Key Vault `dp-kv-deliverypilot` as `canva-mcp-CANVA-CLIENT-ID` / `-SECRET`.

Details and current connection status: [`2_Environment/canva_connection.md`](../2_Environment/canva_connection.md)

## 🧩 Step 2 — Configure the MCP host

Copy [`5_Symbols/mcp-server/mcp-config.json`](../5_Symbols/mcp-server/mcp-config.json) into your MCP host (Claude Desktop / Cursor / VS Code) and export the two env vars from the vault:

```bash
export CANVA_CLIENT_ID=$(5_Symbols/toolbox/secrets.sh get canva-mcp-CANVA-CLIENT-ID)
export CANVA_CLIENT_SECRET=$(5_Symbols/toolbox/secrets.sh get canva-mcp-CANVA-CLIENT-SECRET)
```

## ▶️ Step 3 — Run it

```bash
cd 5_Symbols/mcp-server
npm install && npm run build
npm start        # custom tools server (stdio)
npm run mcp      # native Canva MCP (requires Step 1 login)
```

Verify with the e2e check (also run by the Test Agent):

```bash
python3 5_Symbols/toolbox/mcp_e2e_test.py
```

## 📈 Step 4 — Use it

Typical flow once connected:

1. Ask the MCP host to **`generate_design_brief`** for a client engagement (structured brief → Canva Design Kit format).
2. **`stage_assets`** with the engagement's image URLs → JSON asset manifest.
3. Feed the manifest to the native Canva MCP to upload brand assets into the `info@pexabo.com` workspace.
4. Iterate designs in Canva; export via the native MCP tools.

## ✅ Definition of Done

Tracked as OKRs in [`1_Real_Unknown/okrs.md`](../1_Real_Unknown/okrs.md):
- Live tool call against the `info@pexabo.com` workspace succeeds (KR 1.1)
- Both servers answer `tools/list` (KR 1.2 / 1.3)
- Real credentials in the vault, none in git (KR 1.4)
