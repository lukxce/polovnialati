import type { MetadataRoute } from 'next'
import { sviBrendovi, sviOglasi, sviProdavci, stabloKategorija } from '@/lib/queries'

const OSNOVA = 'https://alatnica.rs'

/** Slugovi vodiča iz SPEC §7. */
export const VODICI = [
  'kako-izabrati-rotacionu-busilicu',
  'polovan-alat-na-sta-obratiti-paznju',
  'akumulatorski-sistemi-objasnjeni',
  'hilti-vs-bosch-vs-makita',
]

const IZGRADNJA = new Date('2026-08-20')

export default function sitemap(): MetadataRoute.Sitemap {
  const stablo = stabloKategorija()

  const staticne: MetadataRoute.Sitemap = (
    [
      { url: `${OSNOVA}/`, changeFrequency: 'daily', priority: 1 },
      { url: `${OSNOVA}/oglasi`, changeFrequency: 'hourly', priority: 0.9 },
      { url: `${OSNOVA}/prodaj`, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${OSNOVA}/kako-radi`, changeFrequency: 'monthly', priority: 0.7 },
      { url: `${OSNOVA}/vodici`, changeFrequency: 'weekly', priority: 0.7 },
      { url: `${OSNOVA}/pretraga`, changeFrequency: 'weekly', priority: 0.3 },
      { url: `${OSNOVA}/sacuvano`, changeFrequency: 'monthly', priority: 0.2 },
      { url: `${OSNOVA}/o-nama`, changeFrequency: 'yearly', priority: 0.4 },
      { url: `${OSNOVA}/kontakt`, changeFrequency: 'yearly', priority: 0.4 },
      { url: `${OSNOVA}/uslovi`, changeFrequency: 'yearly', priority: 0.2 },
      { url: `${OSNOVA}/privatnost`, changeFrequency: 'yearly', priority: 0.2 },
    ] as const
  ).map((x) => ({ ...x, lastModified: IZGRADNJA }))

  const kategorije: MetadataRoute.Sitemap = stablo.flatMap(({ kategorija, deca }) => [
    {
      url: `${OSNOVA}/kategorija/${kategorija.slug}`,
      lastModified: IZGRADNJA,
      changeFrequency: 'daily' as const,
      priority: 0.8,
    },
    ...deca.map((d) => ({
      url: `${OSNOVA}/kategorija/${kategorija.slug}/${d.slug}`,
      lastModified: IZGRADNJA,
      changeFrequency: 'daily' as const,
      priority: 0.7,
    })),
  ])

  const brendovi: MetadataRoute.Sitemap = sviBrendovi().map((b) => ({
    url: `${OSNOVA}/brend/${b.slug}`,
    lastModified: IZGRADNJA,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const oglasi: MetadataRoute.Sitemap = sviOglasi().map((o) => ({
    url: `${OSNOVA}/oglas/${o.slug}`,
    lastModified: new Date(o.objavljeno),
    changeFrequency: 'weekly',
    priority: o.istaknuto ? 0.8 : 0.6,
  }))

  const prodavci: MetadataRoute.Sitemap = sviProdavci().map((p) => ({
    url: `${OSNOVA}/prodavac/${p.slug}`,
    lastModified: IZGRADNJA,
    changeFrequency: 'weekly',
    priority: 0.5,
  }))

  const vodici: MetadataRoute.Sitemap = VODICI.map((slug) => ({
    url: `${OSNOVA}/vodici/${slug}`,
    lastModified: IZGRADNJA,
    changeFrequency: 'monthly',
    priority: 0.6,
  }))

  return [...staticne, ...kategorije, ...brendovi, ...oglasi, ...prodavci, ...vodici]
}
