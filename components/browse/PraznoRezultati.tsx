import Prazno from '@/components/Prazno'
import { filteriUQuery, type Filteri } from '@/lib/filteri'
import { aktivneOznake, obrisiSve } from './oznake'
import type { BrowseFasete } from './podaci'

type Props = {
  filteri: Filteri
  fasete: BrowseFasete
  osnova: string
  zakljucanaKategorija?: string
  zakljucanBrend?: string
}

function putanja(f: Filteri, osnova: string, zakljucana?: string): string {
  const kopija: Filteri = { ...f }
  if (zakljucana && kopija.kategorija === zakljucana) kopija.kategorija = undefined
  const q = filteriUQuery(kopija)
  return q ? `${osnova}?${q}` : osnova
}

/**
 * Prazno stanje koje radi posao: svaki aktivan filter je jedan tap od
 * uklanjanja. Nikad samo „nema rezultata".
 */
export function PraznoRezultati({
  filteri,
  fasete,
  osnova,
  zakljucanaKategorija,
  zakljucanBrend,
}: Props) {
  const imena = {
    kategorije: Object.fromEntries(
      fasete.stablo.flatMap((g) => [
        [g.kategorija.slug, g.kategorija.naziv] as [string, string],
        ...g.deca.map((d) => [d.slug, d.naziv] as [string, string]),
      ]),
    ),
    brendovi: Object.fromEntries(fasete.brendovi.map((b) => [b.slug, b.naziv] as [string, string])),
  }

  const oznake = aktivneOznake(filteri, imena, zakljucanaKategorija, zakljucanBrend)

  if (oznake.length === 0) {
    return (
      <Prazno
        ikona="alat"
        naslov="Ovde trenutno nema nijednog oglasa"
        opis="Ova kategorija je za sada prazna. Pogledaj ceo katalog ili postavi svoj oglas. Prvi u kategoriji dobija najviše pregleda."
        akcijaHref="/prodaj"
        akcijaTekst="Postavi oglas"
        predlozi={[{ tekst: 'Svi oglasi', href: '/oglasi' }]}
      />
    )
  }

  const predlozi = oznake.map((o) => ({
    tekst: `Skini ${o.grupa.toLowerCase()}: ${o.tekst}`,
    href: putanja(o.bezNje, osnova, zakljucanaKategorija),
  }))

  if (oznake.length > 1) {
    predlozi.push({
      tekst: 'Obriši sve filtere',
      href: putanja(obrisiSve(filteri, zakljucanaKategorija, zakljucanBrend), osnova, zakljucanaKategorija),
    })
  }

  return (
    <Prazno
      ikona="filter"
      naslov="Nijedan oglas ne prolazi kroz sve filtere"
      opis={
        <>
          Kombinacija je preuska. Najbrže rešenje je skinuti jedan filter, obično onaj koji je
          najmanje bitan za odluku. Cena i brend najčešće najviše sužavaju izbor.
        </>
      }
      predlozi={predlozi}
    />
  )
}

export default PraznoRezultati
