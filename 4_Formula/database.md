# 🗄️ Database Integration — Supabase

This project uses **Supabase** (hosted Postgres, Auth, and Realtime platform) as its primary database.

---

## 🏗️ Project Naming Convention

To ensure consistency across the development lifecycle, the Supabase project name reflects the GitHub repository name:
* **Project Name / ID:** `canva-mcp`
* **Local config project_id:** Configured in `2_Environment/supabase/config.toml` as `canva-mcp`.

---

## 🎛️ Local Development Setup

For local testing and migrations, a local containerized Supabase instance is initialized:
* **Configuration directory:** `2_Environment/supabase/` — note: the Supabase CLI expects `supabase/` at the working directory root, so run CLI commands with `--workdir 2_Environment` (e.g. `supabase --workdir 2_Environment start`)
* **Initialization command:**
  ```bash
  npx supabase init
  ```
* **Local URL:** `http://localhost:54321` (API Gateway)
* **Local Postgres Port:** `54322`

---

## 🔒 Production Credentials & Azure Key Vault

All database connection variables and service keys are treated as sensitive secrets. They are stored in **Azure Key Vault** (e.g., `dp-kv-deliverypilot`) and fetched dynamically at runtime.

### Stored Secret Names mapping:

| Environment Variable | Key Vault Secret Name | Purpose / Description |
| :--- | :--- | :--- |
| `SUPABASE_URL` | `SUPABASE-URL` | The unique project endpoint (e.g., `https://xxxx.supabase.co`). |
| `SUPABASE_ANON_KEY` | `SUPABASE-ANON-KEY` | Client-safe API key for accessing resources (respects RLS policies). |
| `SUPABASE_SERVICE_ROLE_KEY` | `SUPABASE-SERVICE-ROLE-KEY` | Secret admin key bypasses Row Level Security (never expose to frontend). |
| `DATABASE_URL` | `DATABASE-URL` | Direct connection string to the underlying PostgreSQL database. |

### Adding Secrets to Azure Key Vault (CLI reference)

To add Supabase keys to your Key Vault instance:

```bash
# Set Supabase API URL
az keyvault secret set --vault-name dp-kv-deliverypilot --name "SUPABASE-URL" --value "https://your-project.supabase.co"

# Set Anon Public Key
az keyvault secret set --vault-name dp-kv-deliverypilot --name "SUPABASE-ANON-KEY" --value "your-anon-key-here"

# Set Service Role Private Key
az keyvault secret set --vault-name dp-kv-deliverypilot --name "SUPABASE-SERVICE-ROLE-KEY" --value "your-service-role-key-here"

# Set direct Database connection URL
az keyvault secret set --vault-name dp-kv-deliverypilot --name "DATABASE-URL" --value "postgresql://postgres:password@db.xxxx.supabase.co:5432/postgres"
```

---

## 📋 Tables

### `canva_course_artifacts`

Structured inventory of the Canva course folder ([`4_Formula/canva_course_artifacts.md`](canva_course_artifacts.md)), pushed to Supabase so it's queryable instead of only living as a markdown table.

- **Project used:** the existing `claude-architect` Supabase project — no `canva-mcp`-specific Supabase project exists yet in the vault, so the user chose to reuse `claude-architect-SUPABASE-URL` / `claude-architect-SUPABASE-SERVICE-KEY` (already in `dp-kv-deliverypilot`) rather than provisioning a new one.
- **Table creation:** via the Supabase Management API SQL endpoint (`POST /v1/projects/{ref}/database/query`), authenticated with the generic `supabase-access-token` secret (a Management API personal access token, works across projects on the account).
- **Row population:** via PostgREST (`POST {SUPABASE_URL}/rest/v1/canva_course_artifacts`) with `Prefer: resolution=merge-duplicates` upsert on `canva_design_id`, authenticated with `claude-architect-SUPABASE-SERVICE-KEY`.
- **Schema:** `id`, `canva_design_id` (unique), `title`, `item_type` (`design`|`folder`), `folder_path`, `folder_id`, `page_count`, `view_url`, `edit_url`, `created_at_canva`, `updated_at_canva`, `inserted_at`. RLS is enabled with a public-read policy.
- **Row count:** 73 (67 designs + 6 folders).
- **View/edit:** [Supabase Table Editor](https://supabase.com/dashboard/project/rmekfsdhglyiralxvkwc/editor) → `canva_course_artifacts`.

---

## 🛡️ Best Practices & Row Level Security (RLS)

1. **Row Level Security (RLS):** All created tables must have RLS enabled (`ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`).
2. **Access Control:** Utilize `SUPABASE_ANON_KEY` for client queries, and reserve `SUPABASE_SERVICE_ROLE_KEY` for backend administrative scripts and migrations.
3. **No Secrets in Code:** Never commit actual URLs or keys. Use `.env.example` as a template and load keys at runtime using the Azure SDK or GitHub Action secrets managers.
