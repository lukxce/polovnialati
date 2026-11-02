import s from './Logo.module.css'

/**
 * Znak: etiketa za cenu (oglas) čija je rupa šestougaona navrtka (alat).
 * Crta se u 32×32 i okreće za -45°, da vrh etikete gleda gore levo.
 * Rupa je prozirna, pa se kroz nju vidi pozadina.
 */
export const ETIKETA_PUTANJA =
  'M3.6 14.6 9.8 7.9Q10.9 6.8 12.4 6.8H26Q29 6.8 29 9.8V22.2Q29 25.2 26 25.2H12.4Q10.9 25.2 9.8 24.1L3.6 17.4Q2.4 16 3.6 14.6ZM15.5 16 14 18.6H11L9.5 16 11 13.4H14Z'
export const ETIKETA_OKRET = 'rotate(-45 16 16)'

export function Etiketa({ className, boja = 'var(--amber)' }: { className?: string; boja?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path d={ETIKETA_PUTANJA} transform={ETIKETA_OKRET} fill={boja} fillRule="evenodd" />
    </svg>
  )
}

/**
 * Logo „polovnialati": etiketa + reč napisana kao domen. Veličina se nasleđuje
 * od font-size roditelja. `slozi`: na uskom telefonu reč ide u dva reda, da
 * stane u zaglavlje pored ikonica.
 */
export default function Logo({ slozi = false }: { slozi?: boolean }) {
  return (
    <span className={slozi ? `${s.logo} ${s.slozi}` : s.logo}>
      <Etiketa className={s.znak} />
      <span className={s.rec}>
        <span>polovni</span>
        <span className={s.naglasak}>alati</span>
      </span>
    </span>
  )
}
