# 🎨 Canva Connection — Pexabo Account

> **Stage 2: Environment** — How this project connects to Canva as **`info@pexabo.com`**. Owned by the **Environment Agent**.

---

## Account

| Item | Value |
|---|---|---|
| Canva account | `info@pexabo.com` (Pexabo) |
| Developer portal | https://www.canva.com/developers/ (sign in as the account above) |
| Connect API integration | `OC-AZ9VpNJiU0ps` (named "mcp") |
| Integration config URL | https://www.canva.com/developers/integrations/connect-api/OC-AZ9VpNJiU0ps/configuration |
| Canva App ID | `AAHAAN3AO5Y` (for Canva App development, separate from Connect API) |
| Key Vault | `dp-kv-deliverypilot` (existing — never create a new vault) |
| Vault secrets | `canva-mcp-CANVA-CLIENT-ID=OC-AZ9VpNJiU0ps`, `canva-mcp-CANVA-CLIENT-SECRET` (stored ✅) |

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

### 3. Connect API integration credentials (OAuth)
- Created Connect API integration named "mcp" under the Pexabo account.
- Integration config: https://www.canva.com/developers/integrations/connect-api/OC-AZ9VpNJiU0ps/configuration
- Credentials stored in vault (✅ done 2026-07-12):
  - `canva-mcp-CANVA-CLIENT-ID` = `OC-AZ9VpNJiU0ps`
  - `canva-mcp-CANVA-CLIENT-SECRET` = stored in vault

## Verification

- `python3 5_Symbols/toolbox/mcp_e2e_test.py` — proves the custom server answers `initialize`/`tools/list`/`tools/call` over stdio.
- A live Canva tool call (e.g. listing designs in the Pexabo workspace) proves KR 1.1 — evidence recorded in [`7_Testing_Known/validation_report.md`](../7_Testing_Known/validation_report.md).

## Rules

- Secrets only via Key Vault `dp-kv-deliverypilot` (`5_Symbols/toolbox/secrets.sh`) — see [`setup_azure.md`](setup_azure.md)
- The account email is `info@pexabo.com` — documents referring to `info@pexabo.co` are a typo
