# Numbers 1–100 grouped — how the Canva document was built

> **Stage 7: Testing Known** — App steps that produced design [`DAHUghgZSHM`](https://www.canva.com/design/DAHUghgZSHM/_r7IGNCeEKxCS3hfmTpVEA/edit). Spec: [SPEC-020](../4_Formula/numbers_1_100_grouped_spec.md). Runner: `5_Symbols/toolbox/import_numbers_1_100_grouped.py`.

Compiled By: Grok 4.6

---

## What you are looking at

| Field | Value |
|-------|--------|
| Design | **Numbers 1-100 grouped** |
| ID | `DAHUghgZSHM` |
| Edit URL | https://www.canva.com/design/DAHUghgZSHM/_r7IGNCeEKxCS3hfmTpVEA/edit |
| Layout | 10×10 grid, color changes every ten |
| Move-together trick | Each badge is **one PNG** (circle + numeral baked in). Canva has 100 pictures, not 100 ovals + 100 text boxes. |

The previous design [`DAHUgXv2dNs`](https://www.canva.com/design/DAHUgXv2dNs/V-tQZGRUYPbX7OhXGjzE_w/edit) looked the same but **was not grouped**: PPTX `p:grpSp` groups were flattened on import, so selecting circle 1 left the number behind.

Connect REST **cannot** press ⌘G. Native editable groups still need the Apps SDK in the editor. This document is the CLI path that actually landed 100 badges that move as one.

---

## App steps (what the script did)

```
User: numbers + circles must move together
        │
        ▼
 1. Load gitignored .env
        │
        ▼
 2. Refresh Canva OAuth token
        │
        ▼
 3. Draw 100 PNG badges (Pillow)
        │
        ▼
 4. Pack them into a PPTX (100 pictures, no text boxes)
        │
        ▼
 5. POST /v1/imports  →  poll job
        │
        ▼
 6. Open design in Google Chrome
```

### Step 1 — Load gitignored credentials

File (never committed): `5_Symbols/mcp-server/.env`

Keys used (values not logged):

- `CANVA_CLIENT_ID` — Connect integration `OC-AZ9VpNJiU0ps`
- `CANVA_CLIENT_SECRET` — Basic auth for token endpoint
- `CANVA_REFRESH_TOKEN` — exchanged for a new access token
- `CANVA_ACCESS_TOKEN` — overwritten after refresh

### Step 2 — Refresh the access token

```http
POST https://api.canva.com/rest/v1/oauth/token
Authorization: Basic base64(CANVA_CLIENT_ID:CANVA_CLIENT_SECRET)
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&refresh_token=…
```

Response (~4h access token + rotated refresh token) is written **back** into the same `.env`. Result this run: `expires_in=14400`.

### Step 3 — Render 100 atomic badges

For `n` in 1…100:

1. Transparent 256×256 PNG
2. Filled ellipse using the decade palette (blue → red → green → amber → purple → teal → magenta → olive → navy/gold → orange)
3. Centered bold numeral
4. Save `3_Simulation/_badge_pngs/NNN.png` (gitignored)

Circle and number are **pixels**, not two Canva objects.

### Step 4 — Build a picture-only PPTX

`3_Simulation/numbers_1_100_atomic.pptx`

- Square slide (~10.8 in)
- Title text: `1–100  ·  each number grouped with its circle`
- **100 `add_picture` shapes** named `Number 1` … `Number 100`
- No ovals, no text boxes per cell, no `p:grpSp` groups (those flatten)

Also writes preview `3_Simulation/numbers_1_100_atomic_preview.png`.

### Step 5 — Import into Canva

```http
POST https://api.canva.com/rest/v1/imports
Authorization: Bearer CANVA_ACCESS_TOKEN
Content-Type: application/octet-stream
Import-Metadata: { "title_base64": "<Numbers 1-100 grouped>", "mime_type": "application/vnd.openxmlformats-officedocument.presentationml.presentation" }

<body = pptx bytes>
```

Poll `GET /v1/imports/{jobId}` until `success`.

This run:

- Job `cd21f3e1-9bbc-4c9f-bf58-ce83a63395c1`
- Design id **`DAHUghgZSHM`**
- Title **Numbers 1-100 grouped**

Saved (no JWT edit URLs): `3_Simulation/numbers_1_100_atomic_import.json`

### Step 6 — Open in Chrome

```bash
open -a "Google Chrome" "https://www.canva.com/design/DAHUghgZSHM/_r7IGNCeEKxCS3hfmTpVEA/edit"
```

---

## Re-run the same app

From the `canva-mcp` repo root:

```bash
python3 5_Symbols/toolbox/import_numbers_1_100_grouped.py
open -a "Google Chrome" "https://www.canva.com/design/DAHUghgZSHM/_r7IGNCeEKxCS3hfmTpVEA/edit"
```

Requires the gitignored `.env` keys in Step 1. Creates a **new** design each run (import always inserts; it does not patch `DAHUghgZSHM`).

---

## Commands actually used (2026-09-07)

```bash
cd /Users/rifaterdemsahin/projects/canva-mcp
python3 5_Symbols/toolbox/nav_sync.py
python3 5_Symbols/toolbox/import_numbers_1_100_grouped.py
open -a "Google Chrome" "https://www.canva.com/design/DAHUghgZSHM/edit"
git add <docs + script + pptx; never .env>
git commit -m "feat: SPEC-020 atomic 1-100 grouped Canva badges"
git push origin main
```

Commit: `9d4229c` on `origin/main`.

---

## Verify in the editor

1. Click any numbered circle.
2. Drag it. The numeral must travel with the fill.
3. If they split, you are on the old design `DAHUgXv2dNs`, not `DAHUghgZSHM`.
