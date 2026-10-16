# ADR 001: Replace Vite + React SPA with Astro

- **Status:** Accepted
- **Date:** 2026-10-16
- **Deciders:** site owner

## Context

The portfolio at `samytamim.com` was a client-rendered React single-page app built
with Vite and deployed to GitHub Pages.

Navigation used **hash routes** (`/#projects`, `/#archive`, `/#article-eeg`).
Search engines do not treat URL fragments as separate documents, so the whole site
exposed exactly one indexable URL: `/`. The projects list, the archive, and the EEG
article were invisible as individual pages, and every page shared a single social
preview card.

A secondary symptom of the same design: a link preview could not describe any page
other than the home page, because `<head>` was effectively static and only rendered
after JavaScript ran.

## Decision

Migrate to **Astro** with static output, keeping GitHub Pages as the host.

Each page becomes a real route that is pre-rendered to HTML at build time:
`/`, `/projects/`, `/archive/`, `/article-eeg/`, plus `404.html`.

Next.js was considered and rejected. Deploying to GitHub Pages forces
`output: 'export'`, which disables most of what Next.js provides: ISR, middleware,
Server Actions, `next/image` optimisation and `next/og` image generation. The site
would have used only pre-rendered HTML and the Metadata API — both of which Astro
provides with far less machinery for a content site of four static pages.

## Consequences

**Gained**

- Every page is a separately indexable document with its own `<title>`,
  description, canonical URL and Open Graph tags.
- Full page content is present in the static HTML without executing JavaScript.
- Zero client-side framework runtime ships; the only JavaScript is a handful of
  small inline scripts (pre-paint theme resolution, theme toggle, nav-height
  measurement, photo hover-tilt, legacy hash redirect).
- `sitemap-index.xml` is generated from the routes and cannot drift from the site.
- `robots.txt` and `sitemap-index.xml` exist; both previously returned 404.

**Costs and constraints**

- Old hash URLs are no longer canonical. A small redirect script in `<head>`
  forwards `/#projects` and friends to the real routes so existing inbound links
  keep working.
- All pages currently share one social card (`public/og-v2.png`). Per-page cards
  would be a further improvement.
- CI must run on Node 22: Astro 7 declares `node >=22.22.0`, while Vite and
  Rolldown alone would have accepted 20.19.
- The build depends on ordering: Astro copies `public/` into `dist/` at build time,
  so the LaTeX step that produces `public/resume.pdf` must run before `astro build`.

## Verification

The migration was accepted only because rendering was proven unchanged, not assumed.

Each route was screenshotted at 1200x630 (2x, downsampled) and compared against the
still-live React build with ImageMagick `compare`:

| Page | RMSE | Differing pixels |
| --- | --- | --- |
| home | 0 | 0 |
| projects | 0 | 0 |
| archive | 0 | 0 |
| article | 0 | 0 |

Dark mode was compared against the earlier React dark capture and also matched
exactly (RMSE 0, mean brightness 25.0765 on both).

This process caught two real regressions in the ported theme toggle (the `hidden`
attribute does not hide inline SVG; wrapping the icons in `<span>` shifted the
glyph by a pixel), both of which would have been invisible to a code-only review.

## Pre-existing issues noted, not fixed

- `var(--surface2)` is referenced in the article's formula-box style but is never
  defined in the stylesheet, so that box renders with no background. Preserved
  as-is; out of scope for the migration.
