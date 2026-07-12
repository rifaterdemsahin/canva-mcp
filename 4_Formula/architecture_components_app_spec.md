# SPEC-017: Reusable Native Shape Components for the Claude AI Architect Course

- **Status:** Active — code shipped (typechecked clean); shape rendering requires a one-time manual verification pass (dev server + Developer Portal + in-editor click) that only a human can perform, per the Apps SDK constraint below
- **Owner:** Formula Agent (plan) → Symbols Agent (app code) → Test Agent (verification)
- **Related OKR:** Objective 7 in `1_Real_Unknown/okrs.md`
- **Related Files:** `2_Environment/canva_capability_research.md` (source research), `4_Formula/architecture_course_mcp_spec.md` (SPEC-016, the AI-layout tradeoff this closes), `5_Symbols/lower-third-text/` (app being extended)

## Description

SPEC-016 delivered the "Claude AI Architecture" course deck using AI-interpreted shapes (no fidelity guarantee). SPEC-017 closes that gap: extend the existing `lower-third-text` Canva App (built for SPEC-014) with 4 new buttons that each insert a **true native, editable Canva shape element** via the Apps SDK — reusable across any future course deck, not just this one design.

This reintroduces the Apps SDK phase (dev server, Developer Portal, manual preview/click) that SPEC-015/016 avoided — an explicit, accepted tradeoff for deterministic shape fidelity, per the candidate note in `canva_capability_research.md`.

## Why Extend, Not Duplicate

The existing app (`AAHAADEb9zw`, `5_Symbols/lower-third-text/`) already has working `design_editor` intent scaffolding, permissions, and dev-server config. Adding buttons to it is less overhead than a new `@canva/cli apps create` run, and matches the "reusable component library" framing — one app the user opens in the side panel of any design to drop in course-standard components (lower third + 4 shapes).

## Shape Definitions

All 4 shapes use **straight-line paths only** (`M`/`L`/`Z`) — no bezier curves — to minimize path-syntax risk. `viewBox: { width: 200, height: 200, left: 0, top: 0 }` for all. Background gap color `#0B0F19` matches the course's dark theme.

### Shield — Cyan `#06B6D4` (double-border via 3 nested pentagons)
```
Outer (cyan):  M 60 20 L 140 20 L 170 70 L 100 190 L 30 70 Z
Middle (bg):   M 72 32 L 128 32 L 155 72 L 100 172 L 45 72 Z
Inner (cyan):  M 84 44 L 116 44 L 138 74 L 100 152 L 62 74 Z
```
3 paths, 2 colors.

### Hexagon — Purple `#A855F7` (concentric dual-hexagon via 3 nested regular hexagons, R=85/60/35)
```
Outer (purple): M 100 15 L 174 58 L 174 143 L 100 185 L 26 143 L 26 58 Z
Middle (bg):    M 100 40 L 152 70 L 152 130 L 100 160 L 48 130 L 48 70 Z
Inner (purple): M 100 65 L 130 83 L 130 117 L 100 135 L 70 117 L 70 83 Z
```
3 paths, 2 colors.

### Cylinder — Emerald `#10B981` (3 stacked bands = storage/cache tiers, + 1 highlight band)
```
Top band:       M 40 30 L 160 30 L 160 70 L 40 70 Z       (emerald)
Top highlight:  M 40 30 L 160 30 L 160 38 L 40 38 Z        (light emerald #34D399)
Middle band:    M 40 78 L 160 78 L 160 118 L 40 118 Z      (emerald)
Bottom band:    M 40 126 L 160 126 L 160 166 L 40 166 Z    (emerald)
```
4 paths, 2 colors.

### Octagon — Amber `#F59E0B` (hub-and-spoke: outer ring + hub + 4 spokes)
```
Outer (amber):  M 70 30 L 130 30 L 170 70 L 170 130 L 130 170 L 70 170 L 30 130 L 30 70 Z
Middle (bg):    M 75 41 L 126 41 L 160 75 L 160 126 L 126 160 L 75 160 L 41 126 L 41 75 Z
Hub (amber):    M 90 76 L 111 76 L 125 90 L 125 111 L 111 125 L 90 125 L 76 111 L 76 90 Z
Spoke N (amber): M 95 30 L 105 30 L 105 76 L 95 76 Z
Spoke S (amber): M 95 125 L 105 125 L 105 170 L 95 170 Z
Spoke E (amber): M 125 95 L 170 95 L 170 105 L 125 105 Z
Spoke W (amber): M 30 95 L 75 95 L 75 105 L 30 105 Z
```
7 paths, 2 colors.

