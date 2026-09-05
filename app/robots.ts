import type { MetadataRoute } from 'next'

export const OSNOVA = 'https://alatnica.rs'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Kombinacije filtera i rezultati pretrage prave beskonačan prostor URL-ova.
        disallow: ['/oglasi?', '/pretraga?', '/prodaj?'],
      },
    ],
    sitemap: `${OSNOVA}/sitemap.xml`,
    host: OSNOVA,
  }
}
