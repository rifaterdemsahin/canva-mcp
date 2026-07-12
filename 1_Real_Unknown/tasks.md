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

## Phase 3: Canva Integration (In Progress)

| ID | Task | Agent | Coordination | Done |
|----|------|-------|-------------|------|
| TSK-008 | Verify `stage_assets` manifest matches Canva `POST /v1/brand-assets` schema | Test Agent | Formula specs the schema → Test validates output | [ ] |
| TSK-009 | Wire `stage_assets` manifest to the Canva CLI MCP for actual upload | Symbols Agent | Environment provides Canva app credentials from Key Vault → Symbols implements → Test validates end-to-end | [ ] |
| TSK-010 | Store real Canva app credentials in `dp-kv-deliverypilot` (replace placeholders) | Environment Agent | [ ] |

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
