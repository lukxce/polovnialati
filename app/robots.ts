import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Pregledi (preview) na Vercel-u se ne indeksiraju — samo produkcija.
  if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== 'production') {
    return { rules: [{ userAgent: '*', disallow: '/' }] }
  }
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          // Kombinacije filtera i rezultati pretrage prave beskonačan prostor URL-ova.
          '/oglasi?',
          '/pretraga',
          // Privatne i stranice koje traže prijavu.
          '/nalog',
          '/admin',
          '/poruke',
          '/prodaj',
          '/prijava',
          '/registracija',
          '/sacuvano',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
