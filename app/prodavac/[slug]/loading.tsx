import s from './ucitavanje.module.css'

/**
 * Skelet prodavnice: isti raspored kao gotova strana, da sadržaj ne skače
 * kada stigne — zaglavlje, brojke, mreža kartica i bočna kolona.
 */
export default function Ucitavanje() {
  return (
    <div className={['container', s.strana].join(' ')} aria-busy="true">
      <span className="sr-only">Učitavanje profila prodavca…</span>

      <div className={['skeleton', s.mrvice].join(' ')} />

      <div className={s.zaglavlje}>
        <div className={s.identitet}>
          <div className={['skeleton', s.grb].join(' ')} />
          <div className={s.identitetTekst}>
            <div className={['skeleton', s.naslov].join(' ')} />
            <div className={['skeleton', s.podnaslov].join(' ')} />
          </div>
        </div>

        <div className={s.oznake}>
          <div className={['skeleton', s.oznaka].join(' ')} />
          <div className={['skeleton', s.oznaka].join(' ')} />
          <div className={['skeleton', s.oznaka].join(' ')} />
        </div>

        <div className={['skeleton', s.brojke].join(' ')} />
      </div>

      <div className={s.raspored}>
        <div className={s.glavno}>
          <div className={['skeleton', s.blokNaslov].join(' ')} />
          <div className={['skeleton', s.blokTekst].join(' ')} />
          <div className={['skeleton', s.blokTekstKratak].join(' ')} />

          <div className={s.traka}>
            <div className={['skeleton', s.cip].join(' ')} />
            <div className={['skeleton', s.cip].join(' ')} />
            <div className={['skeleton', s.cip].join(' ')} />
          </div>

          <ul className="mreza">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <li key={i}>
                <div className={['skeleton', s.kartica].join(' ')} />
              </li>
            ))}
          </ul>
        </div>

        <div className={s.bocno}>
          <div className={['skeleton', s.ocena].join(' ')} />
          <div className={['skeleton', s.provera].join(' ')} />
        </div>
      </div>
    </div>
  )
}