All 4 shapes are well within the Apps SDK's constraints (≤30 paths, ≤2KB path data, ≤6 unique fill colors, single `M` per path, no `Q` command) confirmed in `2_Environment/canva_capability_research.md`.

## Implementation Plan

1. Add 4 handler functions to `5_Symbols/lower-third-text/src/intents/design_editor/app.tsx`, one per shape, each calling `addElementAtPoint({ type: "shape", paths: [...], viewBox: {...} })` at a sensible default position/size.
2. Add 4 corresponding `Button`s to the UI, alongside the existing "Add Lower Third" button, so the app reads as a small reusable component library.
3. No changes to `canva-app.json` — existing `canva:design:content:write` permission already covers shape insertion.

## Demo Deck (delivered independent of the app-code change)

A presentation was generated via the CLI Canva MCP (same `request-outline-review` → `generate-design-structured` pattern as SPEC-016) with one slide per component, ready to receive the native shape once the app inserts it. This part required no code change and no confirmation gate — see Delivery Notes below for the design ID.

## Manual Steps Required (unchanged Apps SDK limitation — same as SPEC-014)

The Apps SDK only runs inside the Canva editor and only responds to a human clicking its UI — there is no CLI/API hook to trigger `addElementAtPoint` from outside the editor. After the code change ships:
1. `npm start` in `5_Symbols/lower-third-text/` to run the dev server.
2. Open `https://www.canva.com/developers/app/AAHAADEb9zw`, confirm **Development URL** is set to the local dev server.
3. Open the demo deck, click **Preview** on the app to load it in the side panel.
4. On each slide, click the matching button (Add Shield / Add Hexagon / Add Cylinder / Add Octagon) to insert that native shape.

## Delivery Notes

- **Demo deck:** `DAHPLyaJNJ8` ("Presentation - Reusable Architecture Components"), 5 pages (Title + one slide per component), edit URL https://www.canva.com/d/NzrcdLRkdh4dT1k.
- **App code:** 4 handler functions + 4 buttons added to `5_Symbols/lower-third-text/src/intents/design_editor/app.tsx`, alongside the existing "Add Lower Third" button. `npx tsc --noEmit` is clean for all new code — the only 2 typecheck errors in the project (`DOCS_URL` export, `TypographyTone` union) are pre-existing and unrelated (confirmed via `git stash` diff before/after this change).
- **What is and isn't verified:** the code compiles and follows the Apps SDK's documented `ShapeElementAtPoint` contract exactly (`type`, `viewBox`, `paths`, `top`/`left`/`width`/`height`) — confirmed against `node_modules/@canva/design/index.d.ts` directly, not just the public docs. What is **not** verified is that the shapes render correctly inside the Canva editor, because that requires a human to run the dev server, set the Development URL in the Developer Portal, open the demo deck, click Preview, and click each button — no CLI/API path exists to do this (same boundary as SPEC-014's lower-third app). This is the user's remaining manual step.

## Manual Verification Steps (do this to see the shapes)

1. `cd 5_Symbols/lower-third-text && npm start` (dev server on `localhost:8080`).
2. Open `https://www.canva.com/developers/app/AAHAADEb9zw` and confirm **Development URL** is set to `http://localhost:8080`.
3. Open the demo deck (https://www.canva.com/d/NzrcdLRkdh4dT1k), click **Preview** on the app in the side panel.
4. On the **Shield Component** slide, click **Add Shield (Cyan)**; repeat **Add Hexagon (Purple)** on the Hexagon slide, **Add Cylinder (Emerald)** on the Cylinder slide, **Add Octagon (Amber)** on the Octagon slide.
5. Confirm each shape appears as a native, selectable/editable Canva element (not a pasted image) — right-click → it should show shape editing options, not "Replace image."

## Last Updated

2026-07-12
