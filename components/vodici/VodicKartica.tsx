import Link from 'next/link'
import { Ikona } from '@/components/Ikone'
import { type Vodic, vremeCitanja } from '@/lib/vodici'
import s from './VodicKartica.module.css'

type Props = {
  vodic: Vodic
  /** Prikaži prve dve ključne stavke ispod ledea (lista vodiča). */
  saKljucnim?: boolean
  /** Nivo naslova kartice — zavisi od toga šta je iznad nje na stranici. */
  nivo?: 'h2' | 'h3'
}

export function VodicKartica({ vodic, saKljucnim, nivo = 'h3' }: Props) {
  const Naslov = nivo
  return (
    <article className={`card ${s.kartica}`}>
      <div className={s.gore}>
        <span className={s.tema}>{vodic.tema}</span>
        <span className={s.vreme}>{vremeCitanja(vodic)} min čitanja</span>
      </div>

      <Naslov className={s.naslov}>
        <Link href={`/vodici/${vodic.slug}`} className={s.naslovLink}>
          {vodic.naslov}
        </Link>
      </Naslov>

      <p className={s.lede}>{vodic.podnaslov}</p>

      {saKljucnim ? (
        <ul className={s.kljucno}>
          {vodic.kljucno.slice(0, 2).map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      ) : null}

      <p className={s.podnozje}>
        Pročitaj vodič
        <Ikona ime="strelica" velicina={16} />
      </p>
    </article>
  )
}

export default VodicKartica
