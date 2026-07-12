# ☁️ Azure Key Vault & Credentials Setup Guide

> **Stage 2: Environment** — Configuration and onboarding instructions for secrets management.

---

## 🔒 Azure Key Vault Setup

All environment variables and secrets must be loaded dynamically from Azure Key Vault at runtime.

> ⚠️ **This project uses the EXISTING vault `dp-kv-deliverypilot`** (`/vaults/dp-kv-deliverypilot/secrets`). **Do not create a new Key Vault** — the provisioning commands below are historical reference only. Use `5_Symbols/toolbox/secrets.sh {get|set|list}` for day-to-day secret access.

### 1. Azure Authentication
```bash
# Log in to Azure account
az login

# Set active subscription
az account set --subscription "your-subscription-name-or-id"
```

### 2. Provision Key Vault (historical reference — vault already exists, do NOT re-run)
```bash
# Create Resource Group
az group create --name dg-pilot-rg --location westeurope

# Create Key Vault
az keyvault create --name dp-kv-deliverypilot --resource-group dg-pilot-rg --location westeurope
```

### 3. Registering Secrets
```bash
# Add a secret to the vault (project secrets use the canva-mcp- prefix)
az keyvault secret set --vault-name dp-kv-deliverypilot --name "canva-mcp-CANVA-CLIENT-ID" --value "..."

# Or via the helper:
5_Symbols/toolbox/secrets.sh set canva-mcp-CANVA-CLIENT-ID "..."
```

---

## 🔑 GitHub Actions Integration
To pull secrets into GitHub workflows, the repository needs Azure Service Principal credentials:

1. Create a Service Principal:
   ```bash
   az ad sp create-for-rbac --name "dg-pilot-github-sp" --role contributor \
       --scopes /subscriptions/your-subscription-id \
       --sdk-auth
   ```
2. Store the JSON output as a GitHub Repository Secret named `AZURE_CREDENTIALS`.
3. In workflows, use the action:
   ```yaml
   - name: Azure Login
     uses: azure/login@v1
     with:
       creds: ${{ secrets.AZURE_CREDENTIALS }}
   ```

---

## 🧪 Verification Checklist
- [ ] Azure CLI successfully authenticated
- [ ] Active subscription is verified
- [ ] Key Vault exists and permissions are configured correctly
- [ ] Zero secret configurations committed to source files
