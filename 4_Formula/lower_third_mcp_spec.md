# 📐 SPEC-015 — Presentation + Lower Third from the CLI via claude.ai Canva MCP

> **Stage 4: Formula** — Dedicated spec document for the verified flow that creates a new Canva presentation from the CLI and places a lower-third text band, entirely through the claude.ai Canva MCP connector. Retry of the SPEC-014 Apps SDK approach. Written by the **Formula Agent**; test evidence supplied by the **Test Agent**; referenced from **Objective 5** in [`1_Real_Unknown/okrs.md`](../1_Real_Unknown/okrs.md).

- **Status:** ✅ Verified (2026-07-12) — user confirmed the design visually in Canva; smoke suite 10/10
- **Registry entry:** SPEC-015 in [`specs.md`](specs.md)
- **Supersedes:** the Apps SDK phase of SPEC-014 (element placement no longer needs a Canva App, dev server, or Developer Portal step)

---

## 🎯 What the spec delivers

From a single CLI session (Claude Code with the claude.ai Canva connector), with **zero manual Canva steps**:

1. A brand-new presentation is generated in the Pexabo workspace.
2. The text `tuncer karaarslan` is placed as a broadcast-style **lower third**: bottom band, centered, 60% page width, white bold 48px.
3. The one remaining manual step (fade-in animation) is precisely bounded and documented with official steps.

## 🛠 The tool chain (how it worked)

| # | Tool | Input | Output |
|---|------|-------|--------|
| 1 | `request-outline-review` | 1-slide outline whose description contains the lower-third text | Outline ready for review |
| 2 | `generate-design-structured` | approved outline, `design_type: presentation`, minimalist style | Job `ac55d283…` — 4 design candidates |
| 3 | `create-design-from-candidate` | job ID + first candidate ID | Design **`DAHPLnGsNgc`** — "Presentation - Tuncer Karaarslan", 1 page |
| 4 | `start-editing-transaction` | design ID | Transaction `945139295442111893`; element map of the 1920×1080 page |
| 5 | `perform-editing-operations` | 5 operations (below) | 5/5 `success` |
| 6 | `commit-editing-transaction` | transaction ID | `status: committed` |

**The five editing operations (step 5):**

```json
[
  { "type": "replace_text",     "text": "tuncer karaarslan" },
  { "type": "format_text",      "formatting": { "font_size": 48, "font_weight": "bold", "color": "#FFFFFF", "text_align": "center" } },
  { "type": "resize_element",   "width": 1152 },
  { "type": "position_element", "top": 930, "left": 384 },
  { "type": "position_element", "top": 70, "left": 976 }
]
```

(The last operation moves the generated "July 2026" caption out of the lower-third band; the first four all target the name element `…-LBj3fFkmWd4vCrkg`.)

## 📏 Lower-third formula (1920×1080 page)

- `width = pageWidth × 0.6` → **1152**
- `left = (pageWidth − width) / 2` → **384**
- `top = pageHeight − 150` → **930** (element height 56.8px at 48px font → bottom margin ≈ 93px, well inside the bottom third which starts at 720)

## 🔑 Key design decision

`perform-editing-operations` **cannot insert a new standalone text element** (only media via `insert_fill`). The spec therefore puts the lower-third text into the *generation outline* so the element already exists, then repositions/reformats it. This is the load-bearing trick that made the retry succeed.

## 🧪 Test of the outputs (Test Agent evidence)

| Check | Evidence | Result |
|-------|----------|--------|
| Design exists in workspace | `get-design` → `DAHPLnGsNgc`, `page_count: 1`, type `presentation`, owner = Pexabo team | ✅ |
| Commit persisted | `updated_at` bumped `1783866875 → 1783866938` after `commit-editing-transaction` | ✅ |
| Element is a lower third | Transaction element map: text `tuncer karaarslan` at `top 930 / left 384 / width 1152 / height 56.8` on a `1920×1080` fixed page | ✅ |
| All ops applied | `edit_operation_results`: 5/5 `status: success` | ✅ |
| Visual confirmation | Post-edit thumbnail shows the centered white name band at the slide bottom; user opened the design in Chrome and confirmed ("it worked") | ✅ |
| Animation boundary | Official Canva Help MCP answer: animations are **editor-only** — no Connect API / Apps SDK / MCP path | ✅ documented |
| Regression gate | `smoke_test.py` 10/10 after nav sync + orphan-check fix | ✅ |

**Design URLs:** edit https://www.canva.com/d/hf5wrKoK43CfXHi · view https://www.canva.com/d/UAfk2VqRm7nF30H

## 🎬 Remaining manual step (accepted limitation — KR 5.3)

Fade-in cannot be applied programmatically on any Canva surface. Official steps (from the Canva Help tool):

1. Open the design and select the `tuncer karaarslan` text element
2. Toolbar → **Animate**
3. Choose **Fade**
4. Set it to **On enter**

Tracked in [`7_Testing_Known/logic.md`](../7_Testing_Known/logic.md) row 5; revisit if Canva ships an animation operation.

## 📎 Related

- Registry: [`specs.md`](specs.md) → SPEC-015 (and SPEC-014 for the superseded Apps SDK path)
- OKR: [`1_Real_Unknown/okrs.md`](../1_Real_Unknown/okrs.md) → Objective 5, KR 5.1–5.3
- Full flow narrative + retry diagram: [`7_Testing_Known/canva_lower_third_flow.md`](../7_Testing_Known/canva_lower_third_flow.md)
- Reasoning: [`llm_thinking_log.md`](llm_thinking_log.md) → 2026-07-12 retry entry
- Capability matrix: [`2_Environment/canva_connection.md`](../2_Environment/canva_connection.md)
