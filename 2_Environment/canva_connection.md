# 🎨 Canva Connection — Pexabo Account

> **Stage 2: Environment** — How this project connects to Canva as **`info@pexabo.com`**. Owned by the **Environment Agent**.

---

## Account

| Item | Value |
|---|---|
| Canva account | `info@pexabo.com` (Pexabo) |
| Developer portal | https://www.canva.com/developers/ (sign in as the account above) |
| Key Vault | `dp-kv-deliverypilot` (existing — never create a new vault) |
| Vault secrets | `canva-mcp-CANVA-CLIENT-ID`, `canva-mcp-CANVA-CLIENT-SECRET` |

## Connection paths

### 1. claude.ai Canva connector (Claude Code / claude.ai)
- Run `/mcp` in Claude Code → select **claude.ai Canva** → complete OAuth as `info@pexabo.com`.
- After auth, Canva tools (search designs, create designs, export, …) are available in-session.

### 2. Canva CLI (native MCP over stdio)
```bash
npx @canva/cli@latest login     # browser OAuth as info@pexabo.com
cd 5_Symbols/mcp-server && npm run mcp
```
- Token is cached by the CLI locally; never commit it.

### 3. Developer app credentials (API integrations)
- Create/select the app under the Pexabo account in the developer portal.
- Store credentials in the vault (placeholders are pre-seeded — replace with real values):
```bash
5_Symbols/toolbox/secrets.sh set canva-mcp-CANVA-CLIENT-ID "<real client id>"
5_Symbols/toolbox/secrets.sh set canva-mcp-CANVA-CLIENT-SECRET "<real client secret>"
```

## Verification

- `python3 5_Symbols/toolbox/mcp_e2e_test.py` — proves the custom server answers `initialize`/`tools/list`/`tools/call` over stdio.
- A live Canva tool call (e.g. listing designs in the Pexabo workspace) proves KR 1.1 — evidence recorded in [`7_Testing_Known/validation_report.md`](../7_Testing_Known/validation_report.md).

## Rules

- Secrets only via Key Vault `dp-kv-deliverypilot` (`5_Symbols/toolbox/secrets.sh`) — see [`setup_azure.md`](setup_azure.md)
- The account email is `info@pexabo.com` — documents referring to `info@pexabo.co` are a typo
