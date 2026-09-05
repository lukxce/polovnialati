import type { Metadata } from 'next'
import Breadcrumbs from '@/components/Breadcrumbs'
import OglasKartica from '@/components/OglasKartica'
import BrowseLayout from '@/components/browse/BrowseLayout'
import PraznoRezultati from '@/components/browse/PraznoRezultati'
import { pripremiBrowse, samoFasete } from '@/components/browse/podaci'
import { brojSr, stanjeLabela } from '@/lib/format'
import { brendBySlug, brojAktivnihFiltera, kategorijaBySlug, parseFiltere } from '@/lib/queries'
import s from './stranica.module.css'

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const OSNOVA = '/oglasi'

/** Kratak opis izbora, npr. „Makita · korišćeno, ispravno · Novi Sad". */
function opisIzbora(sp: Record<string, string | string[] | undefined>): string {
  const f = parseFiltere(sp)
  const delovi: string[] = []
  if (f.kategorija) delovi.push(kategorijaBySlug(f.kategorija)?.naziv ?? f.kategorija)
  if (f.brend?.length) delovi.push(f.brend.map((b) => brendBySlug(b)?.naziv ?? b).join(', '))
  if (f.stanje?.length) delovi.push(f.stanje.map(stanjeLabela).join(', ').toLowerCase())
  if (f.aku?.length) delovi.push(f.aku.join(', '))
  if (f.grad) delovi.push(f.grad)
  return delovi.join(' · ')
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const sp = await searchParams
  const f = parseFiltere(sp)
  const filtrirano = brojAktivnihFiltera(f) > 0 || !!f.sort
  const izbor = opisIzbora(sp)

  return {
    title: izbor ? `${izbor}: oglasi za alat` : 'Svi oglasi za alat',
    description: izbor
      ? `Oglasi za alat: ${izbor}. Svaki oglas nosi jednu od pet ocena stanja sa objavljenom definicijom, poznatog prodavca i filter po akumulatorskom sistemu.`
      : 'Ceo katalog Alatnice: elektroalat, akumulatorski sistemi, merni instrumenti, sitna mehanizacija i potrošni materijal. Filtriraj po kategoriji, oceni stanja, ceni, brendu, bateriji, gradu i tipu prodavca.',
    // Fasetirane kombinacije se ne indeksiraju — indeksira se samo čista putanja.
    robots: filtrirano ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: OSNOVA },
  }
}

export default async function OglasiStranica({ searchParams }: Props) {
  const sp = await searchParams
  const filteri = parseFiltere(sp)
  const podaci = pripremiBrowse(filteri)
  const fasete = samoFasete(podaci)

  return (
    <div className={['container', s.strana].join(' ')}>
      <Breadcrumbs
        stavke={[{ naziv: 'Početna', href: '/' }, { naziv: 'Oglasi' }]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">Ceo katalog</p>
        <h1 className={s.naslov}>Oglasi za alat</h1>
        <p className={s.lede}>
          {brojSr(podaci.ukupno, ['oglas', 'oglasa', 'oglasa'])} u ponudi, od mrežnih bušilica do
          agregata. Svaki nosi jednu od pet ocena stanja sa istom, objavljenom definicijom, a ako
          već imaš baterije, filter po akumulatorskom sistemu ti odmah skloni sve što ti ne pali.
        </p>
      </header>

      <BrowseLayout filteri={filteri} fasete={fasete} osnova={OSNOVA}>
        {podaci.ukupno === 0 ? (
          <PraznoRezultati filteri={filteri} fasete={fasete} osnova={OSNOVA} />
        ) : (
          <ul className="mreza">
            {podaci.rezultati.map((o) => (
              <li key={o.id} className={s.stavka}>
                <OglasKartica oglas={o} kompaktno />
              </li>
            ))}
          </ul>
        )}
      </BrowseLayout>
    </div>
  )
}
