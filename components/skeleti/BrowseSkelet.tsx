import s from './BrowseSkelet.module.css'

type Props = {
  /** Broj redova uvodnog teksta iznad pregleda. */
  redoviUvoda?: number
  /** Traka čipova (potkategorije, brendovi) iznad rezultata. */
  cipovi?: boolean
  /** Broj kartica u mreži. */
  kartica?: number
  /** Filter kolona sa leve strane (pregled sa filterima). */
  rail?: boolean
}

/**
 * Skelet za strane koje otvaraju pregled sa filterima. Namerno ponavlja
 * stvarni raspored — mrvice, naslov, čipove i mrežu — da se sadržaj ne pomeri
 * kad stigne. Sve je dekorativno, pa čitač ekrana dobija samo jednu poruku.
 */
export function BrowseSkelet({ redoviUvoda = 2, cipovi = true, kartica = 8, rail = true }: Props) {
  return (
    <>
      <p className="sr-only" role="status">
        Učitavanje oglasa…
      </p>

      <div className={['container', s.strana].join(' ')} aria-hidden="true">
        <div className={['skeleton', s.mrvice].join(' ')} />
        <div className={['skeleton', s.naslov].join(' ')} />

        <div className={s.tekst}>
          {Array.from({ length: redoviUvoda }).map((_, i) => (
            <div key={i} className={['skeleton', s.red].join(' ')} />
          ))}
        </div>

        {cipovi ? (
          <div className={s.cipovi}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={['skeleton', s.cip].join(' ')} />
            ))}
          </div>
        ) : null}

        <div className={rail ? s.raspored : s.rasporedBezRaila}>
          {rail ? <div className={['skeleton', s.rail].join(' ')} /> : null}

          <div className={s.mreza}>
            {Array.from({ length: kartica }).map((_, i) => (
              <div key={i} className={s.kartica}>
                <div className={['skeleton', s.slika].join(' ')} />
                <div className={['skeleton', s.linija].join(' ')} />
                <div className={['skeleton', s.linijaKratka].join(' ')} />
                <div className={['skeleton', s.cena].join(' ')} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

export default BrowseSkelet
