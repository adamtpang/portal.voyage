import type { MetadataRoute } from 'next'
const BASE = 'https://portal.voyage'
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()
  return [
    { url: BASE, lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/about`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${BASE}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
  ]
}
