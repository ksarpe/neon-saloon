import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/graj/host', '/panel', '/api/'],
    },
    sitemap: 'https://lastrodeoandzeliki.pl/sitemap.xml',
  }
}
