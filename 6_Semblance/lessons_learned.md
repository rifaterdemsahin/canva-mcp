# 📓 Lessons Learned & Active Reflection Journal

> This log captures retrospectives, insights, and lessons learned during development milestones.

---

## 📅 2026-05-31: Stage 1 Kanban Implementation & Navigation Setup

### What went well
- Created a standard Markdown-based `kanban.md` that traces tasks back to the 7-Stage Framework.
- Updated the centralized navigation menus (`navigation_config.json`, fallback JSON objects in `index.html`, and `markdown_renderer.html`) to expose the Kanban board as a direct debug option.
- Verified how `markdown_renderer.html` resolves directory paths (defaults to `README.md`) and correctly formatted links.

### Gaps & Challenges
- Navigation fallbacks are duplicated in `index.html` and `markdown_renderer.html`. In the future, it might be cleaner to isolate the fallback menu logic to a shared JS utility, but keeping them synchronized manually works for now and maintains resilience.

### Takeaway for Future AI Agents
- When completing tasks, make sure to update the status of the tasks in `1_Real_Unknown/kanban.md` using matching commit messages.

## 📅 2026-05-31: Stage 1 Cost Tracker Setup

### What went well
- Established a unified structure to track both system infrastructure costs and API token consumption in `1_Real_Unknown/costs.md`.
- Kept navigation fallbacks in sync so that the project menu operates reliably.

### Gaps & Challenges
- Estimates for Key Vault and container execution can fluctuate. Agents should update the log on every significant run/operation to prevent budget surprises.

## 📅 2026-05-31: Agent Git Rule & Error Resolution Update

### What went well
- Clarified the requirement for git error resolution across all core agent documentation (`agents.md`, `gemini.md`, `claude.md`, `copilot.md`, `kilocode.md`).
- Practiced granular commit-and-push cycles for each file modification.

### Gaps & Challenges
- None. Maintaining step-by-step git push commands helps identify remote changes or conflicts early.

## 📅 2026-05-31: Console Debugging & Debug Menu Sync Update

### What went well
- Added custom `debugLog` function to output descriptive messages into browser console when debug mode (`debug=true` cookie) is active.
- Documented Debug Menu synchronization rule across all agent personas to prevent stale menu links when markdown documents are added or updated.

### Gaps & Challenges
- Since debug console logs only print when the debug cookie is active, it protects console cleanliness for standard users while providing rich instrumentation for developers.

## 📅 2026-05-31: Architecture Setup & Sync Rules Update

### What went well
- Created a comprehensive `2_Environment/architecture.md` containing dynamic Mermaid charts showing system components (GitHub Pages, Cloudflare Workers, Fly.io, Azure Key Vault, GitHub Actions).
- Standardized rules in `agents.md` and agent profiles instructing teams to update `architecture.md` as soon as system configurations change.

### Gaps & Challenges
- None. Ensuring all components are mapped visually helps human stakeholders and subsequent AI agents maintain correct contextual orientation.

## 📅 2026-05-31: Kanban Maintenance Section Added

### What went well
- Appended the 7-stage folder structure maintenance checklist directly into `1_Real_Unknown/kanban.md` as requested.
- Tracked this update in the logs to maintain proper execution transparency.

### Gaps & Challenges
- None. Having this checklist helps ensure each stage directory is systematically maintained during development runs.

## 📅 2026-07-12: Smoke Test Runner, Menu Backfill & the 7→1 Sanity Loop

### What went well
- The SPEC-008 runner (`5_Symbols/toolbox/smoke_test.py`) proved its worth on its very first cloud run: it caught a real production bug (stage folder links 404 on GitHub Pages) that local checks could not see. The full error workflow was exercised end-to-end — GitHub Issue #1 → fix → error.log/fix.log → VERIFIED → issue closed.
- Making the runner template-adapted (driven by `navigation_config.json`, stdlib only) means every project bootstrapped from this template inherits working smoke tests with zero changes.
- Regenerating all 3 navigation sources from one script eliminated the manual 3-way sync problem that caused R-003; the runner now guards it automatically.

### Gaps & Challenges
- A parallel push race (R-001) occurred mid-cycle when `static.yml` landed on the remote — resolved with `git pull --rebase`, exactly as the documented mitigation prescribes. The mitigation works; keep pushes sequential.
- The deploy workflow (`static.yml`) still deploys unconditionally — wiring the smoke runner in as a gate is the single remaining step to close R-007.
- Lesson: local-only testing gave a false "all green" — the folder-link bug was only visible against the deployed site. Always run both modes, as the Test Agent rule requires.

