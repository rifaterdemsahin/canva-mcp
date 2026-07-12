# 🔍 Gap Analysis — "CLI created a Canva document, but I can't see it on canva.com"

> **Stage 6: Semblance** — Why documents created by the local CLI / `create_design` MCP tool don't appear where expected on https://www.canva.com/. Owned by the **Semblance Agent**.

---

## Symptom

`npm run canva:create` (and the `create_design` MCP tool) return **success** with a design ID and edit/view URLs — but browsing https://www.canva.com/ shows no new document.

## Evidence — creation DOES work

| Fact | Evidence |
|---|---|
| API accepted the create | `POST /rest/v1/designs` → HTTP 200 with `Design ID: DAHPLbvLyIw` ("Pexabo Canva MCP — First Document from Local CLI", 2026-07-12) |
| Second controlled test | `DAHPLSNTDOc` ("Pexabo Visibility Test") created and its **edit URL opens the Canva editor in the browser** |
| Token is valid & team-scoped | `GET /rest/v1/users/me` → HTTP 200, user `oUY2J_eG6r3vrq3Xgjpnx4`, team `oBY2JwxsYlLtBhWzZ7vKlY` |

So the document **is created** — the gap is *where it lands vs. where you look*, plus a scope limitation that hides it from programmatic verification.

## Root causes, ranked

### 1. API-created designs don't show in the Home "Recents" rail (most likely)
The canva.com home page mainly surfaces designs you **opened in the editor**. A design created via the Connect API that was never opened has no "recently edited" signal, so the home rail skips it. It *does* exist under **Projects**.

**Where to look:** canva.com → **Projects** (left sidebar) → *Designs* tab → sort by "Date created", or type `Pexabo` in the top search bar.

### 2. Browsing under a different profile or team
The OAuth token was issued to `info@pexabo.com` in team `oBY2JwxsYlLtBhWzZ7vKlY` (PEXABO Work profile). If the browser session is on a **personal profile** or another team (top-right account switcher), the design belongs to a workspace you're not currently viewing.

**Check:** the profile chip at canva.com top-right must say the PEXABO team / `info@pexabo.com` — same identity as in `3_Simulation/canva_oauth_04_consent_allow.jpg`.

### 3. Token lacks read-back scopes — we can't verify programmatically
The current access token has create/write scopes but **not** `design:meta:read` or `profile:read`:

```
GET /rest/v1/designs           → 403 missing_scope: design:meta:read
GET /rest/v1/users/me/profile  → 403 missing_scope: profile:read
```

So `canva:list` style verification fails even though creation succeeds — which *feels* like nothing was created.

**Fix:** add `design:meta:read` (and `profile:read`) to the integration's scopes at
https://www.canva.com/developers/integrations/connect-api/OC-AZ9VpNJiU0ps/configuration → re-run the PKCE flow on `auth.html` → update `CANVA_ACCESS_TOKEN` in `.env`. Then `npm run canva:list` works as proof.

### 4. The returned edit/view URLs expire
The `https://www.canva.com/api/design/…` links carry an expiring JWT. Clicking an **old** link fails, reinforcing the "it was never created" impression. Open them soon after creation, or find the design via Projects/search instead.

## ✅ RESOLVED (2026-07-12)

**User confirmed the document is visible and editable** at its permanent URL:
https://www.canva.com/design/DAHPLSNTDOc/YHaqbJSFQfr9mC7JPnOwqg/edit

The design existed all along — root causes #1 (Home "Recents" doesn't surface never-opened API designs) and #4 (the expiring `/api/design/…` links) explain the confusion. Note the difference:

| Link type | Example | Lifetime |
|---|---|---|
| API response `edit_url` | `canva.com/api/design/eyJhbGci…/edit` | Expires (JWT) — open promptly |
| Permanent design URL | `canva.com/design/DAHPLSNTDOc/…/edit` | Stable — bookmark this |

## Resolution checklist

- [x] Document visible on canva.com (confirmed by user at the permanent URL above)
- [ ] Add `design:meta:read profile:read` scopes → re-consent → refresh `.env` token (nice-to-have: enables `npm run canva:list` programmatic verification)

## Cross-references

- Error logged: `6_Semblance/error.log` (2026-07-12, 6_Semblance)
- Fix tracked: `6_Semblance/fix.log`
- Connection details: [`2_Environment/canva_connection.md`](../2_Environment/canva_connection.md)
- Spec: `4_Formula/specs.md` → SPEC-012 / SPEC-013
