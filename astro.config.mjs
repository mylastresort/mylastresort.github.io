import { defineConfig } from 'astro/config'
import sitemap from '@astrojs/sitemap'

// Static output: the whole site is pre-rendered to HTML at build time and
// served from GitHub Pages, so crawlers and social scrapers see full markup
// without executing JavaScript.
export default defineConfig({
  site: 'https://samytamim.com',
  output: 'static',
  trailingSlash: 'ignore',
  markdown: {
    shikiConfig: {
      // Dual themes so code blocks follow the site's light/dark toggle
      // instead of being permanently dark.
      themes: { light: 'github-light', dark: 'github-dark' },
    },
  },
  integrations: [
    mdx(),
    // Generates sitemap-index.xml + sitemap-0.xml from the routes, and stays
    // correct as pages are added. Requires `site` above for absolute URLs.
    sitemap({
      // The 404 page and legacy redirect stubs are not content.
      filter: (page) =>
        !page.includes('/404') && !page.includes('/article-eeg') && !page.includes('/archive'),
    }),
  ],
  // The archive page duplicated the blog index; keep old links working.
  redirects: {
    '/archive': '/blog/',
  },
})

import mdx from '@astrojs/mdx'