## 2026-07-12 — API-created Canva designs and where they "hide"

- **Lesson:** A successful `POST /rest/v1/designs` doesn't put the design in canva.com's Home "Recents" rail — that rail shows editor-opened designs. Look in Projects or use the permanent `canva.com/design/<ID>/…` URL.
- **Lesson:** The `edit_url`/`view_url` in the API response are expiring JWT links (`/api/design/…`); capture the permanent design URL after first open, or add `design:meta:read` scope to list designs on demand.
- **Lesson:** Grant read-back scopes (`design:meta:read`, `profile:read`) alongside write scopes from the start — write-only tokens make success look like failure.
- **Applied:** `6_Semblance/canva_document_visibility.md` documents the full gap analysis; `npm run canva:list` added for programmatic verification once scopes are extended.

---

## 🔄 Retrospective — Lower Third Retry via claude.ai Canva MCP (2026-07-12)

**Milestone:** Objective 5 delivered — new presentation `DAHPLnGsNgc` with a committed lower third, created 100% from the CLI (SPEC-015 retry of SPEC-014).

**What went well**
- Re-scanning the *current* session's tool surface before retrying paid off: the claude.ai Canva MCP editing transactions made the entire Apps SDK phase (app scaffold, dev server, Developer Portal, manual preview) unnecessary.
- "Generate with the text already in the outline, then reposition" neatly sidestepped the missing insert-text operation — 5/5 editing operations succeeded on the first attempt.

**What was learned**
- Capability boundaries are per-surface AND per-session: REST API, Apps SDK, and MCP connector each have different op sets, and the winning path changed between sessions. Always re-derive the matrix before declaring something impossible.
- Animations remain the one hard boundary across every programmatic surface — confirmed via Canva's official Help tool, not just schema absence. One manual step survives: Animate → Fade → On enter.
- `@canva/cli` scaffolds contain a nested `.git` that silently blocks the parent repo (`does not have a commit checked out`); strip it before committing vendor scaffolds.

**Follow-up**
- If Canva ships an animation operation in the MCP/Connect API, retire the manual step and close the loop in `logic.md` row 5.

---

## 🔄 Retrospective — Claude AI Architecture Course Deck (2026-07-12)

**Milestone:** Objective 6 delivered — 5-slide deck `DAHPLyS5QQk` with per-slide shape motifs (shield/hexagon/cylinder/octagon), built entirely from the CLI via the Canva MCP (SPEC-016).

**What went well**
- Scanning the tool schemas for a shape-insert/connector op *before* writing the spec (not after hitting an error mid-execution) turned a would-be failed attempt into a clean upfront capability-gap disclosure, surfaced to the user as a real decision rather than a silent substitution or a stalled task.
- Baking exact shape descriptions + hex colors into the `request-outline-review` slide text worked well enough that Canva's design AI rendered visually distinct, on-brand shapes (e.g. the shield came back cyan and legible) without any custom asset generation.
- Generating 4 candidates and picking the one whose page count exactly matched the approved outline (5 vs. 6 thumbnails on the others) was a reliable, cheap way to avoid an off-spec design without inspecting every candidate in depth.

**What was learned**
- "Native shape injection" is not a thing this MCP surface supports, and won't be worked around by `insert_fill` (media-only) — this is now confirmed twice (SPEC-015, SPEC-016) and should be treated as a stable boundary, not re-investigated per task.
- When a user's literal request collides with a real capability boundary, presenting 2–3 concrete options (not just "here's what I did instead") produces a faster, cleaner decision than either forcing a workaround or silently downgrading the ask.
- Canva pages have no MCP-settable "name"/"label" field — only index + thumbnail. Any future spec that wants named/labeled slides should track that naming in project docs, not expect it to round-trip into the Canva UI.
- AI-generated layouts commit to their own left-text/right-graphic grid; fighting that grid with `position_element` to satisfy a literal "which column" instruction risks overlapping the artwork and separating a header from its body copy. Text alignment is the safer lever once the AI has already picked a layout.

**Follow-up**
- Manual step still open for the user: Elements → L (line tool) → snap lines between shapes/text to draw the cross-slide AI data pipeline connectors.
- If a future task needs deterministic shape fidelity (not just "on theme"), revisit the deferred alternative in SPEC-016: generate icon images + `upload-asset-from-url` + `insert_fill`.
