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
 * Katalog-ilustracija oglasa. Nema fotografija: svaka slika je generisani
 * dvotonski SVG iz `/public/slike`, silueta po kategoriji, tint po brendu.
 */
export function Slika({ oglas, indeks = 0, prioritet, className }: Props) {
  const izvor = oglas.slike?.[indeks] ?? slikaZaOglas(oglas)
  const opis = `${oglas.naslov}, ilustracija kategorije`

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
