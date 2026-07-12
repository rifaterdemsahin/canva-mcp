#!/usr/bin/env bash
# secrets.sh — save/get secrets in the EXISTING Azure Key Vault (dp-kv-deliverypilot).
# Never create a new Key Vault; never commit secret values to git.
#
# Usage:
#   5_Symbols/toolbox/secrets.sh get <secret-name>
#   5_Symbols/toolbox/secrets.sh set <secret-name> <value>
#   5_Symbols/toolbox/secrets.sh list
#
# Project secrets use the "canva-mcp-" prefix, e.g. canva-mcp-CANVA-CLIENT-ID.
set -euo pipefail

VAULT_NAME="${AZURE_KEYVAULT_NAME:-dp-kv-deliverypilot}"

cmd="${1:-}"
case "$cmd" in
  get)
    [ $# -eq 2 ] || { echo "usage: $0 get <secret-name>" >&2; exit 1; }
    az keyvault secret show --vault-name "$VAULT_NAME" --name "$2" --query value -o tsv
    ;;
  set)
    [ $# -eq 3 ] || { echo "usage: $0 set <secret-name> <value>" >&2; exit 1; }
    az keyvault secret set --vault-name "$VAULT_NAME" --name "$2" --value "$3" --query id -o tsv
    ;;
  list)
    az keyvault secret list --vault-name "$VAULT_NAME" --query "[].name" -o tsv
    ;;
  *)
    echo "usage: $0 {get <name>|set <name> <value>|list}   (vault: $VAULT_NAME)" >&2
    exit 1
    ;;
esac
