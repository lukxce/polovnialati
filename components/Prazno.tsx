import Link from 'next/link'
import type { ReactNode } from 'react'
import { Ikona, type ImeIkone } from '@/components/Ikone'
import s from './Prazno.module.css'

type Props = {
  ikona?: ImeIkone
  naslov: string
  /** Šta se konkretno može uraditi — prazno stanje mora da bude korisno. */
  opis?: ReactNode
  /** Predlozi kao čipovi: npr. „skini filter brenda". */
  predlozi?: { tekst: string; href: string }[]
  akcijaHref?: string
  akcijaTekst?: string
  className?: string
  children?: ReactNode
}

export function Prazno({
  ikona = 'pretraga',
  naslov,
  opis,
  predlozi,
  akcijaHref,
  akcijaTekst,
  className,
  children,
}: Props) {
  return (
    <div className={[s.prazno, className ?? ''].filter(Boolean).join(' ')}>
      <span className={s.krug}>
        <Ikona ime={ikona} velicina={26} />
      </span>

      <h3 className={s.naslov}>{naslov}</h3>
      {opis ? <p className={s.opis}>{opis}</p> : null}

      {predlozi?.length ? (
        <ul className={s.predlozi}>
          {predlozi.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="chip">
                {p.tekst}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}

      {akcijaHref && akcijaTekst ? (
        <Link href={akcijaHref} className="btn btn-primary">
          {akcijaTekst}
        </Link>
      ) : null}

      {children}
    </div>
  )
}

export default Prazno
