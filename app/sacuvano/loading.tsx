import s from './stranica.module.css'

/** Skelet prati stvarni raspored: uvod, traka sa brojačem, mreža kartica. */
export default function SacuvanoSkelet() {
  return (
    <div className={['container', s.strana].join(' ')} aria-busy="true" aria-live="polite">
      <span className="sr-only">Učitavanje sačuvanih oglasa…</span>

      <div className={s.uvod}>
        <div className={['skeleton', s.skNaslov].join(' ')} />
        <div className={['skeleton', s.skLede].join(' ')} />
        <div className={['skeleton', s.skLedeKratak].join(' ')} />
      </div>

      <div className={['skeleton', s.skTraka].join(' ')} />

      <ul className="mreza">
        {[0, 1, 2, 3].map((i) => (
          <li key={i} className={s.skStavka}>
            <div className={['skeleton', s.skKartica].join(' ')} />
          </li>
        ))}
      </ul>
    </div>
  )
}
