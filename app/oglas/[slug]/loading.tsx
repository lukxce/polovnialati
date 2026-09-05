import s from './stranica.module.css'

/** Skelet prati stvarni raspored: galerija, cena i akcije, pa detalji. */
export default function OglasSkelet() {
  return (
    <div className={['container', s.strana].join(' ')} aria-busy="true" aria-live="polite">
      <span className="sr-only">Učitavanje oglasa…</span>

      <div className={['skeleton', s.skMrvice].join(' ')} />

      <div className={s.zaglavlje}>
        <div className={['skeleton', s.skRed].join(' ')} />
        <div className={['skeleton', s.skNaslov].join(' ')} />
        <div className={['skeleton', s.skNaslovDruga].join(' ')} />
        <div className={['skeleton', s.skMeta].join(' ')} />
      </div>

      <div className={s.raspored}>
        <div className={s.galerija}>
          <div className={['skeleton', s.skGalerija].join(' ')} />
          <div className={['skeleton', s.skTacke].join(' ')} />
          <div className={s.skSlicice}>
            <div className={['skeleton', s.skSlicica].join(' ')} />
            <div className={['skeleton', s.skSlicica].join(' ')} />
            <div className={['skeleton', s.skSlicica].join(' ')} />
          </div>
        </div>

        <div className={s.bocna}>
          <div className={[s.skBlok, s.cenaBlok].join(' ')}>
            <div className={['skeleton', s.skCena].join(' ')} />
            <div className={['skeleton', s.skLinija].join(' ')} />
            <div className={['skeleton', s.skLinijaKratka].join(' ')} />
            <div className={['skeleton', s.skLinija].join(' ')} />
            <div className={['skeleton', s.skDugme].join(' ')} />
          </div>

          <div className={[s.skBlok, s.prodavac].join(' ')}>
            <div className={['skeleton', s.skLinijaKratka].join(' ')} />
            <div className={['skeleton', s.skLinija].join(' ')} />
            <div className={['skeleton', s.skLinija].join(' ')} />
            <div className={['skeleton', s.skLinijaKratka].join(' ')} />
          </div>
        </div>

        <div className={s.detalji}>
          <div className={s.sekcija}>
            <div className={['skeleton', s.skRed].join(' ')} />
            <div className={['skeleton', s.skTabela].join(' ')} />
          </div>
          <div className={['skeleton', s.skStanje].join(' ')} />
        </div>
      </div>
    </div>
  )
}
