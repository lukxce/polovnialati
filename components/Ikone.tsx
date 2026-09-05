import type { SVGProps } from 'react'

/**
 * Inline SVG set. Stroke 1.5px, uvek `currentColor`, viewBox 24×24.
 * Koristi se kao `<Ikona ime="pretraga" />`.
 */
export type ImeIkone =
  | 'busilica'
  | 'burgija'
  | 'laser'
  | 'kompresor'
  | 'zavarivanje'
  | 'vibro'
  | 'merdevine'
  | 'kofer'
  | 'pretraga'
  | 'filter'
  | 'srce'
  | 'srce-puno'
  | 'lokacija'
  | 'kamion'
  | 'stit'
  | 'alat'
  | 'prodavnica'
  | 'osoba'
  | 'kljuc'
  | 'strelica'
  | 'cek'
  | 'x'
  | 'meni'
  | 'foto'
  | 'oko'
  | 'sort'
  | 'baterija'
  | 'zvezda'
  | 'sat'
  | 'plus'
  | 'minus'
  | 'poruka'

const PUTANJE: Record<ImeIkone, React.ReactNode> = {
  pretraga: (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M20 20l-4.2-4.2" />
    </>
  ),
  filter: (
    <>
      <path d="M3.5 6h17" />
      <path d="M6.5 12h11" />
      <path d="M10 18h4" />
    </>
  ),
  srce: <path d="M12 20s-7.3-4.6-8.9-9.1C1.9 7.4 3.9 4.5 7 4.5c1.9 0 3.6 1.1 5 3 1.4-1.9 3.1-3 5-3 3.1 0 5.1 2.9 3.9 6.4C19.3 15.4 12 20 12 20z" />,
  'srce-puno': (
    <path
      d="M12 20s-7.3-4.6-8.9-9.1C1.9 7.4 3.9 4.5 7 4.5c1.9 0 3.6 1.1 5 3 1.4-1.9 3.1-3 5-3 3.1 0 5.1 2.9 3.9 6.4C19.3 15.4 12 20 12 20z"
      fill="currentColor"
      stroke="none"
    />
  ),
  lokacija: (
    <>
      <path d="M12 21c4-4.4 6.5-7.7 6.5-10.5a6.5 6.5 0 1 0-13 0C5.5 13.3 8 16.6 12 21z" />
      <circle cx="12" cy="10.3" r="2.4" />
    </>
  ),
  kamion: (
    <>
      <path d="M2.5 6.5h10.5v9H2.5z" />
      <path d="M13 9.5h4l3.5 3.2v2.8H13z" />
      <circle cx="7" cy="17.5" r="2" />
      <circle cx="17" cy="17.5" r="2" />
    </>
  ),
  stit: (
    <>
      <path d="M12 3l7 2.8v5.4c0 4.3-2.9 7.7-7 9.3-4.1-1.6-7-5-7-9.3V5.8z" />
      <path d="M9.2 12.1l2 2 3.6-3.9" />
    </>
  ),
  alat: (
    <>
      <path d="M14.8 3.6a4.8 4.8 0 0 0-5.6 6.5L3.8 15.5a2 2 0 0 0 0 2.8l1.9 1.9a2 2 0 0 0 2.8 0l5.4-5.4a4.8 4.8 0 0 0 6.5-5.6l-3 3-2.9-2.9z" />
    </>
  ),
  prodavnica: (
    <>
      <path d="M4 9.5V20h16V9.5" />
      <path d="M3 9.5L4.6 4.5h14.8L21 9.5a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0z" />
      <path d="M9.5 20v-5.5h5V20" />
    </>
  ),
  osoba: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.8 20c.6-3.7 3.6-5.9 7.2-5.9s6.6 2.2 7.2 5.9" />
    </>
  ),
  kljuc: (
    <>
      <path d="M9.6 8.4a4.6 4.6 0 1 0 3.6 3.6l6.4 6.4-1.9 1.9-6.4-6.4a4.6 4.6 0 0 0-1.7-5.5z" />
      <path d="M4 4.6l2.6-1.2 3.4 3.4-1.4 1.4-3.4-3.4z" />
    </>
  ),
  strelica: (
    <>
      <path d="M4.5 12h14" />
      <path d="M13 6.5l5.5 5.5-5.5 5.5" />
    </>
  ),
  cek: <path d="M4.8 12.6l4.6 4.6L19.4 7.2" />,
  x: (
    <>
      <path d="M5.5 5.5l13 13" />
      <path d="M18.5 5.5l-13 13" />
    </>
  ),
  meni: (
    <>
      <path d="M3.5 7h17" />
      <path d="M3.5 12h17" />
      <path d="M3.5 17h17" />
    </>
  ),
  foto: (
    <>
      <rect x="3" y="6" width="18" height="14" rx="2.5" />
      <path d="M8.5 6l1.6-2.5h3.8L15.5 6" />
      <circle cx="12" cy="13" r="3.4" />
    </>
  ),
  oko: (
    <>
      <path d="M2.5 12S6 6.2 12 6.2 21.5 12 21.5 12 18 17.8 12 17.8 2.5 12 2.5 12z" />
      <circle cx="12" cy="12" r="2.8" />
    </>
  ),
  sort: (
    <>
      <path d="M7 4.5v15" />
      <path d="M3.5 16l3.5 3.5L10.5 16" />
      <path d="M17 19.5v-15" />
      <path d="M13.5 8L17 4.5 20.5 8" />
    </>
  ),
  baterija: (
    <>
      <rect x="3" y="7" width="15" height="10" rx="2.5" />
      <path d="M21 10.5v3" />
      <path d="M12.5 9l-2.6 3.4h3l-2 2.6" />
    </>
  ),
  zvezda: (
    <path d="M12 3.8l2.5 5.1 5.6.8-4 4 .9 5.6-5-2.6-5 2.6.9-5.6-4-4 5.6-.8z" />
  ),
  sat: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.2V12l3.2 2" />
    </>
  ),
  poruka: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="2" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </>
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  minus: <path d="M5 12h14" />,

  /* ── Ikone nadkategorija ─────────────────────────────────────
     Deset nadkategorija su glavna navigacija na početnoj; dok su sve
     padale na generički ključ, mreža je izgledala kao pet istih ikona. */

  busilica: (
    <>
      <path d="M3.5 8.5h9.5v5.5H3.5z" />
      <path d="M13 10h2.6v2.5H13z" />
      <path d="M15.6 11.25h4.9" />
      <path d="M6.5 14v3.6h3.2" />
    </>
  ),
  burgija: (
    <>
      <path d="M12 3.5v13" />
      <path d="M12 21l-2.6-3.4h5.2z" />
      <path d="M9.6 6.2h4.8M9.6 9.4h4.8M9.6 12.6h4.8" />
    </>
  ),
  laser: (
    <>
      <path d="M3.5 9.2h8.6v5.6H3.5z" />
      <path d="M14 12h6.5" />
      <path d="M14 8.9l5.2-2.6" />
      <path d="M14 15.1l5.2 2.6" />
    </>
  ),
  kompresor: (
    <>
      <path d="M3.5 11.5h13.2v5.6H3.5z" />
      <circle cx="7.6" cy="7.4" r="2.7" />
      <path d="M13.6 11.5V6.6h5.4" />
      <path d="M6.2 17.1v2.4M14 17.1v2.4" />
    </>
  ),
  zavarivanje: (
    <>
      <path d="M13.4 2.8L6.6 12.6h4.8L9.9 21.2l7.5-10.4h-5.2z" />
    </>
  ),
  vibro: (
    <>
      <path d="M6 15.2h12v3.6H6z" />
      <path d="M9 15.2V8.4h6v6.8" />
      <path d="M3.4 10.6c-1 1.6-1 3.2 0 4.8" />
      <path d="M20.6 10.6c1 1.6 1 3.2 0 4.8" />
    </>
  ),
  merdevine: (
    <>
      <path d="M8 2.8v18.4M16 2.8v18.4" />
      <path d="M8 7h8M8 11h8M8 15h8M8 19h8" />
    </>
  ),
  kofer: (
    <>
      <path d="M3 8.4h18v10.8H3z" />
      <path d="M9 8.4V5.6h6v2.8" />
      <path d="M3 13.2h18" />
      <path d="M10.4 11.4h3.2v3.6h-3.2z" />
    </>
  ),
}

