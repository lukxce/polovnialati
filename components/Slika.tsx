import Image from 'next/image'
import { slikaZaOglas } from '@/lib/format'
import type { Oglas } from '@/lib/types'
import s from './Slika.module.css'

type Props = {
  oglas: Oglas
  /** Prikaži određenu sliku iz galerije umesto naslovne. */
  indeks?: number
  /** Učitaj odmah — koristi se za prvu sliku na stranici oglasa. */
  prioritet?: boolean
  className?: string
}

/** Širina kartice u mreži oglasa (.mreza u globals.css): 2 kolone, pa 3 od 1100px, pa 4 od 1440px. */
const VELICINE_KARTICE = '(max-width: 1099px) 50vw, (max-width: 1439px) 33vw, 330px'

/**
 * Naslovna slika oglasa: prodavčeva fotografija, a ako je nema (stari ili
 * demo oglasi) dvotonski SVG iz `/public/slike`, silueta po kategoriji.
 */
export function Slika({ oglas, indeks = 0, prioritet, className }: Props) {
  const izvor = oglas.slike?.[indeks] ?? slikaZaOglas(oglas)
  const fotografija = !!oglas.slike?.[indeks] && !oglas.slike[indeks].endsWith('.svg')
  const opis = fotografija ? `${oglas.naslov}, fotografija` : `${oglas.naslov}, ilustracija kategorije`

  return (
    <div className={[s.okvir, className ?? ''].filter(Boolean).join(' ')}>
      <Image
        src={izvor}
        alt={opis}
        width={800}
        height={600}
        sizes={VELICINE_KARTICE}
        className={s.slika}
        loading={prioritet ? 'eager' : 'lazy'}
        fetchPriority={prioritet ? 'high' : 'auto'}
      />
    </div>
  )
}

export default Slika
