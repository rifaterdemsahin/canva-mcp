# 📘 How to Use the Claude AI Architect Course Tools

> **Stage 4: Formula** — Practical usage guide for the two tools built for the Claude AI Architect course: the **Voiceover-to-Presentation API** (SPEC-018) and the **Reusable Shape Components App** (SPEC-017). Maintained by the Formula Agent.

---

## 1. Voiceover-to-Presentation API (SPEC-018)

Turns a title + a voiceover script into a Canva presentation. Location: `5_Symbols/presentation-api/`.

### What it actually automates, and what it doesn't

- ✅ **Automated:** parsing your voiceover script into a Canva-ready slide outline (splitting on `Act N` / `Panel N`, pulling out quoted dialogue as speech-bubble bullets), and tracking the job's status.
- ⚠️ **Not automated:** the actual Canva AI generation step. Canva's AI design generation only works inside an agent session with the Canva connector attached — there's no API key a background script could use for it. So after you submit a job, you (or I, in a live chat) have to say "check pending presentation jobs" to actually generate it.

### Step-by-step

**1. Start the API** (one-time per session):
```bash
cd 5_Symbols/presentation-api
npm install        # first time only
npm run dev         # starts on http://127.0.0.1:4021
```

**2. Submit your title + voiceover:**
```bash
curl -X POST http://127.0.0.1:4021/api/presentations \
  -H 'Content-Type: application/json' \
  -d '{
    "title": "My New Deck",
    "voiceover": "Act 1 — Setup\n\nYour script here, with any embedded '\''dialogue'\'' in quotes. In Panel 1, something happens. In Panel 2, something else happens.\n\nAct 2 — Payoff\n\nMore script text."
  }'
```
This returns immediately with a `job_id` and a `status: "pending"` — plus the fully-parsed `outline` field, so you can sanity-check what will be sent to Canva before anything is generated.

**Formatting tips that matter to the parser:**
- Put each act heading on its own line, formatted like `Act 1 — Problem` (an em dash or hyphen both work).
- Reference `Panel N` inline in your prose (`"In Panel 1, ..."`) if you want that beat to become its own slide — otherwise the whole act becomes one slide.
- Wrap spoken lines in quotes (`'like this'` or `"like this"`) and they'll appear as `Speech bubble: "..."` bullets, kept separate from the narrative text.
- No `Act N` headings at all? The parser falls back to one slide per `Panel N` mention, or a single slide if there's no structure at all — it never errors out on unstructured text.

**3. Ask me to generate it.** In a live Claude Code chat with the Canva MCP connector attached, say something like *"check pending presentation jobs and generate them."* I will:
   - `GET /api/presentations/jobs/pending`
   - Run the real MCP chain (`request-outline-review` → you approve → `generate-design-structured` → pick a candidate → `create-design-from-candidate`)
   - Write the result back with the deterministic helper:
     ```bash
     npm run complete-job -- --id <job_id> --design-id <id> --edit-url <url> --view-url <url>
     ```

**4. Check the result:**
```bash
curl -s http://127.0.0.1:4021/api/presentations/<job_id> | python3 -m json.tool
```
Once `status` is `"done"`, `design_id`, `edit_url`, and `view_url` are populated.

### Full API reference

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/api/presentations` | `{ title, voiceover }` → parses outline, creates a `pending` job |
| `GET` | `/api/presentations/:id` | Job status/result |
| `GET` | `/api/presentations/jobs/pending` | List pending jobs (what I check when you ask me to process the queue) |
| `PATCH` | `/api/presentations/:id` | Written by `complete-job`, not meant to be called by hand |

More detail: [`5_Symbols/presentation-api/README.md`](../5_Symbols/presentation-api/README.md). Full spec + test evidence: [`voiceover_presentation_api_spec.md`](voiceover_presentation_api_spec.md).

---

## 2. Reusable Shape Components App (SPEC-017)

A Canva App that inserts **true native, editable** architecture-diagram shapes (not images) — a Shield (cyan), Hexagon (purple), Cylinder (emerald), and Octagon (amber) — into any Canva design, styled consistently for the course. Location: `5_Symbols/lower-third-text/` (the app was extended, not duplicated — it also still has the original "Add Lower Third" button from SPEC-014).

### Why this needs a manual step

Canva Apps only run inside the Canva editor and only respond to a human clicking their buttons — there is no API or CLI hook to trigger them remotely. This is a hard platform limitation, not a shortcut I skipped.

### Step-by-step

**1. Start the app's dev server:**
```bash
cd 5_Symbols/lower-third-text
npm start
```
This serves the app locally (default `http://localhost:8080`).

**2. Point the Developer Portal at it:** open https://www.canva.com/developers/app/AAHAADEb9zw and confirm **Development URL** is set to your local dev server address.

**3. Open a design and preview the app:** open any Canva design (for example the demo deck at https://www.canva.com/d/NzrcdLRkdh4dT1k), open the app's side panel, and click **Preview**.

**4. Click the button for the shape you want:**

| Button | Shape | Color |
|---|---|---|
| Add Shield (Cyan) | Double-border rounded shield | `#06B6D4` |
| Add Hexagon (Purple) | Concentric dual-hexagon | `#A855F7` |
| Add Cylinder (Emerald) | 3D stacked storage tiers | `#10B981` |
| Add Octagon (Amber) | Hub-and-spoke | `#F59E0B` |
| Add Lower Third | (original SPEC-014 feature) | — |

Each click drops the shape at the center of the current page. Because it's a native shape (not a pasted image), you can then resize, recolor, or restyle it like any other Canva element.

**5. Verify it's really native (not an image):** right-click the inserted shape — you should see shape-editing options (like "Edit fill"), not "Replace image."

More detail, including the exact SVG path data for each shape: [`architecture_components_app_spec.md`](architecture_components_app_spec.md).

---

## Which tool do I use for what?

| I want to... | Use |
|---|---|
| Turn a script/voiceover into a whole new presentation | **Voiceover-to-Presentation API** |
| Drop one specific, precisely-colored architecture shape into an existing slide | **Shape Components App** |
| Both — a new deck *and* precise shapes on it | Generate the deck with the API first, then open it and use the Shape Components App to add shapes to individual slides |

## Last Updated

2026-07-12
