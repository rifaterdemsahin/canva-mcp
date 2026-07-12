# Technical Specifications

> **Stage 4: Formula** — Living specs document. All features must be specced here before code touches `5_Symbols`.

## Spec System Rules
1. **Before implementation** — every feature gets a spec entry here
2. **New tasks arriving** — check this file for affected specs, flag changes with `[NEEDS UPDATE]`
3. **Warn on mismatch** — if a task would alter behavior covered by an existing spec, flag and warn before coding
4. **Post-implementation** — update the spec to reflect final decisions
5. **Code drift detection** — After implementation in `5_Symbols`, diff the code against active specs. Flag deviations with `[DRIFT]` and document in `llm_thinking_log.md`

---

## Active Specs

### SPEC-001: Two-Menu Navigation Architecture
- **Status:** Active
- **Description:** Project Menu (always visible) + Debug Menu (toggle via bottom-right button, persisted via cookie)
- **Key Behaviors:**
  - Debug button always visible at bottom-right
  - Click toggles debug menu overlay
  - Cookie `debug=true` persists state
  - Both menus read from `navigation_config.json`
  - Fallback arrays in `index.html` and `markdown_renderer.html` must stay in sync
  - Search with autocomplete in debug menu
- **Related Files:** `index.html`, `markdown_renderer.html`, `navigation_config.json`
- **Last Updated:** 2026-05-30

### SPEC-002: Markdown Renderer with GitHub Edit
- **Status:** Active
- **Description:** `5_Symbols/markdown_renderer.html` renders any markdown file via URL query parameter, with Edit on GitHub button. Lives in `5_Symbols` (it is source code, not a root entry point); only `index.html` stays at the root for GitHub Pages.
- **Key Behaviors:**
  - Loads markdown from `?file=` query parameter; the parameter is always a **root-relative** path (e.g. `1_Real_Unknown/risks.md`)
  - All internal fetches/links inside the renderer are prefixed with `../` (site root is one level up from the renderer)
  - Renders via marked.js + PrismJS syntax highlighting
  - "Edit on GitHub" button derives `{user}/{repo}` from `location.hostname`/`pathname` on `*.github.io` (template-reusable); falls back to the configured repo when served locally
  - Debug menu toggle available in renderer
- **Related Files:** `5_Symbols/markdown_renderer.html`, `index.html`, `navigation_config.json`
- **Last Updated:** 2026-07-12

### SPEC-003: Image Carousel
- **Status:** Active
- **Description:** Auto-updating image carousel on `index.html` loaded dynamically from `3_Simulation/`
- **Key Behaviors:**
  - Reads image list from `carousel_config.json`
  - Supports `.png`, `.jpg`, `.gif`, `.webp`
  - Manual navigation with prev/next buttons
  - Auto-advance with CSS transitions
- **Related Files:** `index.html`, `3_Simulation/carousel_config.json`
- **Last Updated:** 2026-05-30

### SPEC-004: Secrets Management via Azure Key Vault
- **Status:** Active
- **Description:** All secrets stored in Azure Key Vault, loaded at runtime, never in git
- **Key Behaviors:**
  - `.env.example` lists required variables with empty values
  - Secrets loaded via Azure SDK or GitHub Actions
  - One Key Vault per environment (dev/staging/prod)
  - Supabase keys, Axiom tokens, Fly.io tokens all in Key Vault
- **Related Files:** `.env.example`, `2_Environment/setup_azure.md`
- **Last Updated:** 2026-06-19

### SPEC-005: Specs System (this file)
- **Status:** Active
- **Description:** All features must be specced in `4_Formula/specs.md` before implementation. New tasks check specs, flag updates, warn on conflicts.
- **Key Behaviors:**
  - Spec lives in `4_Formula/specs.md`
  - New tasks check for affected specs
  - `[NEEDS UPDATE]` flag for specs requiring changes
  - Warning emitted when a task contradicts an active spec
- **Related Files:** `4_Formula/specs.md`, `AGENTS.md`, all agent persona files
- **Last Updated:** 2026-07-11

