# 3️⃣ Simulation — The "Vision"

> **Stage 3 of 7:** Make the invisible visible before writing production code.

## Purpose

This folder holds **visual representations** of what the project will look like and how it will behave. Mockups, wireframes, and screenshots live here. The image carousel on `index.html` auto-loads from this folder.

## What belongs here

- **UI mockups** — Wireframes and design prototypes
- **Screenshots** — Captures of the working system at key milestones
- **Flow diagrams** — User journeys and interaction flows
- **Demo assets** — Any static assets used in presentations

## Files

| File | Description |
|------|-------------|
| `canva_oauth_01`–`07_*.jpg` | Connector OAuth journey — admin restriction → whitelist → consent → PKCE callback |
| `canva_cli_01`–`03_*.jpg` | Canva CLI login journey — restriction → admin whitelists CLI → login success |
| `agentic_workflow.svg` | 7-agent workflow diagram |
| `carousel_config.json` | Slide list (url + caption) for the home-page carousel |
| `design_workflow.md` | Design-first workflow — assets, checklist, spec mapping |
| `image_prompts.md` | Step-by-step narration of every captured screenshot |

## Image Carousel

The carousel on `index.html` loads its slides from `3_Simulation/carousel_config.json`. Supported formats: `.png`, `.jpg`, `.gif`, `.webp`.

To add a new slide:
1. Drop the image into `3_Simulation/` with a descriptive name
2. Add a `{ "url": "3_Simulation/<file>", "caption": "…" }` entry to `carousel_config.json`
3. Commit and push — the carousel updates on deploy ✨

## Rules

- Name images descriptively: `feature_name_state.png`
- Add a caption comment above each image reference in `carousel_config.json`
- Move superseded designs to `_obsolete/` 🚮

## 🧪 Testing Checklist

[![UI Prototyping & Wireframing](https://img.youtube.com/vi/V81R6Q1x8x0/0.jpg)](https://www.youtube.com/watch?v=V81R6Q1x8x0)

- [ ] At least one mockup exists for the homepage
- [ ] Carousel loads and cycles through all images in this folder
- [ ] Images are mobile-readable (min 375px wide)
- [ ] Flow diagrams cover the main user journey
