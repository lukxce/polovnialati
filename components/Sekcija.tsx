import Link from 'next/link'
import type { ReactNode } from 'react'
import { Ikona } from '@/components/Ikone'
import s from './Sekcija.module.css'

type Props = {
  /** Mala verzalna oznaka iznad naslova. */
  nadnaslov?: string
  naslov?: ReactNode
  opis?: ReactNode
  /** Link „vidi sve" desno od naslova. */
  akcijaHref?: string
  akcijaTekst?: string
  /** Slobodan sadržaj u zaglavlju (npr. dugmad). */
  akcija?: ReactNode
  /** Naslovni nivo — podrazumevano h2. */
  nivo?: 'h1' | 'h2' | 'h3'
  /** Bez vertikalnog razmaka sekcije. */
  bezRazmaka?: boolean
  className?: string
  children?: ReactNode
}

export function Sekcija({
  nadnaslov,
  naslov,
  opis,
  akcijaHref,
  akcijaTekst = 'Vidi sve',
  akcija,
  nivo = 'h2',
  bezRazmaka,
  className,
  children,
}: Props) {
  const Naslov = nivo

  return (
    <section
      className={[bezRazmaka ? s.sekcijaTanka : s.sekcija, className ?? ''].filter(Boolean).join(' ')}
    >
      {naslov || nadnaslov || opis || akcija || akcijaHref ? (
        <header className={s.zaglavlje}>
          <div className={s.tekst}>
            {nadnaslov ? <p className="micro">{nadnaslov}</p> : null}
            {naslov ? <Naslov className={s.naslov}>{naslov}</Naslov> : null}
            {opis ? <p className={s.opis}>{opis}</p> : null}
          </div>

          {akcija ? <div className={s.akcija}>{akcija}</div> : null}

          {!akcija && akcijaHref ? (
            <Link href={akcijaHref} className={s.svi}>
              {akcijaTekst}
              <Ikona ime="strelica" velicina={17} />
            </Link>
          ) : null}
        </header>
      ) : null}

      {children}
    </section>
  )
}

export default Sekcija
