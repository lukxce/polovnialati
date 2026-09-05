import Link from 'next/link'
import type { ReactNode } from 'react'

const OBRAZAC = /\[([^\]]+)\]\(([^)]+)\)/g

/**
 * Minimalni inline renderer: `[tekst](/putanja)` postaje `<Link>`.
 * Namerno ne podržava ništa drugo — sadržaj vodiča je struktuiran u blokovima,
 * a ne u markdownu.
 */
export function Tekst({ children }: { children: string }) {
  const delovi: ReactNode[] = []
  let poslednji = 0
  let m: RegExpExecArray | null

  OBRAZAC.lastIndex = 0
  while ((m = OBRAZAC.exec(children)) !== null) {
    if (m.index > poslednji) delovi.push(children.slice(poslednji, m.index))
    delovi.push(
      <Link key={`${m[2]}-${m.index}`} href={m[2]}>
        {m[1]}
      </Link>,
    )
    poslednji = m.index + m[0].length
  }
  if (poslednji < children.length) delovi.push(children.slice(poslednji))

  return <>{delovi}</>
}

/** Isti tekst bez linkova — za meta opise i JSON-LD. */
export function bezLinkova(s: string): string {
  return s.replace(OBRAZAC, '$1')
}

export default Tekst
