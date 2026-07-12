# Secrets & Key Vault Skill

Load this skill when handling credentials, environment variables, or Azure Key Vault integration.

## Purpose
Manage secrets securely through Azure Key Vault — never expose credentials in code, config, or git history.

## Key Files
- `.env.example` — Template for required environment variables (placeholders only, no real secrets)
- `2_Environment/setup_azure.md` — Azure Key Vault setup guide

## Key Vault
All secrets live in the **existing** Azure Key Vault **`dp-kv-deliverypilot`** (`/vaults/dp-kv-deliverypilot/secrets`). **Do not create a new Key Vault.** Use the helper: `5_Symbols/toolbox/secrets.sh {get|set|list}`.

## Secrets Map
| Secret (vault name) | Env var | Purpose |
|--------|----------|---------|
| `canva-mcp-CANVA-CLIENT-ID` | `CANVA_CLIENT_ID` | Canva Developer App Client ID |
| `canva-mcp-CANVA-CLIENT-SECRET` | `CANVA_CLIENT_SECRET` | Canva Developer App Client Secret |

## Rules
- Never store secrets in code, config files, or git history
- Use the existing Azure Key Vault `dp-kv-deliverypilot` — never create a new vault
- Prefix this project's secrets with `canva-mcp-`
- Load secrets at runtime via `secrets.sh get`, the Azure SDK, or GitHub Actions `Azure/get-keyvault-secrets`
- When adding a new secret, update `.env.example` with the placeholder variable name (no value)
- Run `5_Symbols/toolbox/secrets.sh set <name> <value>` to store the actual value in the vault
