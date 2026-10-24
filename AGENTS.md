# AGENTS.md

## Update Evaluation Loop

Whenever the user says "update" (or asks to update/change something about the portfolio/site), follow this loop:

1. **Open the target page in Chromium/Chrome** using headless/browser tooling (e.g. `playwright`, `puppeteer`, or Chrome DevTools MCP if available) and capture a screenshot + DOM snapshot of the relevant route after the change is built/served locally.
2. **Compare against intent**: check alignment with the user's request and the existing site's design (typography, spacing, colors, components, nav/sidebar). Pay attention to layout shifts, broken links, responsive behavior.
3. **Auto-correct**: fix obvious issues (styles, markup, routing) without asking if it's clearly a regression against the existing pattern. If it's ambiguous or would change the design significantly, ask before proceeding.
4. **Re-evaluate**: rebuild (`npm run build`) and re-capture until the rendered page matches the requested update. Stop only when the visual/output looks correct.
5. **Report**: summarize what changed, what was corrected, and attach/point to the captured evidence (screenshot path) in the response.

Notes:
- Prefer evaluating the built output (`dist/`) or the local dev server (`npm run dev`) over source-only guessing.
- Keep changes consistent with this repo's patterns (Astro, existing CSS variables/classes).
- Don't invent new dependencies unless necessary; if adding one, explain why.
