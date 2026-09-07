# SPEC-020: Numbers 1–100 grouped in Canva (circle + numeral move together)

> **Stage 4: Formula** — Spec for the 10×10 rounded-number grid. Owned by the Formula Agent; executed by Environment + Symbols. Retry of design `DAHUgXv2dNs` after PPTX `p:grpSp` import flattened groups.

---

## Problem

The user needs one Canva document with numbers **1–100**, color changing every ten, where **each filled circle and its numeral are grouped** so they **move together** (⌘G equivalent).

| Attempt | Design | What happened |
|---------|--------|----------------|
| 1. Oval + text PPTX | first import | Looks right; circle and number are **two objects** |
| 2. PPTX `p:grpSp` groups | [`DAHUgXv2dNs`](https://www.canva.com/design/DAHUgXv2dNs/V-tQZGRUYPbX7OhXGjzE_w/edit) | Title “Numbers 1-100 grouped”; Canva **flattened** groups on import. Selecting circle 1 leaves the numeral behind |
| 3. Apps SDK `type: "group"` buttons | `DAHUgSXeqyY` | Native groups exist in the lower-third app, but Connect REST cannot click the button; user still saw ungrouped `DAHUgXv2dNs` |
| 4. **This spec (retry)** | new import | **One raster per badge** so Canva has a single object per number. Circle + numeral cannot separate |

## Success criteria

1. One Canva design, 10×10 grid, numbers 1–100, color changes every ten (palette below).
2. Selecting a badge and dragging it moves **circle and number together**.
3. Design opened in Google Chrome.
4. Prompt + commands recorded in `1_Real_Unknown/prompts.md`.
5. Credentials loaded only from gitignored `.env` (never committed).

## Palette (matches the screenshot)

| Decade | Fill | Numeral |
|--------|------|---------|
| 1–10 | `#1D4ED8` | `#FFFFFF` |
| 11–20 | `#DC2626` | `#FFFFFF` |
| 21–30 | `#059669` | `#FFFFFF` |
| 31–40 | `#F59E0B` | `#111827` |
| 41–50 | `#7C3AED` | `#FFFFFF` |
| 51–60 | `#0E7490` | `#FFFFFF` |
| 61–70 | `#DB2777` | `#FFFFFF` |
| 71–80 | `#4D7C0F` | `#FFFFFF` |
| 81–90 | `#0F172A` | `#FBBF24` |
| 91–100 | `#EA580C` | `#FFFFFF` |

## Why Connect REST cannot ⌘G

Official Connect APIs can create/import/export designs. They **cannot** group existing editor elements. Native groups require Apps SDK:

```ts
await addElementAtPoint({
  type: "group",
  children: [
    { type: "shape", /* circle */, top: 0, left: 0, width, height },
    { type: "text", children: [String(n)], top, left, width },
  ],
});
```

or `openDesign` → `session.helpers.group({ elements: [shape, text] })`.

That path is still available as the in-editor buttons on `5_Symbols/lower-third-text`. It is **not** how this retry lands 100 grouped badges from the CLI.

## Working import strategy (atomic badges)

1. Render each number as **one PNG** (transparent canvas, filled ellipse, centered numeral). Circle and text are pixels, not two Canva elements.
2. Build a PPTX whose slide contains **100 pictures** (no ovals, no text boxes, no `p:grpSp`).
3. `POST https://api.canva.com/rest/v1/imports` with `design:content:write`.
4. After import, each badge is **one image element** — dragging it moves the whole number.

Native editable text groups remain the Apps SDK buttons (manual click in the editor).

## Gitignored access (record, do not commit values)

| File (gitignored) | Keys used | Purpose |
|-------------------|-----------|---------|
| `5_Symbols/mcp-server/.env` | `CANVA_CLIENT_ID` | Connect integration `OC-AZ9VpNJiU0ps` |
| same | `CANVA_CLIENT_SECRET` | Token refresh (Basic auth) |
| same | `CANVA_REFRESH_TOKEN` | `POST /v1/oauth/token` `grant_type=refresh_token` |
| same | `CANVA_ACCESS_TOKEN` | Bearer for import + design GET; **rewritten** after refresh |
| `5_Symbols/lower-third-text/.env` | `CANVA_APP_ID`, ports | Apps SDK preview only (native ⌘G buttons) |

Rules:

- `.env` is listed in `.gitignore`. Never `git add` it.
- Do not print token values, client secret, or JWT bodies in chat, commits, or reports.
- Refresh rotates both access and refresh tokens; persist both back into `mcp-server/.env`.
- Key Vault names (documentation only): `canva-mcp-CANVA-CLIENT-ID`, `canva-mcp-CANVA-CLIENT-SECRET`.

## Commands (this retry)

```bash
# 1. Load gitignored env and refresh (script does this)
python3 5_Symbols/toolbox/import_numbers_1_100_grouped.py

# 2. Open the printed edit URL in Chrome
open -a "Google Chrome" "https://www.canva.com/design/<DESIGN_ID>/edit"
```

Script steps internally:

1. Read `5_Symbols/mcp-server/.env`
2. `POST /rest/v1/oauth/token` (refresh)
3. Write new tokens back to `.env`
4. Render 100 PNGs + PPTX → `3_Simulation/numbers_1_100_atomic.pptx`
5. `POST /rest/v1/imports` + poll `GET /rest/v1/imports/{jobId}`
6. Print design id + edit URL

## Related files

- `5_Symbols/toolbox/import_numbers_1_100_grouped.py`
- `5_Symbols/lower-third-text/src/intents/design_editor/app.tsx`
- `3_Simulation/numbers_1_100_grouped.pptx` (failed group import)
- `1_Real_Unknown/prompts.md`

## Last updated

2026-09-07 — Compiled By: Grok 4.6
