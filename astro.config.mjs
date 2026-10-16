import { defineConfig } from 'astro/config'

// Static output: the whole site is pre-rendered to HTML at build time and
// served from GitHub Pages, so crawlers and social scrapers see full markup
// without executing JavaScript.
export default defineConfig({
  site: 'https://samytamim.com',
  output: 'static',
  trailingSlash: 'ignore',
})
