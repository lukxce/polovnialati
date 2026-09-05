'use client'

import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { filteriUQuery, type Filteri } from '@/lib/filteri'

/**
 * URL je jedini izvor istine za filtere. Ovaj hook zna samo dve stvari:
 * kako se skup filtera pretvara u putanju i kako se do te putanje ide.
 *
 * `zakljucanaKategorija` postoji zbog `/kategorija/[...slug]`: tamo kategorija
 * već stoji u putanji, pa se ne duplira u query-ju. Izbor potkategorije se i
 * dalje serijalizuje normalno.
 */
export function useFilteri(
  filteri: Filteri,
  osnova: string,
  zakljucanaKategorija?: string,
  zakljucanBrend?: string,
) {
  const router = useRouter()
  const [uToku, pocni] = useTransition()

  const putanja = useCallback(
    (f: Filteri) => {
      const kopija: Filteri = { ...f }
      if (zakljucanaKategorija && kopija.kategorija === zakljucanaKategorija) {
        kopija.kategorija = undefined
      }
      // Isto i za brend: putanja `/brend/<slug>` ga već nosi. Ako je korisnik
      // dodao još brendova radi poređenja, ostaju samo oni ostali.
      if (zakljucanBrend && kopija.brend?.length) {
        const ostali = kopija.brend.filter((b) => b !== zakljucanBrend)
        kopija.brend = ostali.length ? ostali : undefined
      }
      const q = filteriUQuery(kopija)
      return q ? `${osnova}?${q}` : osnova
    },
    [osnova, zakljucanaKategorija, zakljucanBrend],
  )

  const idi = useCallback(
    (f: Filteri) => {
      pocni(() => {
        router.push(putanja(f), { scroll: false })
      })
    },
    [putanja, router],
  )

  const postavi = useCallback(
    (delta: Partial<Filteri>) => idi({ ...filteri, ...delta }),
    [filteri, idi],
  )

  return { putanja, idi, postavi, uToku }
}

/** Uključi/isključi vrednost u višestrukom filteru; prazno → `undefined`. */
export function prebaciVrednost<T extends string>(lista: T[] | undefined, v: T): T[] | undefined {
  const trenutno = lista ?? []
  const novo = trenutno.includes(v) ? trenutno.filter((x) => x !== v) : [...trenutno, v]
  return novo.length ? novo : undefined
}
