# Canva Lower Third Text — End-to-End Flow

> **Stage 7: Testing Known** — Documents the complete multi-stage flow for adding a lower third text element ("tuncer karaarslan") with fade-in animation to a Canva presentation. Captures what each stage contributed, the API capability boundaries discovered, and the final working approach.

---

## Flow Overview

```
User Request: "Add lower third 'tuncer karaarslan' + fade-in to presentation DAHPLpF7E9E"
    │
    ▼
1_Real_Unknown ──► Task: programmatic text + animation addition
    │
    ▼
2_Environment ──► Discovered API capability split:
    │               • Connect REST API → design creation ✅, element addition ❌, animation ❌
    │               • Apps SDK → element addition ✅ (addElementAtPoint), animation ❌ (editor only)
    │
    ▼
3_Simulation ──► [Skipped — no visual design needed; text position is formulaic]
    │
    ▼
4_Formula ──► SPEC-014: Two-phase approach
    │           1. Create presentation via REST API (GET /v1/designs)
    │           2. Build Canva App (Apps SDK) for text element addition
    │           Limitation: Fade-in animation → manual Canva editor step
    │
    ▼
5_Symbols ──► lower-third-text Canva App (ID: AAHAADEb9zw)
    │           • Template: hello_world
    │           • Modified app.tsx: addElementAtPoint with text "tuncer karaarslan"
    │           • Positioning: bottom 120px, 60% width, centered
    │           • Dev server: localhost:8080
    │
    ▼
6_Semblance ──► [Not triggered — no errors during flow]
    │
    ▼
7_Testing_Known ──► This document + logic.md premise→conclusion entry
```

---

## Stage-by-Stage Detail

### Stage 1 — Real Unknown (Task Reception)

**Input:** "create a me a document in canva > and in that presentation write 'tuncer karaarslan' as lower third and animate in that presentation with fade in"

**Analysis:** Three distinct actions required:
1. Create a Canva presentation
2. Add lower third text "tuncer karaarslan"
3. Apply fade-in animation

**Initial hypothesis:** Canva Connect REST API should support all three. Discovered it only supports #1.

### Stage 2 — Environment (API Capability Discovery)

**Canva Connect REST API (`api.canva.com/rest/v1`):**

| Capability | Supported? | Endpoint |
|-----------|-----------|----------|
| Create design | ✅ | `POST /v1/designs` |
| List designs | ✅ | `GET /v1/designs` |
| Get design metadata | ✅ | `GET /v1/designs/{id}` |
| Add text elements | ❌ | Not available |
| Add shapes/images | ❌ | Not available |
| Apply animations | ❌ | Not available |
| Autofill brand templates | ✅ | `POST /v1/autofills` |
| Upload brand assets | ✅ | `POST /v1/brand-assets` |
| Export designs | ✅ | `POST /v1/exports` |

**Canva Apps SDK (`@canva/design`):**

| Capability | Supported? | Function |
|-----------|-----------|----------|
| Add text at point | ✅ | `addElementAtPoint(element)` |
| Add native element | ✅ | `addNativeElement(element)` |
| Get page context | ✅ | `getCurrentPageContext()` |
| Get page dimensions | ✅ | `getDefaultPageDimensions()` |
| Edit richtext content | ✅ | `editContent(opts, callback)` |
| Apply animations | ❌ | No SDK API exists |

**Key Discovery:** The REST API and Apps SDK serve different purposes:
- REST API = external app ↔ Canva (create, list, export, autofill templates)
- Apps SDK = run inside Canva editor (add/modify design content, provide app UI)

### Stage 3 — Simulation (Skipped)

No visual simulation needed. The lower third text positioning is determined algorithmically:
- Y position: `pageHeight - 120` (bottom margin of 120px)
- Width: `pageWidth * 0.6` (60% of page width)
- X position: `(pageWidth - width) / 2` (centered)

### Stage 4 — Formula (Specs & Decisions)

**Decision 1 — Two-phase approach:**
1. REST API for design creation (fast, no app infra needed)
2. Apps SDK for element addition (only path available)

**Decision 2 — Animation is manual:**
Canva Apps SDK has no animation API. Fade-in must be applied manually in the Canva editor after text is added.

**Decision 3 — App scaffold:**
Use `@canva/cli apps create --template=hello_world` as base. The hello_world template already has `addElementAtCursor`/`addElementAtPoint` imports — minimal changes needed.

See `SPEC-014` in `4_Formula/specs.md` for the formal spec.

### Stage 5 — Symbols (Implementation)

