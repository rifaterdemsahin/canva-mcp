# 🛠 Active Workarounds & Technical Debt

> **Stage 6: Semblance** — Documenting temporary workarounds, hotfixes, and the associated technical debt.

---

## 📋 Active Workarounds

### 1. PPTX shape groups flatten on Canva import (SPEC-020)
- **Context:** `p:grpSp` groups in `numbers_1_100_grouped.pptx` imported as design `DAHUgXv2dNs` but Canva ungrouped oval + text. User cannot move circle and number together.
- **Implementation:** Import **atomic PNG badges** (one picture per number) via `5_Symbols/toolbox/import_numbers_1_100_grouped.py`. Native editable ⌘G groups still require the Apps SDK buttons in the editor.
- **Technical Debt:** Badges are rasters — numerals are not live text. True native groups need an in-editor Apps SDK click (`addElementAtPoint({ type: "group" })`).
- **Status:** 🟢 Resolved for move-together; 🔴 native editable groups still editor-only
- **Follow-up Task:** TSK-047 / SPEC-020

---

### 2. Workaround Title
- **Context:** 
- **Implementation:** 
- **Technical Debt:** 
- **Status:** 🔴 Active / 🟢 Resolved
- **Follow-up Task:** 
