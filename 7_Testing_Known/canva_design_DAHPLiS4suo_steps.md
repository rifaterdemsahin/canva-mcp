# 🧪 How Design `DAHPLiS4suo` Was Created — Step by Step

> **Stage 7: Testing Known** — Explains, step by step and with the rationale for each decision, how the Canva presentation at
> `https://www.canva.com/design/DAHPLiS4suo/F_auZJ9vRTOXG-Nxg_xKpQ/edit` came to exist.
> Written by the **Test Agent**; the flow it documents was executed under **SPEC-015** ([`4_Formula/lower_third_mcp_spec.md`](../4_Formula/lower_third_mcp_spec.md)) for **Objective 5** in [`1_Real_Unknown/okrs.md`](../1_Real_Unknown/okrs.md).

---

## 🔎 What this design actually is

One `generate-design-structured` call produced **four design candidates**. `DAHPLiS4suo` ("Presentation - Introducing Tuncer Karaarslan", created 2026-07-12, 1 page) is one of those four — it became a permanent design in the Pexabo account **the moment its candidate link was opened in Chrome**. Its sibling `DAHPLnGsNgc` is the candidate the CLI converted explicitly and then edited into the lower third.

```
generate-design-structured (job ac55d283-072f-47b8-aa60-4bbc9b1b16bb)
    │
    ├─ candidate 1 ──► create-design-from-candidate ──► DAHPLnGsNgc (edited: lower third committed)
    ├─ candidate 2 ─┐
    ├─ candidate 3 ─┼──► opened in Chrome ──► materialized as designs, one of them = DAHPLiS4suo
    └─ candidate 4 ─┘
```

---

## 👣 The steps, in order

### Step 1 — Real Agent: anchor the work to an OKR
**Action:** Added **Objective 5** to `1_Real_Unknown/okrs.md` ("create a new presentation from the CLI with an animated lower third — retry"), tasks TSK-021…026, and logged the prompt in `prompts.md`.
**Rationale:** The framework requires every task to map to a Key Result before any execution; the retry needed measurable success criteria (KR 5.1 create, KR 5.2 position, KR 5.3 animation boundary).

### Step 2 — Environment Agent: re-scan the tool surface
**Action:** Loaded the claude.ai Canva MCP tool schemas available in the Claude Code session and built the capability matrix (now in `2_Environment/canva_connection.md`).
**Rationale:** The previous attempt (SPEC-014) concluded "not possible without an Apps SDK app" — but capability boundaries are per-surface and per-session. The scan revealed editing transactions (`position_element`, `resize_element`, `format_text`) that did not exist in the earlier REST-API/Apps-SDK toolset, and one hard gap: **no insert-text operation**.

### Step 3 — Formula Agent: spec the strategy (SPEC-015)
**Action:** Wrote SPEC-015: *generate the presentation with the lower-third text already in the outline, then reposition it* — because you cannot insert a new text element after the fact.
**Rationale:** This is the load-bearing decision. It turns the missing insert-text operation from a blocker into a non-issue and deletes the whole Apps SDK phase (app scaffold, dev server, Developer Portal registration, manual preview).

### Step 4 — Create the outline
**Action:** Called `request-outline-review` with a 1-slide outline: title "Tuncer Karaarslan", description asking for a broadcast-style slide with a lower-third name strip `"tuncer karaarslan"`, dark background, minimalist style.
**Rationale:** The outline is where the text enters the design (per Step 3). One slide keeps generation fast; the dark-background instruction makes a white lower third readable.

### Step 5 — Generate the presentation ⬅ **this step created `DAHPLiS4suo`**
**Action:** Called `generate-design-structured` (design_type `presentation`, professional/minimalist/short) with the approved outline. Canva's AI returned **job `ac55d283-072f-47b8-aa60-4bbc9b1b16bb` with 4 candidates**, each with a preview URL.
**Rationale:** Canva AI generation is the only MCP path that creates a presentation *with content already in it*. Multiple candidates give layout choice for free.
**How this specific design materialized:** The 4 candidate URLs were opened in Google Chrome at the user's request ("open these"). Opening a candidate saves it into the account as a real design — `DAHPLiS4suo` ("Presentation - Introducing Tuncer Karaarslan") is one of those materialized candidates. Its `created_at` (2026-07-12, ~3 minutes after the sibling `DAHPLnGsNgc`) matches the moment the tabs were opened.

