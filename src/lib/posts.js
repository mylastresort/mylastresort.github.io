import { getCollection } from 'astro:content'

// One entry point for every page that lists posts, so the blog index and the
// home page can never disagree about ordering or drafts.
export async function getPosts() {
  const posts = await getCollection('blog', ({ data }) => {
    return import.meta.env.PROD ? data.draft !== true : true
  })

  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
}

export function postHref(post) {
  return `/blog/${post.id}/`
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Archive entries are grouped by publication year, newest year first.
export function groupByYear(posts) {
  const years = new Map()

  for (const post of posts) {
    const year = post.data.date.getFullYear()
    if (!years.has(year)) years.set(year, [])
    years.get(year).push(post)
  }

  return [...years.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, entries]) => ({ year, entries }))
}
