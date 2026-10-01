'use client'

import { useEffect, useState } from 'react'

export type SesijaKlijent = {
  id: string
  naziv: string
  uloga: 'PRODAVAC' | 'ADMIN'
  neprocitano: number
} | null

/**
 * Sesija za klijentske komponente (navigacija, kontakt na stranici oglasa).
 * Javne stranice su statične, pa se sesija ne čita na serveru nego jednim
 * zajedničkim pozivom /api/auth/sesija — sve komponente na strani dele isti
 * odgovor. `osveziSesiju()` se zove posle prijave, registracije i odjave.
 */
let trenutna: SesijaKlijent | undefined
let zahtev: Promise<SesijaKlijent> | null = null
const slusaoci = new Set<(s: SesijaKlijent) => void>()

function ucitaj(): Promise<SesijaKlijent> {
  zahtev ??= fetch('/api/auth/sesija', { cache: 'no-store' })
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null)
    .then((s: SesijaKlijent) => {
      trenutna = s
      for (const f of slusaoci) f(s)
      return s
    })
  return zahtev
}

export function osveziSesiju() {
  zahtev = null
  return ucitaj()
}

/** `undefined` dok se ne učita, `null` za neprijavljenog posetioca. */
export function useSesija(): SesijaKlijent | undefined {
  const [sesija, setSesija] = useState<SesijaKlijent | undefined>(trenutna)
  useEffect(() => {
    slusaoci.add(setSesija)
    ucitaj()
    return () => {
      slusaoci.delete(setSesija)
    }
  }, [])
  return sesija
}
