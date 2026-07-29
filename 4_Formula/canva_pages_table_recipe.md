# 📝 Recipe: Canva Pages Table Integration & Token Decryption

> **Stage 4: Formula** — Operational runbook for decrypting Canva CLI credentials, troubleshooting OAuth scopes, and programmatically cataloging design pages.

---

## 🚀 Execution Summary

This recipe documents the step-by-step resolution of integrating Canva design `DAHQCqMC7Ck` into the course inventory under the Canva MCP framework. It acts as a blueprint for troubleshooting similar API authentication issues or token structures in the future.

---

## 📋 Step-by-Step Walkthrough

### Step 1: Canva CLI Session Decryption
When running tasks headlessly or through CLI environments, `@canva/cli` stores credentials locally. To extract the active OAuth token from these encrypted credentials:

1. **Locate storage:** The credentials file is saved at `~/.canva-cli/credentials`.
2. **Locate the CLI bundle:** Locate `node_modules/@canva/cli/cli.js`.
3. **Expose the decryption class:** Write a scratch script to load `cli.js`, strip its default CLI runner trigger (`var JRn=IAt(process.argv);JRn.run();`), and append:
   ```javascript
   globalThis.DecrypterClass = Gz;
   globalThis.MXClass = MX;
   ```
4. **Execute and Decrypt:** Load the modified script using dynamic `import()` within the same `node_modules` workspace context to satisfy packages like `ink`. Extract the decrypted token:
   ```javascript
   const decrypter = new globalThis.DecrypterClass();
   const storage = new globalThis.MXClass(decrypter);
   const tokenRes = await storage.getTokenData();
   const token = tokenRes.data.access_token;
   ```

### Step 2: Scope Analysis & Debugging
Even if a token is valid, Canva Connect REST API endpoints will reject requests with `invalid_access_token` (HTTP 401) or `missing_scope` (HTTP 403) if the required scopes are not configured on the developer portal or requested during authorization.

1. **Decode JWT Payload:** Base64-decode the second block of the JWT to inspect the `"scopes"` array.
2. **Endpoint Mappings:**
   * `/rest/v1/users/me` requires `profile:read`.
   * `/rest/v1/designs/{id}` requires `design:meta:read`.
   * `/rest/v1/designs/{id}/pages` requires `design:content:read`.
3. **Scope Restoration:** If scopes are missing from the array, update `auth.html`'s `SCOPE` variable to explicitly include `design:meta:read` and `profile:read`.

### Step 3: Re-authentication
1. Deploy the updated `auth.html` to GitHub Pages.
2. Direct the user to the live URL: `https://<user>.github.io/<repo>/auth.html`.
3. Click the **Re-authorize** button. This is critical because `auth.html` caches tokens in browser `localStorage`. Clicking Re-authorize clears this cache and forces a fresh consent flow with the new scope payload.
4. Retrieve the new code, input the client secret (`cnvcaBZ...`), and copy the new access token.

### Step 4: Cataloging & Page Table Sync
1. Create a helper utility `5_Symbols/toolbox/get_design_pages.js` to fetch and render the page list in markdown.
2. Register the design ID inside the Root Folder table of `4_Formula/canva_course_artifacts.md`.
3. Append a dedicated slide table to document slide names (which are a documentation-only convention, as the Canva REST API does not support page renaming).
4. Update the summary statistics in `canva_course_artifacts.md` to reflect the updated design count.

### Step 5: Smoke Testing & Menu Generation
1. Check for orphaned stage documentation files. If any exist (e.g., `glossary_grid_flow.md`), register them in `5_Symbols/toolbox/nav_sync.py`.
2. Run `python3 5_Symbols/toolbox/nav_sync.py` to rebuild the 3-way sync navigation (menus in `navigation_config.json`, `index.html`, and `markdown_renderer.html`).
3. Run `python3 5_Symbols/toolbox/smoke_test.py` to ensure 10/10 PASS status before committing.

---

## 🧪 Verification Check

- [ ] Credentials can be decrypted using the scratch script.
- [ ] Stored token in `.env` contains both `design:meta:read` and `profile:read` scopes.
- [ ] Navigation sync has no orphaned files.
- [ ] Smoke tests return `10/10 smoke tests passed`.