### SPEC-006: Stage Dependency Chain (1 → 2 → 3)
- **Status:** Active
- **Description:** Defines how upstream stages feed each other and what each stage contributes to the downstream stages.
- **Key Behaviors:**
  - `1_Real_Unknown` defines the objective: problem statement, OKRs, hypotheses, and open questions. This drives what tools and environment are needed.
  - `2_Environment` defines the tooling: blueprints, architecture (Mermaid/Excalidraw), setup guides, dependencies, libraries, and packages. Changes here determine what is possible in 3_Simulation designs.
  - `3_Simulation` defines the vision: visual designs, mockups, wireframes, flow diagrams. These must reflect both the objectives (from stage 1) and the technical constraints (from stage 2).
  - The chain flows: `1_Real_Unknown` (why) → `2_Environment` (what tools) → `3_Simulation` (visual vision) → `4_Formula` (specs + approval) → `5_Symbols` (code).
  - When a dependency changes in stage 2 (e.g., a new library or tool), stage 3 designs must be reviewed for compatibility and updated if needed.
  - Stage 1 OKR changes ripple through stage 2 (do we need new tools?) and stage 3 (does the design still match the objective?).
- **Related Files:** `1_Real_Unknown/problem_statement.md`, `1_Real_Unknown/okrs.md`, `2_Environment/architecture.md`, `2_Environment/dependencies.md`, `2_Environment/tools.md`, `3_Simulation/design_workflow.md`, `4_Formula/specs.md`
- **Last Updated:** 2026-07-11

### SPEC-007: Code Drift Detection
- **Status:** Active
- **Description:** Formula Agent identifies when code in `5_Symbols` deviates from active specs in `specs.md`
- **Key Behaviors:**
  - After `5_Symbols` implementation, compare code behavior against the active spec
  - Any deviation is flagged with `[DRIFT]` in the relevant spec entry
  - Drift is documented in `llm_thinking_log.md` with the gap analysis
  - Drift must be resolved before the spec gate passes (spec + designs reviewed)
  - If drift is intentional, update the spec first to capture the new behavior, then flag drift as resolved
- **Related Files:** `4_Formula/specs.md`, `4_Formula/llm_thinking_log.md`, `5_Symbols/*`
- **Last Updated:** 2026-07-11

### SPEC-008: Template-Adapted Smoke Test Runner
- **Status:** Active
- **Description:** A dependency-free Python script (`5_Symbols/toolbox/smoke_test.py`) that scans the project's pages and structure, runs the smoke test suite, and generates `6_Semblance/smoke_test_report.md`. Template-adapted: it reads `navigation_config.json` as its source of truth, so any project bootstrapped from this template gets working smoke tests without code changes.
- **Key Behaviors:**
  - Reads `navigation_config.json` (projectMenu + debugMenu) and derives the page/file inventory from it — no hardcoded file lists
  - Checks: config JSON validity, every menu URL resolves to an existing file/folder, required root files exist (`index.html`, `markdown_renderer.html`, `README.md`, `robots.txt`, `sitemap.xml`), social links present in `index.html`, GitHub Pages URL present in `README.md`, 3-way navigation sync (config = `index.html` fallback = `markdown_renderer.html` fallback), stage markdown files not orphaned from the debug menu, no committed secrets patterns
  - Optional `--base-url` mode fetches the deployed site over HTTP and verifies pages return 200 (cloud smoke test); default mode is local filesystem
  - Writes results to `6_Semblance/smoke_test_report.md` in the report format defined in `7_Testing_Known/smoke_tests.md`; exit code 0 = all pass, 1 = failures (CI gate compatible)
  - Failures must be raised as GitHub Issues per the Smoke Tests & GitHub Issues rule
- **Related Files:** `5_Symbols/toolbox/smoke_test.py`, `6_Semblance/smoke_test_report.md`, `7_Testing_Known/smoke_tests.md`, `navigation_config.json`
- **Last Updated:** 2026-07-12

### SPEC-009: Sanity Check Report Loop (7 → 1)
- **Status:** Active
- **Description:** The canonical sanity check report lives in `1_Real_Unknown/sanity_check_report.md`, owned by the Real Agent's sanity check sub-agent. Stage 7 (`7_Testing_Known`) produces the validation data (smoke test results, validation reports, logic chains); the Real Agent consumes that data and publishes the report in Stage 1 — completing the 7 → 1 loop back to the "why".
- **Key Behaviors:**
  - `7_Testing_Known/sanity_check_report.md` is a data-source pointer document, not the report itself; historical reports move to `7_Testing_Known/_obsolete/`
  - The Stage-1 report cites its Stage-7 data inputs (`smoke_tests.md`, `validation_report.md`, `logic.md`, latest `6_Semblance/smoke_test_report.md`)
  - Every sanity check run updates `1_Real_Unknown/risks.md` (new risks added, solved risks moved)
  - Loop: 1 (objectives) → … → 7 (test evidence) → 1 (sanity verdict against objectives)
