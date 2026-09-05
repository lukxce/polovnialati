/**
 * Raspodela ocena po zvezdicama.
 *
 * Seed podaci nose samo prosek i broj ocena, a kupcu je korisnija raspodela:
 * prosek 4,6 sa dve jedinice nije isto što i prosek 4,6 bez ijedne. Ovde se
 * raspodela izvodi determinističkim putem tako da njen prosek **stvarno** daje
 * upisanu ocenu — nije nasumična, ne menja se između renderovanja i ne
 * protivreči broju koji stoji iznad nje.
 *
 * Postupak: realan oblik raspodele (težina na petici) se nagne parametrom λ,
 * `p_i ∝ B_i · e^(λ·i)`, a λ se bisekcijom traži dok očekivanje ne padne na
 * traženi prosek. Zaokruživanje ide metodom najvećeg ostatka, pa je zbir
 * uvek tačno `ukupno`.
 */

/** Tipičan oblik ocena na marketplace-u: većina petica, rep ka jedinici. */
const OSNOVNI_OBLIK = [0.014, 0.02, 0.05, 0.18, 0.736]

function udeli(lambda: number): number[] {
  const sirovo = OSNOVNI_OBLIK.map((b, i) => b * Math.exp(lambda * i))
  const zbir = sirovo.reduce((a, b) => a + b, 0)
  return sirovo.map((x) => x / zbir)
}

function ocekivanje(p: number[]): number {
  return p.reduce((acc, x, i) => acc + x * (i + 1), 0)
}

/**
 * @param prosek prosečna ocena, 1–5
 * @param ukupno ukupan broj ocena
 * @returns broj ocena po zvezdici, indeks 0 = jedna zvezdica … 4 = pet
 */
export function raspodelaOcena(prosek: number, ukupno: number): number[] {
  if (ukupno <= 0) return [0, 0, 0, 0, 0]

  const cilj = Math.min(4.96, Math.max(1.04, prosek))

  let donja = -14
  let gornja = 14
  let p = udeli(0)
  for (let i = 0; i < 60; i++) {
    const sredina = (donja + gornja) / 2
    p = udeli(sredina)
    if (ocekivanje(p) < cilj) donja = sredina
    else gornja = sredina
  }

  const sirovi = p.map((x) => x * ukupno)
  const dole = sirovi.map((x) => Math.floor(x))
  let ostatak = ukupno - dole.reduce((a, b) => a + b, 0)

  const poOstatku = sirovi
    .map((x, i) => ({ i, ostatak: x - Math.floor(x) }))
    .sort((a, b) => b.ostatak - a.ostatak)

  const rezultat = [...dole]
  let k = 0
  while (ostatak > 0) {
    rezultat[poOstatku[k % 5].i] += 1
    ostatak -= 1
    k += 1
  }

  return rezultat
}
