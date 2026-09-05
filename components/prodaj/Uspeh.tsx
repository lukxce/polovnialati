'use client'

import Link from 'next/link'
import { Ikona } from '@/components/Ikone'
import { formatCena } from '@/lib/format'
import KarticaPregled from './KarticaPregled'
import { nacrtUOglas, type BrendOpcija, type Nacrt } from './model'
import s from './tok.module.css'

type Props = {
  nacrt: Nacrt
  brendovi: BrendOpcija[]
  nazivKategorije?: string
  /** Vrati se u tok na prvi korak i počni novi nacrt. */
  ponovo: () => void
}

export function Uspeh({ nacrt, brendovi, nazivKategorije, ponovo }: Props) {
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
          Sačuvan je na tvom nalogu, u kategoriji{' '}
          <strong>{nazivKategorije ?? 'koju si izabrao'}</strong> po ceni od{' '}
          <strong>{formatCena(nacrt.cena ?? 0)}</strong>. Odatle možeš da ga uređuješ, deaktiviraš ili
          obrišeš u bilo kom trenutku.
        </p>
      </div>

      <div className={s.uspehIskrenost}>
        <Ikona ime="stit" velicina={20} />
        <div>
          <p>
            <strong>Za sada je vidljiv samo u tvom nalogu i adminu.</strong> Javna pretraga
            (<code>/oglasi</code>) i dalje prikazuje probne oglase — pravi oglasi se tamo uključuju u
            sledećoj fazi. „Provereno" oznaku dodeljuje admin ručno, posle pregleda fotografija i
            unetih podataka.
          </p>
        </div>
      </div>

      <div className={s.uspehPregled}>
        <p className="micro">Kartica koja bi se objavila</p>
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
        <Link href="/nalog" className="btn btn-primary btn-veliki">
          Idi na Moj nalog
        </Link>
        <button type="button" className="btn btn-tertiary btn-veliki" onClick={ponovo}>
          Napravi još jedan oglas
        </button>
      </div>

      <div className={s.uspehSledece}>
        <h3 className={s.savetNaslov}>Šta je stvarno, šta još nije</h3>
        <ol className={s.savetLista}>
          <li>
            <strong>Provera oglasa — stvarno.</strong> Admin ručno pregleda fotografije i unete
            podatke i označava oglas kao <em>Provereno</em> iz admin panela.
          </li>
          <li>
            <strong>Poruke kupaca — još ne.</strong> Sanduče i vreme odgovora na profilu prodavca
            nisu izgrađeni; ovo ostaje sledeći korak.
          </li>
          <li>
            <strong>Javna pretraga — još ne.</strong> Pravi oglasi se za sada vide samo u tvom
            nalogu i adminu, ne i na <code>/oglasi</code> gde su i dalje probni podaci.
          </li>
        </ol>
      </div>
    </div>
  )
}

export default Uspeh
