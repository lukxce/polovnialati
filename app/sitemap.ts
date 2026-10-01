import type { MetadataRoute } from 'next'
import { sviOglasi, sviProdavci } from '@/lib/queries'
import { SITE_URL } from '@/lib/site'
import { stabloKategorija, sviBrendovi } from '@/lib/taksonomija'
import { sviVodici } from '@/lib/vodici'

export const revalidate = 600

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [oglasi, prodavci] = await Promise.all([sviOglasi(), sviProdavci()])
  const stablo = stabloKategorija()
  const poslednjaIzmena = oglasi[0] ? new Date(oglasi[0].objavljeno) : undefined

  const staticne: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1, lastModified: poslednjaIzmena },
    { url: `${SITE_URL}/oglasi`, changeFrequency: 'hourly', priority: 0.9, lastModified: poslednjaIzmena },
    { url: `${SITE_URL}/kako-radi`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/vodici`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/o-nama`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/kontakt`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/uslovi`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/privatnost`, changeFrequency: 'yearly', priority: 0.2 },
  ]

  const kategorije: MetadataRoute.Sitemap = stablo.flatMap(({ kategorija, deca }) => [
    {
      url: `${SITE_URL}/kategorija/${kategorija.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    ...deca.map((d) => ({
      url: `${SITE_URL}/kategorija/${kategorija.slug}/${d.slug}`,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ])

  const brendovi: MetadataRoute.Sitemap = sviBrendovi().map((b) => ({
    url: `${SITE_URL}/brend/${b.slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const oglasiMapa: MetadataRoute.Sitemap = oglasi.map((o) => ({
    url: `${SITE_URL}/oglas/${o.slug}`,
    lastModified: new Date(o.objavljeno),
    changeFrequency: 'weekly',
    priority: o.istaknuto ? 0.8 : 0.6,
  }))

  const prodavciMapa: MetadataRoute.Sitemap = prodavci.map((p) => ({
    url: `${SITE_URL}/prodavac/${p.slug}`,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const vodici: MetadataRoute.Sitemap = sviVodici().map((v) => ({
    url: `${SITE_URL}/vodici/${v.slug}`,
    lastModified: new Date(v.datum),
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticne, ...kategorije, ...brendovi, ...oglasiMapa, ...prodavciMapa, ...vodici]
}
