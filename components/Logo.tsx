import s from './Logo.module.css'

/** Znak: šestougaona navrtka. Rupa je prozirna, pa se vidi pozadina ispod. */
export const NAVRTKA_PUTANJA =
  'M28.5 16 22.25 26.83H9.75L3.5 16 9.75 5.17h12.5ZM10 16a6 6 0 1 0 12 0 6 6 0 1 0-12 0Z'

export function Navrtka({ className, boja = 'var(--amber)' }: { className?: string; boja?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" focusable="false">
      <path
        d={NAVRTKA_PUTANJA}
        fill={boja}
        fillRule="evenodd"
        stroke={boja}
        strokeWidth={3}
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Logo „polovni alati": navrtka + reč. Veličina se nasleđuje od font-size roditelja. */
export default function Logo() {
  return (
    <span className={s.logo}>
      <Navrtka className={s.znak} />
      <span className={s.rec}>
        <span className={s.lako}>polovni</span>
        <span>alati</span>
      </span>
    </span>
  )
}
