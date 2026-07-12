# Canva Creation-Process Capability Research (Web Search, 2026-07-12)

> **Stage 2: Environment** — External research into Canva capabilities beyond the currently-connected claude.ai Canva MCP tool set. Owned by the **Environment Agent**; feeds candidate specs to the **Formula Agent**. Triggered by a request to scan the internet for other "superskills" related to the Canva creation process, following SPEC-016's discovery that no native shape-insert or connector op exists in the connected MCP.

## 1. Official Canva MCP server — full tool list, independently confirmed

Fetched the official docs (`canva.dev/docs/mcp/`, `canva.dev/docs/mcp/tools/`). The public Canva MCP server (`https://mcp.canva.com/mcp`) exposes ~32 tools across: design generation/lookup, editing transactions, assets, folders, exports, comments/replies, design import, resize, brand templates, and autofill.

**This independently confirms SPEC-016's finding from an external source, not just our own schema scan:** the official tool list has no tool for inserting shapes, icons, or lines/connectors. Every design-creation MCP surface (this project's connector included) has the same gap — it is a Canva platform boundary, not a client limitation. No further re-investigation of "does the MCP support shapes" is needed for future specs; treat this as closed.

- [Canva Model Context Protocol (MCP) docs](https://www.canva.dev/docs/mcp/)
- [Canva MCP Server tool list](https://www.canva.dev/docs/mcp/tools/)

## 2. [NEW CAPABILITY] Canva Apps SDK — native vector shapes ARE possible, via a custom App

`addElementAtPoint({ type: "shape", ... })` (Apps SDK, `@canva/design` package) creates a **real, native, editable Canva shape element** — not a raster image. This is the mechanism SPEC-014 already used for lower-third *text* (`type: "text"`); the same App architecture supports `type: "shape"`.

**Shape object structure:**
```ts
await addElementAtPoint({
  type: "shape",
  paths: [{
    d: "M 0 0 H 100 V 100 H 0 L 0 0",   // SVG-like path commands: M, L, H, V, C, S, A, Z
    fill: { color: "#ff0099" }          // or an image/video asset, or dropTarget: true
  }],
  viewBox: { height: 100, width: 100, left: 0, top: 0 }
});
```

**Constraints:**
- 1–30 paths per shape; combined path data ≤ 2KB
- Max 6 unique fill colors across all paths
- Each path must start with a single `M` command (no repeats), no `Q` command
- Fills support solid color, image, video, or drop-target

**Implication for SPEC-016:** the four shape motifs (double-border shield, concentric dual-hexagon, 3D stacked cylinder, hub-and-spoke octagon) could be delivered as **true native Canva shapes** — closing the gap SPEC-016 worked around with AI-interpreted layout — via the same two-phase pattern as SPEC-014: REST API/MCP creates the design, then a small Canva App (`design_editor` intent) adds each shape with hand-authored SVG paths and the exact hex fill. This requires authoring 4 SVG path definitions (shield, hexagon, cylinder, octagon) — a real but bounded design task, not a platform blocker.

- [addElementAtPoint API reference](https://www.canva.dev/docs/apps/api/latest/design-add-element-at-point/)
- [Creating shapes guide](https://www.canva.dev/docs/apps/creating-shapes/)
- [Shape elements with asset example](https://www.canva.dev/docs/apps/examples/shape-elements-with-asset/)
- [addNativeElement (GA API)](https://www.canva.dev/docs/apps/api/latest/design-add-native-element/)

## 3. [ENTERPRISE-GATED] Autofill + Brand Template APIs

The Autofill API (`create_design_autofill_job`, `get-brand-template-dataset`) can bulk-personalize a Brand Template's text, image, and shape/graphic/frame fields from a dataset — but **requires the calling account to be a member of a Canva Enterprise organization**. Both the Connect API and the MCP tool set gate this identically (`autofill-design`, `create-design-from-brand-template`, `list-brand-kits`, `publish-brand-template` already exist in our connected tool set but will fail without Enterprise).

**Implication:** not usable for the Pexabo workspace as currently licensed. Worth revisiting only if the workspace is upgraded to Enterprise — otherwise this is a documented non-option, not a bug if these tools 403.

- [Autofill guide](https://www.canva.dev/docs/connect/autofill-guide/)
- [Applying Canva Brand templates with the Autofill API](https://www.canva.dev/blog/developers/applying-canva-brand-templates/)
- [Get brand template dataset](https://www.canva.dev/docs/connect/api-reference/brand-templates/get-brand-template-dataset/)

## 4. No connector/line-drawing API exists anywhere

No search result across the Connect API changelog, MCP tool list, or Apps SDK docs surfaced a line/connector/arrow primitive. A shape-path (`type: "shape"`, path `d` string) *could* technically draw a straight or curved line as a 1-dimensional path, so an App could theoretically render a connector as a thin shape — but there is no dedicated "connect element A to element B" API; positions would have to be computed and hardcoded per pair. Not pursued further here; the manual Elements → L → snap step remains the practical answer.

## Candidate Follow-Up (not started — needs a decision)

**SPEC-017 (proposed, not written):** Retry SPEC-016's shape slides using a Canva App (Apps SDK, same pattern as SPEC-014's `lower-third-text` app) with hand-authored SVG paths for the 4 shape motifs, delivering true native shapes instead of AI-interpreted layout. Requires: scaffolding a new/reused Canva App, authoring 4 SVG path shapes, wiring exact hex fills, and the same dev-server/Developer-Portal manual steps SPEC-014 needed (this is *not* a pure-MCP flow — it reintroduces the Apps SDK phase SPEC-015/016 were trying to avoid).

## Last Updated

2026-07-12