/**
 * Ključevi ikona iz taksonomije kategorija svode se na osnovni set.
 * Tako `<Ikona ime={kategorija.ikona} />` nikad ne pukne.
 */
const KATEGORIJA_U_IKONU: Record<string, ImeIkone> = {
  'cekic-busilica': 'busilica',
  brusilica: 'alat',
  testera: 'alat',
  rende: 'alat',
  'vibro-brusilica': 'alat',
  mesalica: 'alat',
  'aku-busilica': 'baterija',
  punjac: 'baterija',
  cekic: 'alat',
  klesta: 'alat',
  odvijac: 'alat',
  stega: 'alat',
  nivelator: 'oko',
  detektor: 'oko',
  daljinomer: 'oko',
  libela: 'filter',
  kruna: 'burgija',
  disk: 'alat',
  'list-testere': 'alat',
  sraf: 'alat',
  'pneumatski-kljuc': 'kljuc',
  crevo: 'alat',
  inverter: 'stit',
  mig: 'stit',
  maska: 'stit',
  pumpa: 'alat',
  agregat: 'alat',
  betonjerka: 'alat',
  skela: 'filter',
  'radni-sto': 'prodavnica',
  usisivac: 'alat',
}

export function razresiIkonu(kljuc: string): ImeIkone {
  if (kljuc in PUTANJE) return kljuc as ImeIkone
  return KATEGORIJA_U_IKONU[kljuc] ?? 'alat'
}

export type IkonaProps = Omit<SVGProps<SVGSVGElement>, 'name'> & {
  ime: ImeIkone | string
  /** Veličina u px. Podrazumevano 20. */
  velicina?: number
}

export function Ikona({ ime, velicina = 20, ...rest }: IkonaProps) {
  const kljuc = razresiIkonu(String(ime))
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={velicina}
      height={velicina}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {PUTANJE[kljuc]}
    </svg>
  )
}

export default Ikona
