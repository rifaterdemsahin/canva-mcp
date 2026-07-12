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
| **Team admin — apps & integrations** | https://www.canva.com/settings/apps-and-integrations (whitelist integrations here) |
| Team user / team id | `oUY2J_eG6r3vrq3Xgjpnx4` / `oBY2JwxsYlLtBhWzZ7vKlY` (from `/rest/v1/users/me`) |
| Key Vault | `dp-kv-deliverypilot` (existing — never create a new vault) |
| Vault secrets | `canva-mcp-CANVA-CLIENT-ID=OC-AZ9VpNJiU0ps`, `canva-mcp-CANVA-CLIENT-SECRET` (stored ✅) |
| Local secrets file | `5_Symbols/mcp-server/.env` (gitignored) — `CANVA_CLIENT_ID`, `CANVA_CLIENT_SECRET`, `CANVA_ACCESS_TOKEN` |

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

## Team admin restriction — "Access Restricted by Team Admin"

When an OAuth consent screen shows **"Access Restricted by Team Admin"** (seen for both the Canva AI Connector and the Canva CLI — screenshots in `3_Simulation/`), it is a **Canva Team permission block**, not something fixable from the integration side. It's controlled by whoever administers the Canva Team tied to `info@pexabo.com`.

**What's happening:** Canva Teams have an admin setting that restricts which third-party integrations/apps team members can authorize. Since PEXABO LTD's Canva account is on a Team plan, external app connections are locked down by default.

**Fix options (in order of preference):**

1. **Find the Canva Team admin** — check **Canva → Settings → People / Team → Admin** to see who owns the PEXABO LTD workspace (it may be your own account under a different login).
2. **If you are the admin** — go to **https://www.canva.com/settings/apps-and-integrations** → *Manage integrations* (or *Manage apps*), search for the blocked integration (e.g. "Canva CLI", "Canva AI Connector"), tick it, and Save. The consent screen's **Allow** button activates immediately.
3. **If someone else administers it** — ask them to approve the integration or grant you app-authorization permission.
4. **Switch accounts** (last resort) — authorize with a personal Canva account outside the restricted Team; note the integration then acts on the personal account, not PEXABO's team assets.

For this project, option 2 was used on 2026-07-12 for both integrations — journeys captured as `canva_oauth_01`–`04` and `canva_cli_01`–`03` in `3_Simulation/`.

## Verification

- `python3 5_Symbols/toolbox/mcp_e2e_test.py` — proves the custom server answers `initialize`/`tools/list`/`tools/call` over stdio.
- A live Canva tool call (e.g. listing designs in the Pexabo workspace) proves KR 1.1 — evidence recorded in [`7_Testing_Known/validation_report.md`](../7_Testing_Known/validation_report.md).

## Rules

- Secrets only via Key Vault `dp-kv-deliverypilot` (`5_Symbols/toolbox/secrets.sh`) — see [`setup_azure.md`](setup_azure.md)
- The account email is `info@pexabo.com` — documents referring to `info@pexabo.co` are a typo
