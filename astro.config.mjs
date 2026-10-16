import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// Static output: the whole site is pre-rendered to HTML at build time and
// served from GitHub Pages, so crawlers and social scrapers see full markup
// without executing JavaScript.
export default defineConfig({
  site: 'https://samytamim.com',
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    // Generates sitemap-index.xml + sitemap-0.xml from the routes, and stays
    // correct as pages are added. Requires `site` above for absolute URLs.
    sitemap({
      // The 404 page must not be advertised to crawlers.
      filter: (page) => !page.includes('/404'),
    }),
  ],
})
