# Canva Client Secret — How to Create & Store

> **Stage 4: Formula** — Step-by-step guide to obtain the Canva OAuth client secret from the Canva Developer Portal and store it in Azure Key Vault. Owned by the **Formula Agent**; executed by the **Environment Agent** (TSK-010).

---

## Step 1: Open the Canva Developer Portal

1. Go to https://www.canva.com/developers/
2. Sign in as **`info@pexabo.com`** (the Pexabo workspace account)
3. Navigate to **"Integrations"** → **"Connect API"**

## Step 2: Create a Connect API Integration

For MCP/OAuth access, you need a **Connect API integration** (not a Canva App):

1. Click **"Create Integration"** or **"New Integration"**
2. Choose **"Connect API"** type
3. Name it (e.g., `mcp`)
4. After creation, the integration page opens at:
   `https://www.canva.com/developers/integrations/connect-api/{INTEGRATION_ID}/configuration`

## Step 3: Get the Client Secret

1. In the integration configuration, find the **"App Credentials"** section
2. You will see:
   - **Client ID:** e.g., `OC-AZ9VpNJiU0ps`
   - **Client Secret:** (hidden — click **"Show"** or **"Reveal"**)
3. Click to reveal the **Client Secret** — this is a long alphanumeric string
4. Copy it to your clipboard immediately (it may not be shown again)

> ⚠️ Treat the client secret like a password. Never commit it to git, never paste it in chat logs, never share it outside the vault.

**Note on Canva App ID:** The project also has a Canva App with ID `AAHAAN3AO5Y` (for building apps within Canva). The MCP/OAuth integration uses the Connect API integration credentials (`OC-...`), not the Canva App credentials.

## Step 4: Store in Azure Key Vault

Run these two commands from the project root (`/Users/rifaterdemsahin/projects/canva-mcp`):

```bash
5_Symbols/toolbox/secrets.sh set canva-mcp-CANVA-CLIENT-ID "OC-AZ9VpNJiU0ps"
5_Symbols/toolbox/secrets.sh set canva-mcp-CANVA-CLIENT-SECRET "<paste the revealed secret here>"
```

**Verification** — confirm both secrets are stored:

```bash
5_Symbols/toolbox/secrets.sh list
```

Expected output:
```
canva-mcp-CANVA-CLIENT-ID
canva-mcp-CANVA-CLIENT-SECRET
```

## Step 5: Authenticate the Canva CLI Locally

For Kilo, Claude Code, or any local MCP host to use the native Canva CLI MCP, run:

```bash
npx @canva/cli@latest login
```

This opens a browser OAuth flow as `info@pexabo.com`. The token is cached locally by the CLI — never committed to git.

## Step 6: Verify End-to-End

After the CLI is authenticated, test the MCP connection:

```bash
# 1. Native Canva CLI MCP should answer tools/list
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npx -y @canva/cli@latest mcp

# 2. Custom workspace-assistant should answer tools/list
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node 5_Symbols/mcp-server/dist/src/index.js

# 3. Run the e2e test suite
python3 5_Symbols/toolbox/mcp_e2e_test.py
```

All three should return tool lists and pass without errors.

---

## Troubleshooting

| Problem | Likely Fix |
|---------|-----------|
| `az: command not found` | Install Azure CLI: `brew install azure-cli` |
| `ERROR: (SecretNotFound)` | Run `secrets.sh set` again with the correct name |
| `InvalidCredentialsError` | The client secret is wrong — re-check in the developer portal |
| CLI OAuth fails | Make sure you're on a machine with a browser; the CLI needs to open a browser window |

---

## Related

- App credentials in vault → `2_Environment/canva_connection.md`
- App settings in developer portal → https://www.canva.com/developers/
- Spec reference → `4_Formula/specs.md` (SPEC-011)