**Files changed:**
- `5_Symbols/lower-third-text/src/intents/design_editor/app.tsx`
  - Replaced hello_world demo with lower third text adder
  - Uses `addElementAtPoint` with `TextElementAtPoint` type
  - Gets page dimensions from `getCurrentPageContext()`
  - Status feedback via `useState`

**App registration:**
- App ID: `AAHAADEb9zw` (created via `@canva/cli apps create`, public distribution)
- Dev server: `http://localhost:8080`
- Permissions: `design:content:read`, `design:content:write`
- Intent: `design_editor` (runs as side panel in Canva editor)
- Developer Portal: `https://www.canva.com/developers/app/AAHAADEb9zw`

### Stage 6 — Semblance (Errors & Fixes)

No errors encountered. Clean flow from creation to documentation.

### Stage 7 — Testing Known (This Document + Validation)

**Design created:**
- Design ID: `DAHPLpF7E9E`
- Title: "Tuncer Karaarslan"
- Type: presentation (1 page)
- Edit URL: `https://www.canva.com/design/DAHPLpF7E9E/zf6S_nB9QXo9oFGszWuvHQ/edit`

**Remaining manual steps for user:**
1. Go to `https://www.canva.com/developers/app/AAHAADEb9zw`
2. Set **App source > Development URL** to `http://localhost:8080`
3. Click **Preview** to open the app in the Canva editor
4. In the design `DAHPLpF7E9E`, open the "Lower Third Text" app from the side panel
5. Click **Add Lower Third** to insert "tuncer karaarslan"
6. Select the text element in the editor → **Animate** → **Entrance** → **Fade**

---

## Capability Boundaries — Key Learnings

| Layer | What It Does | What It Can't Do |
|-------|-------------|-----------------|
| Connect REST API | Create/manage/export designs, upload assets, autofill templates | Add individual elements, apply animations, edit design content |
| Apps SDK | Add/modify design content, provide plugin UI, read page context | Apply animations, operate externally (runs inside editor) |
| Canva Editor (manual) | Everything (elements, animations, formatting) | Programmatic access |

**The gap:** There is no programmatic way to apply animations to Canva design elements. The Apps SDK has no animation API, and the REST API has no content manipulation endpoints. This is a known limitation of the current Canva developer platform.

---

## Retry — SPEC-015 via claude.ai Canva MCP (2026-07-12)

The flow was retried in a Claude Code CLI session where the **claude.ai Canva MCP connector** is available. This collapsed the two-phase SPEC-014 approach (REST API + Apps SDK + manual portal steps) into a single fully programmatic tool chain:

```
request-outline-review (1 slide, text "tuncer karaarslan" in outline)
    │
    ▼
generate-design-structured (presentation) ──► 4 candidates
    │
    ▼
create-design-from-candidate ──► design DAHPLnGsNgc ("Presentation - Tuncer Karaarslan")
    │
    ▼
start-editing-transaction ──► page 1920×1080, name element found at top 164
    │
    ▼
perform-editing-operations (5/5 success):
    • replace_text → "tuncer karaarslan" (exact lowercase per request)
    • format_text  → 48px, bold, white, centered
    • resize_element → width 1152 (60% of page)
    • position_element → top 930, left 384 (lower-third band)
    • position_element (July 2026 caption) → moved to top 70 to avoid collision
    │
    ▼
commit-editing-transaction ──► saved (updated_at bumped, verified via get-design)
```

**Result:** Presentation creation + lower-third placement is now 100% programmatic from the CLI — no Canva App, no dev server, no Developer Portal step. User opened the design in Chrome and confirmed: "it worked" (2026-07-12). Full spec + evidence table: [`4_Formula/lower_third_mcp_spec.md`](../4_Formula/lower_third_mcp_spec.md).

**Key trick:** `perform-editing-operations` cannot *insert* a standalone text element (only media via `insert_fill`), so the text is included in the generation outline and then repositioned into the lower third.

**Animation boundary re-confirmed (official):** The Canva Help MCP tool states animations can only be applied manually in the editor — no Connect API, Apps SDK, or MCP path exists. Manual step: select the lower-third text → **Animate** → choose **Fade** → set **On enter**.

**Design:** `DAHPLnGsNgc` — edit: https://www.canva.com/d/hf5wrKoK43CfXHi · view: https://www.canva.com/d/UAfk2VqRm7nF30H

---

## Related

- **Spec:** `4_Formula/specs.md` → SPEC-014
- **Thinking Log:** `4_Formula/llm_thinking_log.md` → 2026-07-12 entry
- **Logic Chain:** `7_Testing_Known/logic.md` → entries #1-3
- **App Source:** `5_Symbols/lower-third-text/src/intents/design_editor/app.tsx`
- **Credentials:** `4_Formula/canva_credentials.md`