- **Related Files:** `1_Real_Unknown/sanity_check_report.md`, `1_Real_Unknown/risks.md`, `7_Testing_Known/sanity_check_report.md`, `6_Semblance/smoke_test_report.md`
- **Last Updated:** 2026-07-12

### SPEC-010: Template Consumption by Downstream Projects
- **Status:** Active
- **Description:** This repository is a **template** — other projects start from it. Every consumer-facing file must be reusable without manual archaeology: placeholders are explicit, project-specific values are concentrated, and each agent persona file tells the consumer LLM agent how to bootstrap.
- **Key Behaviors:**
  - All 5 agent files (`agents.md`, `claude.md`, `gemini.md`, `copilot.md`, `kilocode.md`) carry a "Using This Template" section with the placeholder table and bootstrap steps for consumer LLM agents
  - Standard placeholders: `{{PROJECT_NAME}}`, `{{GITHUB_USER}}`, `{{REPO_NAME}}`, `{{PAGES_URL}}`, `{{LINKEDIN_URL}}`, `{{YOUTUBE_URL}}` — consumers search-and-replace these six values
  - Project-specific values live in: `navigation_config.json` (projectMenu), `index.html` (social links, titles), `README.md` (Pages URL), `sitemap.xml`/`robots.txt` (absolute URLs), `supabase/config.toml` under `2_Environment/` (project id)
  - Runtime code must not hardcode the repo where it can derive it (e.g. renderer's GitHub edit URL derives user/repo from the Pages URL)
  - Bootstrap validation: run `python3 5_Symbols/toolbox/smoke_test.py` after replacing placeholders — it is config-driven and needs no adaptation
  - CI/CD is owned by the **Formula Agent**: `.github/workflows/static.yml` runs the smoke test gate, then deploys to GitHub Pages (Continuous Integration → Continuous Delivery → Continuous Deployment)
- **Related Files:** `agents.md`, `claude.md`, `gemini.md`, `copilot.md`, `kilocode.md`, `.github/workflows/static.yml`, `5_Symbols/toolbox/smoke_test.py`
- **Last Updated:** 2026-07-12

### SPEC-011: Canva App Credentials in Azure Key Vault
- **Status:** Active
- **Description:** Canva OAuth client credentials (Connect API Integration ID `OC-AZ9VpNJiU0ps` + Client Secret) stored in the existing Azure Key Vault `dp-kv-deliverypilot` under secret names `canva-mcp-CANVA-CLIENT-ID` and `canva-mcp-CANVA-CLIENT-SECRET`. Never committed to git. Also documented: Canva App ID `AAHAAN3AO5Y` for Canva App development (separate from Connect API).
- **Key Behaviors:**
  - Secrets are set via `5_Symbols/toolbox/secrets.sh set` — never via manual `az keyvault secret set` without the wrapper script
  - Client ID is `OC-AZ9VpNJiU0ps` (Connect API integration "mcp"); Client Secret retrieved from Canva Developer Portal → Integrations → Connect API → Authentication tab
  - After storing, the Canva CLI must authenticate locally via `npx @canva/cli@latest login` (OAuth token cached per machine)
  - Both the native CLI MCP (`canva-cli`) and custom MCP (`canva-custom-tools`) are configured in `kilo.json` for Kilo/DeepSeek agent access
  - Token exchange from auth callback uses Basic Auth (`client_id:client_secret`) via `auth.html` manual secret paste or server-side
- **Related Files:** `4_Formula/canva_credentials.md`, `2_Environment/canva_connection.md`, `kilo.json`, `5_Symbols/toolbox/secrets.sh`, `auth.html`
- **Last Updated:** 2026-07-12

### SPEC-012: Canva OAuth PKCE Flow
- **Status:** Active
- **Description:** OAuth 2.0 authorization code flow with PKCE (Proof Key for Code Exchange) for the Canva Connect API integration (`OC-AZ9VpNJiU0ps`). The flow is captured across 7 screenshots in `3_Simulation/` showing the admin permission fix and the full authorization lifecycle.
- **Key Behaviors:**
  - **Flow:** `auth.html` → generate PKCE code_verifier + challenge → redirect to Canva authorize endpoint → user approves scopes → Canva redirects back to `auth.html?code=<JWT>` → exchange code for tokens using client_secret
  - **Admin restriction:** Team admin must whitelist the integration in Settings → Permissions → Apps & Integrations before the "Allow" button becomes active
  - **auth.html** handles: PKCE generation, redirect, callback code display, manual token exchange (user pastes client_secret from vault)
  - **7 screenshots** document each step: restriction → admin fix → landing → consent → callback
  - **Carousel** in `index.html` displays every simulation screenshot (7 OAuth + 3 CLI) via `3_Simulation/carousel_config.json`
  - Token exchange requires Basic Auth (`client_id:client_secret`) — auto-exchange fails without the secret, manual fallback provided
- **Related Files:** `auth.html`, `3_Simulation/carousel_config.json`, `3_Simulation/canva_oauth_*.jpg`, `3_Simulation/image_prompts.md`, `4_Formula/canva_credentials.md`
- **Last Updated:** 2026-07-12

---

### SPEC-013: Canva CLI Login & Integration Review Submission
- **Status:** Active
- **Description:** Authenticate the native Canva CLI (`npx @canva/cli@latest login`) as `info@pexabo.com` and submit the Connect API integration (`OC-AZ9VpNJiU0ps`, named "mcp") for Canva's review. The CLI login journey is captured in 3 screenshots in `3_Simulation/` (`canva_cli_01`–`03`).
- **Key Behaviors:**
  - **Admin restriction (same pattern as SPEC-012):** the Canva CLI integration must be whitelisted by the team admin in Settings → Apps and integrations → Manage integrations before its OAuth "Allow" button activates
  - **CLI scopes:** read apps; create/modify/delete apps; read user profile
  - **Login success** lands on canva.dev with next-step commands (`canva apps create`, `canva apps list`); the token is cached locally by the CLI — never committed
  - **Integration review:** submitted 2026-07-12 via the developer portal submission page — status **In review** ("passed our initial check and is now in the queue"); status recorded in `2_Environment/mcp.md`
- **Related Files:** `3_Simulation/canva_cli_*.jpg`, `3_Simulation/carousel_config.json`, `2_Environment/mcp.md`, `2_Environment/canva_connection.md`
- **Last Updated:** 2026-07-12

### SPEC-014: Canva Design Element Addition via Apps SDK

- **Status:** Active
- **Description:** Programmatic addition of text elements (e.g., lower thirds) to a Canva design requires a two-phase approach: (1) create the design via the Connect REST API (`POST /v1/designs`), (2) add elements via a Canva App built with the Apps SDK (`addElementAtPoint`). The REST API alone cannot add individual elements; the Apps SDK cannot create/export designs or apply animations. Animations (e.g., fade-in) remain a manual editor-only step — no programmatic API exists for them.
- **Key Behaviors:**
  - **Phase 1 — REST API:** `POST /v1/designs` with `design_type: { type: "preset", name: "presentation" }` and a title. Returns `designId`, `editUrl`, `viewUrl`. Requires `design:content:write` scope and a valid OAuth access token.
  - **Phase 2 — Apps SDK:** A Canva App (intent: `design_editor`) calls `addElementAtPoint({ type: "text", top, left, width, children: [...] })` to place text at a calculated lower-third position. Requires `getCurrentPageContext()` to read page dimensions.
  - **App manifest requirements:** `canva:design:content:read` and `canva:design:content:write` permissions; `design_editor` intent enrolled.
  - **Development workflow:** App created via `@canva/cli apps create`, dev server on `localhost:8080`, registered in Developer Portal, previewed inside the Canva editor.
  - **Animation limitation:** No SDK or REST API exists for applying entrance/exit animations. User must apply them manually in the Canva editor (Select element → Animate → Entrance → Fade).
  - **Lower third positioning formula:** `top = pageHeight - 120`, `left = (pageWidth - pageWidth * 0.6) / 2`, `width = pageWidth * 0.6`.
  - **Capability boundary table** (see `7_Testing_Known/canva_lower_third_flow.md` for full matrix):
    - REST API: design CRUD ✅, element addition ❌, animation ❌
    - Apps SDK: element addition ✅, animation ❌, design CRUD ❌
    - Canva Editor: all ✅, programmatic ❌
- **Related Files:** `5_Symbols/lower-third-text/src/intents/design_editor/app.tsx`, `5_Symbols/lower-third-text/canva-app.json`, `7_Testing_Known/canva_lower_third_flow.md`, `4_Formula/canva_credentials.md`
- **Last Updated:** 2026-07-12

### SPEC-015: Presentation + Lower Third via claude.ai Canva MCP (Retry of SPEC-014)

- **Status:** ✅ Verified (2026-07-12) — delivered as design `DAHPLnGsNgc`; user confirmed visually; full spec document with test evidence: [`lower_third_mcp_spec.md`](lower_third_mcp_spec.md)
- **Description:** Retry of the lower-third flow using the claude.ai Canva MCP connector available inside the Claude Code CLI session. This replaces the SPEC-014 Apps SDK phase: the presentation is *generated with the lower-third text already in the slide content*, then MCP editing operations reposition and format it into a lower third. No Apps SDK, no dev server, no Developer Portal step.
- **Key Behaviors:**
  - **Phase 1 — Generate:** `request-outline-review` (1-slide outline containing the text "tuncer karaarslan") → `generate-design-structured` (design_type `presentation`). Returns a new design ID + edit URL. KR 5.1.
  - **Phase 2 — Position:** `start-editing-transaction` → locate the text element → `position_element` (bottom band: top ≈ pageHeight − 120–180), `resize_element` (width ≈ 60% page width), `format_text` (center) → `commit-editing-transaction`. KR 5.2. Note: `position_element`/`resize_element` are only valid on fixed (non-responsive) pages — presentations qualify.
  - **Phase 3 — Animation boundary:** `perform-editing-operations` has NO animation operation (op set: update_title, replace_text, update_fill, insert_fill, delete_element, find_and_replace_text, position_element, resize_element, format_text, update_autofill_field). If no path exists, confirm via the Canva `help` MCP tool and document the official manual steps. KR 5.3.
  - **Capability delta vs SPEC-014:** MCP editing transactions CAN reposition/resize/format existing elements externally (Apps SDK no longer required for this), but CANNOT insert new standalone text elements (only media via `insert_fill`) and CANNOT apply animations.
- **Related Files:** `1_Real_Unknown/okrs.md` (Objective 5), `7_Testing_Known/canva_lower_third_flow.md`, `7_Testing_Known/logic.md`
- **Last Updated:** 2026-07-12

### SPEC-016: Claude AI Architecture Course — Modular Shape Slide Deck via Canva MCP

- **Status:** ✅ Verified (2026-07-12) — delivered as design `DAHPLyS5QQk`, edit URL https://www.canva.com/d/4gyIYtFyKOp-xjO; full spec + test evidence: [`architecture_course_mcp_spec.md`](architecture_course_mcp_spec.md)
- **Description:** 5-slide dark-theme (`#0B0F19`) presentation, one architectural shape motif per content slide (Shield/Hexagon/Cylinder/Octagon), built from the CLI via the claude.ai Canva MCP connector.
- **Key Behaviors:**
  - **[GAP CONFIRMED]** `perform-editing-operations` has no native shape-insert operation and no connector/line op (op set unchanged from SPEC-015). `insert_fill` only accepts pre-uploaded `image`/`video` assets.
  - **Chosen workaround:** generate each shape as an icon image (`image-generation` skill) → `upload-asset-from-url` (fal.ai output URL, already public) → `insert_fill` onto the target slide + `format_text` the header → `commit-editing-transaction`. Shapes are delivered as raster image elements, not native vector shapes.
  - **Manual step (unchanged boundary):** cross-slide connectors/flow lines require the editor — Elements → L (line tool) → snap to shapes/text.
- **Related Files:** `1_Real_Unknown/okrs.md` (Objective 6), `1_Real_Unknown/tasks.md` (Phase 6), `4_Formula/architecture_course_mcp_spec.md`
- **Last Updated:** 2026-07-12

---

## Spec Template

```markdown
### SPEC-XXX: [Feature Name]
- **Status:** Active | Draft | Deprecated
- **Description:** What this feature does
- **Key Behaviors:**
  - Behavior point 1
  - Behavior point 2
- **Related Files:** `path/to/file`
- **Last Updated:** YYYY-MM-DD
```
