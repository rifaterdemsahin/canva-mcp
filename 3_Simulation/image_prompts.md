# Canva MCP Simulation — Image Prompts & Screenshots

> **Stage 3: Simulation** — Screenshot documentation of the OAuth 2.0 PKCE authorization lifecycle for the Canva Connect API integration.

---

## OAuth Flow Screenshots

These are **actual screenshots** captured during the Canva OAuth PKCE flow, not AI-generated mockups. Each step below corresponds to an image in the carousel.

### 1. Access Restricted (`canva_oauth_01_access_restricted.jpg`)
- **What it shows:** The Canva authorization page initially shows the "Allow" button grayed out because the team admin has restricted third-party integrations. The heading reads "Access Restricted by Team Admin."
- **Source:** Canva OAuth consent screen (https://canva.com/api/oauth/authorize)
- **Resolution:** Admin went to Settings → Permissions → Apps & Integrations → whitelisted the connector

### 2. Admin Apps & Integrations (`canva_oauth_02_admin_apps_integrations.jpg`)
- **What it shows:** The Canva admin settings page (Settings → Permissions → Apps & Integrations) where the admin can manage which integrations are allowed for the team.
- **Source:** Canva admin dashboard
- **Action Taken:** Located the Canva AI Connector and enabled/whitelisted it for `info@pexabo.com` team

### 3. Allow Canva AI Connector (`canva_oauth_03_allow_canva_ai_connector.jpg`)
- **What it shows:** The admin whitelist/allow screen for the Canva AI Connector specifically, before it was enabled.
- **Source:** Canva admin integration management
- **Action Taken:** Enabled the connector → refreshed the OAuth consent page

### 4. Consent Allow Button Active (`canva_oauth_04_consent_allow.jpg`)
- **What it shows:** After admin whitelisting, the OAuth consent page now shows the "Allow" button as active (purple, clickable). Lists all requested scopes: design content, assets, folders, apps, brand templates, comments.
- **Source:** Canva OAuth consent screen post-admin-fix
- **Scopes shown:** `design:content:read/write`, `asset:read/write`, `folder:read/write`, `app:read/write`, `brandtemplate:read/write`, `comment:read/write`

### 5. Auth Landing Page (`canva_oauth_05_auth_landing.jpg`)
- **What it shows:** The `auth.html` landing page hosted on GitHub Pages (https://rifaterdemsahin.github.io/canva-mcp/auth.html). Shows the "Connect to Canva" button that initiates the PKCE OAuth flow.
- **Source:** `auth.html` — static OAuth callback handler
- **Components:** Client ID `OC-AZ9VpNJiU0ps`, PKCE code challenge + verifier generation, redirect to Canva authorize endpoint

### 6. Consent Granted (`canva_oauth_06_consent_granted.jpg`)
- **What it shows:** The Canva authorization screen after clicking "Allow" — the purple button confirms the user granted the requested permissions. The URL contains the OAuth authorization parameters.
- **Source:** Canva OAuth consent screen — post-approval
- **Scopes requested:** `design:content:read`, `asset:read`, `folder:permission:read`, `design:permission:read`, `design:content:write`, `folder:read`, `brandtemplate:content:write`, `app:read`, `app:write`, `folder:write`, `folder:permission:write`, `asset:write`, `brandtemplate:content:read`, `brandtemplate:meta:read`, `comment:read`, `design:permission:write`, `comment:write`

### 7. Auth Code Callback (`canva_oauth_07_auth_code_callback.jpg`)
- **What it shows:** The callback page after Canva redirects back to `auth.html?code=...`. The green box displays the encrypted JWT authorization code. This code is exchanged for access tokens using the client secret from Azure Key Vault.
- **Source:** `auth.html?code=<JWT>` — callback handler page
- **Next step:** Paste client secret from vault → click "Exchange Tokens" → tokens saved to localStorage

---

## Prompt-Generated Assets (Future)

These placeholder entries describe AI-generated architecture diagrams that can be created when visual assets are needed:

### Architecture Flow (`canva_mcp_architecture_flow.png`) — Pending
- **Prompt:** Architecture diagram showing two MCP servers connected to a single MCP host application. Left side: MCP Host (Claude/Kilo/Cursor), center: two parallel boxes labeled "Canva CLI MCP (native, 11 tools)" and "Workspace Assistant MCP (custom, 2 tools)", right: Canva cloud API. Clean dark mode, neon teal and purple connections, glassmorphism server nodes, no device frame --ar 16:9
- **Status:** Pending generation

### Tool List Comparison (`canva_tool_list.png`) — Pending
- **Prompt:** Split screen UI showing two lists of MCP tools side by side. Left panel: "Canva CLI MCP" with 11 tool names. Right panel: "Workspace Assistant" with 2 tool names (generate_design_brief, stage_assets). Dark mode, neon teal accents, glassmorphism cards, terminal aesthetic, no device frame --ar 16:9
- **Status:** Pending generation

---

## Guidelines
1. Screenshots are captured at actual resolution (no cropping beyond the relevant UI area)
2. File naming: `canva_oauth_NN_descriptive_name.jpg` where NN is the step number
3. All screenshots use the actual Pexabo account (`info@pexabo.com`) and Canva Connect API integration (`OC-AZ9VpNJiU0ps`)
