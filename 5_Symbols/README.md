# 5️⃣ Symbols — The "Reality"

> **Stage 5 of 7:** The actual code — where vision becomes working software.

## Purpose

This folder contains the **core source code and implementation files**. Everything that runs, executes, or is deployed lives here. Code is rendered with PrismJS syntax highlighting for readable documentation.

## What belongs here

- **Source code** — All scripts, modules, and application code
- **Configuration files** — App config (non-secret)
- **Docker definitions** — `Dockerfile` and `docker-compose.yml`
- **GitHub Actions workflows** — CI/CD pipeline definitions
- **Static assets** — JS, CSS bundles used by the app

## Files

| File | Description |
|------|-------------|
| `mcp-server/` | **The Canva MCP server** — TypeScript source (`src/`, `tools/`), `package.json`, `tsconfig.json`, `mcp-config.json` |
| `mcp_server.md` | Code guide: quickstart, MCP host setup, PoC checklist |
| `toolbox/` | Project tooling — `nav_sync.py`, `smoke_test.py`, `secrets.sh` (Key Vault helper) |
| `rules/` | **Coding rules** — coding standards, git conventions, file organization |
| `markdown_renderer.html` | Renders stage markdown docs on GitHub Pages |

## Code Standards

- **Syntax highlighting:** PrismJS (included via CDN in all HTML pages)
- **Style:** Modern CSS — Flexbox/Grid, no legacy floats
- **Diagrams:** Mermaid for all architecture and flow diagrams
- **Backend:** TypeScript MCP server (`@modelcontextprotocol/sdk`, Node.js, stdio transport)
- **Frontend:** Static HTML/CSS/JS on GitHub Pages

## Secrets

- **Never** store secrets in this folder
- Use `.env.example` in root to document required variables
- Load secrets at runtime from the existing Azure Key Vault `dp-kv-deliverypilot` via `toolbox/secrets.sh` — do not create a new vault

## Rules

- Keep `main.py` minimal — delegate to modules
- Every function that isn't self-evident gets a comment
- Move deprecated code to `_obsolete/` 🚮

## 🧪 Testing Checklist

[![CI/CD with GitHub Actions](https://img.youtube.com/vi/R8_veQiYur0/0.jpg)](https://www.youtube.com/watch?v=R8_veQiYur0)

- [ ] `npm run build` compiles without errors in `mcp-server/`
- [ ] `npm start` serves the MCP server over stdio and lists both custom tools
- [ ] GitHub Actions workflow passes on push to `main`
- [ ] No secrets committed to this folder
- [ ] PrismJS renders code blocks correctly on all HTML pages