### Step 6 — Convert the chosen candidate explicitly (sibling path)
**Action:** For the working copy, `create-design-from-candidate` converted candidate 1 into design `DAHPLnGsNgc`.
**Rationale:** Only a converted design has a design ID usable by the editing-transaction tools; candidate URLs alone can't be edited programmatically.

### Step 7 — Position the lower third (on `DAHPLnGsNgc`)
**Action:** `start-editing-transaction` → 5 operations in one `perform-editing-operations` call → `commit-editing-transaction`:
1. `replace_text` → exact lowercase `tuncer karaarslan`
2. `format_text` → 48px, bold, white, centered
3. `resize_element` → width 1152 (60% of the 1920px page)
4. `position_element` → top 930, left 384 (bottom third starts at 720; 150px from the bottom edge)
5. `position_element` → moved the generated "July 2026" caption to top 70, out of the band
**Rationale:** The lower-third formula (`width = 0.6 × pageWidth`, centered, `top = pageHeight − 150`) reproduces the broadcast convention; the commit is mandatory because editing operations are draft-only until committed.

### Step 8 — Test Agent: verify the outputs
**Action:** `get-design` confirmed persistence (`updated_at` bumped after commit), the transaction's element map confirmed coordinates, the post-edit thumbnail showed the band, the user confirmed visually in Chrome, and the repo smoke suite passed 10/10.
**Rationale:** Stage 7 requires evidence, not claims — the full 7-point evidence table lives in [`4_Formula/lower_third_mcp_spec.md`](../4_Formula/lower_third_mcp_spec.md).

### Step 9 — The one manual step: fade-in
**Action:** Canva's official Help MCP tool confirmed animations are **editor-only** on every programmatic surface (Connect API, Apps SDK, MCP).
**Manual steps:** open the design → select the name text → **Animate** → **Fade** → **On enter**.
**Rationale:** Documenting a confirmed platform boundary honestly (KR 5.3) beats pretending the automation is complete.

---

## 🧠 Why this approach (summary of the rationale)

1. **Re-derive capabilities before declaring impossibility** — the winning path (MCP editing transactions) simply didn't exist in the session where the first attempt failed.
2. **Put content in at generation time, shape it afterwards** — the generate-then-reposition pattern works around the missing insert-text operation with zero extra infrastructure.
3. **Transactional edits with verification** — every change was committed atomically and proven with element coordinates + `updated_at`, so "it worked" is backed by evidence.
4. **Boundaries documented, not hidden** — the fade-in step is manual by platform design; the spec records the official confirmation so nobody re-burns time on it until Canva ships an animation API.

---

## 🔮 Future prompt — reuse this flow

Copy-paste this into a Claude Code session that has the claude.ai Canva connector enabled:

```
Create a new Canva presentation from the CLI using the Canva MCP:
1. Build a 1-slide outline with request-outline-review whose description includes the
   lower-third text "<NAME>" on a dark, broadcast-style slide, then generate it with
   generate-design-structured (presentation) and convert the best candidate with
   create-design-from-candidate.
2. Open an editing transaction and turn the name text into a lower third:
   replace_text to the exact string, format_text (48px bold white centered),
   resize_element to 60% of page width, position_element centered at
   top = pageHeight − 150. Move any colliding captions out of the bottom band.
   Commit the transaction.
3. Verify with get-design (updated_at bumped) and show me the thumbnail + edit URL.
4. Fade-in cannot be applied programmatically (per SPEC-015) — remind me of the manual
   steps: select the text → Animate → Fade → On enter.
Follow SPEC-015 in 4_Formula/lower_third_mcp_spec.md and log the run through the
7-stage agents (OKR task, thinking log, logic.md row, smoke tests, commit + push).
```

---

## 📎 Related

- **This design:** https://www.canva.com/design/DAHPLiS4suo/F_auZJ9vRTOXG-Nxg_xKpQ/edit
- **Edited sibling with the committed lower third:** `DAHPLnGsNgc` — https://www.canva.com/d/hf5wrKoK43CfXHi
- **Spec + evidence:** [`4_Formula/lower_third_mcp_spec.md`](../4_Formula/lower_third_mcp_spec.md) (SPEC-015)
- **Flow narrative:** [`canva_lower_third_flow.md`](canva_lower_third_flow.md) · **Logic chain:** [`logic.md`](logic.md) row 5
