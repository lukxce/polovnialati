'use client'

import Link from 'next/link'
import { Ikona } from '@/components/Ikone'
import { formatCena } from '@/lib/format'
import KarticaPregled from './KarticaPregled'
import { nacrtUOglas, type BrendOpcija, type Nacrt } from './model'
import s from './tok.module.css'

type Props = {
  nacrt: Nacrt
  /** slug objavljenog oglasa — link ka javnoj stranici */
  slug?: string
  brendovi: BrendOpcija[]
  nazivKategorije?: string
  /** Vrati se u tok na prvi korak i počni novi nacrt. */
  ponovo: () => void
}

export function Uspeh({ nacrt, slug, brendovi, nazivKategorije, ponovo }: Props) {
  const oglas = nacrtUOglas(nacrt)
  const brendNaziv = brendovi.find((b) => b.slug === nacrt.brend)?.naziv ?? 'Brend'

  return (
    <div className={s.uspeh}>
      <div className={s.uspehZaglavlje}>
        <span className={s.uspehZnak}>
          <Ikona ime="cek" velicina={30} />
        </span>
        <h2 className={s.uspehNaslov}>Oglas je objavljen</h2>
        <p className={s.uspehLede}>
          Javan je odmah, u kategoriji <strong>{nazivKategorije ?? 'koju si izabrao'}</strong> po
          ceni od <strong>{formatCena(nacrt.cena ?? 0)}</strong>. U Mom nalogu menjaš cenu, sklanjaš
          ga kad prodaš ili ga brišeš.
        </p>
      </div>

      <div className={s.uspehPregled}>
        <p className="micro">Tvoja kartica u pretrazi</p>
        <div className={s.pregledMreza}>
          <KarticaPregled
            oglas={oglas}
            brendNaziv={brendNaziv}
            tipProdavca="privatno-lice"
            naslovnaUrl={nacrt.fotografije[0]?.url}
          />
        </div>
      </div>

      <div className={s.uspehAkcije}>
        {slug ? (
          <Link href={`/oglas/${slug}`} className="btn btn-primary btn-veliki">
            Pogledaj oglas
          </Link>
        ) : null}
        <Link href="/nalog" className="btn btn-tertiary btn-veliki">
          Moj nalog
        </Link>
        <button type="button" className="btn btn-tertiary btn-veliki" onClick={ponovo}>
          Napravi još jedan oglas
        </button>
      </div>

      <div className={s.uspehSledece}>
        <h3 className={s.savetNaslov}>Šta sledi</h3>
        <ol className={s.savetLista}>
          <li>
            <strong>Poruke kupaca</strong> stižu u tvoje sanduče (Poruke u navigaciji), uz značku
            sa brojem nepročitanih.
          </li>
          <li>
            <strong>Oznaku „Provereno"</strong> dodeljuje tim Alatnice posle pregleda fotografija i
            unetih podataka.
          </li>
          <li>
            <strong>Kad prodaš</strong>, skloni oglas u Mom nalogu, da ti kupci ne pišu za alat koji
            više nemaš.
          </li>
        </ol>
      </div>
    </div>
  )
}

export default Uspeh
