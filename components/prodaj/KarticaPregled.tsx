'use client'

import { Ikona } from '@/components/Ikone'
import ProdavacOznaka from '@/components/ProdavacOznaka'
import Slika from '@/components/Slika'
import StanjeChip from '@/components/StanjeChip'
import { formatCena } from '@/lib/format'
import type { Oglas, TipProdavca } from '@/lib/types'
import k from '@/components/OglasKartica.module.css'
import s from './tok.module.css'

type Props = {
  oglas: Oglas
  brendNaziv: string
  tipProdavca: TipProdavca
  /** Naslovna fotografija iz nacrta (objektni URL), ako je korisnik dodao. */
  naslovnaUrl?: string
  kompaktno?: boolean
}

/**
 * Živi pregled kartice iz mreže pretrage.
 *
 * Namerno ne koristi `components/OglasKartica.tsx`: ta komponenta sama traži
 * brend i prodavca kroz `lib/queries`, pa bi je upotreba u klijentskom toku
 * uvukla ceo katalog oglasa u bundle pregledača. Ovde stižu već pripremljene
 * vrednosti, a stilovi su bukvalno isti modul kao kod prave kartice — pregled
 * i mreža ne mogu da se raziđu.
 */
export function KarticaPregled({
  oglas,
  brendNaziv,
  tipProdavca,
  naslovnaUrl,
  kompaktno,
}: Props) {
  return (
    <article
      className={['card', 'card-static', k.kartica, kompaktno ? k.kompaktna : '']
        .filter(Boolean)
        .join(' ')}
    >
      <div className={k.medija}>
        {naslovnaUrl ? (
          <div className={s.pregledMedija}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={naslovnaUrl} alt="" className={s.pregledSlika} />
          </div>
        ) : (
          <Slika oglas={oglas} />
        )}

        <div className={k.gore}>
          <StanjeChip stanje={oglas.stanje} />
          <span className={s.pregledSrce} aria-hidden="true">
            <Ikona ime="srce" velicina={19} />
          </span>
        </div>

        {oglas.slike.length > 1 ? (
          <span className={k.brojSlika}>
            <Ikona ime="foto" velicina={13} />
            {oglas.slike.length}
          </span>
        ) : null}
      </div>

      <div className={k.telo}>
        <p className={k.brendModel}>
          <span className={k.brendIme}>{brendNaziv}</span>
          <span className={k.tacka} aria-hidden="true">
            ·
          </span>
          <span className={k.model}>{oglas.model}</span>
        </p>

        <h3 className={k.naslov}>
          <span className={k.naslovLink}>{oglas.naslov}</span>
        </h3>

        <div className={k.cenaRed}>
          <span className="cena">{formatCena(oglas.cena)}</span>
          {oglas.cenaDogovor ? <span className={k.dogovor}>Dogovor</span> : null}
        </div>

        <div className={k.podnozje}>
          <span className={k.lokacija}>
            <Ikona ime="lokacija" velicina={14} />
            {oglas.lokacija}
          </span>
          <ProdavacOznaka tip={tipProdavca} />
        </div>
      </div>
    </article>
  )
}

export default KarticaPregled
