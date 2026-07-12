#  Tasks & Phases

> **Stage 1: Real Unknown** — Project phases and task breakdown managed by the **Real Agent**. Each task is assigned to a specific agent. Complex tasks are coordinated by the Real Agent across multiple agents.

## Phase 1: PoC Foundation (Completed)

| ID | Task | Agent | Done |
|----|------|-------|------|
| TSK-001 | Scaffold TypeScript MCP server with `@modelcontextprotocol/sdk` (stdio lifecycle) | Symbols Agent | [x] |
| TSK-002 | Implement `generate_design_brief` tool (client name, description, brand colors, deliverables, tone) | Symbols Agent | [x] |
| TSK-003 | Implement `stage_assets` tool (image URLs → Canva asset manifest JSON) | Symbols Agent | [x] |
| TSK-004 | Provide `mcp-config.json` for Claude Desktop / Cursor / VS Code hosts | Environment Agent | [x] |

## Phase 2: Delivery Pilot Refactor (Completed)

| ID | Task | Agent | Coordination | Done |
|----|------|-------|-------------|------|
| TSK-005 | Adopt delivery-pilot-template 7-stage structure | Real Agent | Real Agent coordinates: template overlay → code moved to `5_Symbols/mcp-server/` → links fixed | [x] |
| TSK-006 | Wire secrets to existing Azure Key Vault `dp-kv-deliverypilot` (`secrets.sh` + docs) | Environment Agent | [x] |
| TSK-007 | Rebuild navigation menus and pass smoke tests | Test Agent | Symbols runs `nav_sync.py` → Test Agent runs `smoke_test.py` | [x] |

## Phase 3: Turn On the Canva MCP — Pexabo account (In Progress)

### New — Kilo/DeepSeek MCP config
MCP servers `canva-cli` and `canva-custom-tools` added to `kilo.json`. User needs to run `npx @canva/cli@latest login` on this machine before Kilo can use the native Canva MCP.

| ID | Task | Agent | Coordination | Done |
|----|------|-------|-------------|------|
| TSK-008 | Set the goal in OKRs: Canva MCP on for `info@pexabo.com` | Real Agent | [x] |
| TSK-014 | Create project menu + implementation pages (Implementation, Canva Connection, MCP Server, OKRs) | Symbols Agent | Formula writes `implementation.md` → Environment writes `canva_connection.md` → Symbols syncs menus via `nav_sync.py` | [x] |
| TSK-015 | Run custom MCP server till it works — `mcp_e2e_test.py` 4/4 (found + fixed stage_assets validation bug) | Test Agent | Test finds error → Semblance logs → Symbols fixes → Test verifies | [x] |
| TSK-016 | Run native Canva CLI MCP — `initialize` + `tools/list` (11 tools) over stdio | Test Agent | [x] |
| TSK-017 | Authenticate claude.ai Canva connector as `info@pexabo.com` (`/mcp` → OAuth) and record a live workspace tool call | Real Agent | **User action required** — OAuth cannot be done by agents; Test Agent records evidence in validation_report.md after | [x] |
| TSK-009 | Wire `stage_assets` manifest to the Canva CLI MCP for actual upload | Symbols Agent | Environment provides Canva app credentials from Key Vault → Symbols implements → Test validates end-to-end | [x] |
| TSK-010 | Store real Canva app credentials in `dp-kv-deliverypilot` (replace placeholders) | Environment Agent | [x] |
| TSK-018 | Verify `stage_assets` manifest matches Canva `POST /v1/brand-assets` schema | Test Agent | Formula specs the schema → Test validates output | [x] |
| TSK-019 | Define local `.env` contract (`.env` gitignored, `.env.example` keys, vault + PKCE token sources) | Formula Agent | Formula specs the contract in `implementation.md` → Environment fills `.env` from vault + auth.html | [x] |
| TSK-020 | Create a Canva document from the local CLI — `npm run canva:create` → design `DAHPLbvLyIw` in Pexabo workspace; `create_design` MCP tool added | Symbols Agent | Formula specs → Symbols implements `cli.ts` + `createDesign()` → Test verifies live (validation_report.md) | [x] |

## Phase 5: Presentation + Animated Lower Third — MCP Retry (Done)

> Retry of the lower-third flow (SPEC-014). New capability discovered: the claude.ai Canva MCP is available inside the Claude Code CLI session with editing-transaction tools (`position_element`, `resize_element`, `format_text`) — element positioning no longer needs the Apps SDK. Objective 5 in `okrs.md`.

| ID | Task | Agent | Coordination | Done |
|----|------|-------|-------------|------|
| TSK-021 | Set Objective 5 in OKRs: new presentation + lower third + fade-in from the CLI | Real Agent | | [x] |
| TSK-022 | Record Canva MCP editing capability matrix (what `perform-editing-operations` can/can't do) | Environment Agent | Environment scans tool schemas → Formula updates SPEC-015 | [x] |
| TSK-023 | Create new presentation via MCP (`request-outline-review` → `generate-design-structured`) with "tuncer karaarslan" in slide content — design `DAHPLnGsNgc` | Formula Agent → execution | Formula gates the plan → MCP tool chain executes | [x] |
| TSK-024 | Position the text as a lower third via editing transaction (`position_element`/`resize_element`/`format_text`) and commit — 5/5 ops success, committed | Symbols Agent (tool chain) | | [x] |
| TSK-025 | Confirm fade-in boundary via Canva Help tool — official answer: editor-only, no API/SDK/MCP path | Test Agent | Test verifies design → Semblance records limitation | [x] |
| TSK-026 | Update `logic.md`, `canva_lower_third_flow.md` with retry outcome | Test Agent | | [x] |

## Phase 4: Testing & Deployment (Pending)

| ID | Task | Agent | Coordination | Done |
|----|------|-------|-------------|------|
| TSK-011 | Run full smoke test suite on all pages | Test Agent | Real Agent coordinates: opens all pages → Test Agent scans for errors → Semblance logs findings | [ ] |
| TSK-012 | Deploy to GitHub Pages and verify with `--base-url` | Symbols Agent | Symbols pushes → Test Agent runs cloud smoke tests → Real Agent verifies OKRs met | [ ] |
| TSK-013 | Publish retrospective in 6_Semblance/lessons_learned.md | Semblance Agent | Real Agent gathers lessons from all agents → Semblance compiles | [ ] |

## Task Management Rules

1. **Real Agent owns this file** — breaks the project into phases and tasks, assigns agents, coordinates complex tasks
2. **Every task names its agent** — the Agent column identifies which stage agent is responsible for execution
3. **Complex tasks describe coordination** — tasks involving 2+ agents include a Coordination column explaining how the Real Agent orchestrates the workflow
4. **Status tracking**: `[ ]` Pending, `[x]` Completed, `[~]` In Progress, `[!]` Blocked
5. **Link to specs** — tasks that implement a spec should reference the SPEC-XXX number
6. **Task granularity** — a task should be completable in a single coding session
7. **Real Agent as coordinator** — for complex tasks, the Real Agent defines the scope, dispatches to agents, and validates the result against OKRs
