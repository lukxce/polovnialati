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
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={izvor}
        alt={opis}
        width={800}
        height={600}
        className={s.slika}
        loading={prioritet ? 'eager' : 'lazy'}
        decoding={prioritet ? 'sync' : 'async'}
        fetchPriority={prioritet ? 'high' : 'auto'}
      />
    </div>
  )
}

export default Slika
