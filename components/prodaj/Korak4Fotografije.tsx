'use client'

import { useCallback, useId, useRef, useState } from 'react'
import { Ikona } from '@/components/Ikone'
import { pluralSr } from '@/lib/format'
import { noviId, type Fotografija, type Greske, type Nacrt } from './model'
import s from './tok.module.css'

type Props = {
  nacrt: Nacrt
  azuriraj: (delta: Partial<Nacrt>) => void
  /** Opoziv jednog objektnog URL-a drži tok, ne ovaj korak. */
  ukloniFotografiju: (id: string) => void
  greske: Greske
}

const MAKS = 12

export function Korak4Fotografije({ nacrt, azuriraj, ukloniFotografiju, greske }: Props) {
  const id = useId()
  const unos = useRef<HTMLInputElement | null>(null)
  const [prevlaci, setPrevlaci] = useState(false)
  const [odbijeno, setOdbijeno] = useState<string | undefined>(undefined)
  const [vucen, setVucen] = useState<string | undefined>(undefined)

  const dodaj = useCallback(
    (lista: FileList | File[]) => {
      const fajlovi = Array.from(lista)
      const slike = fajlovi.filter((f) => f.type.startsWith('image/'))
      const odbaceno = fajlovi.length - slike.length
      const mesta = MAKS - nacrt.fotografije.length
      const uzeti = slike.slice(0, Math.max(0, mesta))

      const poruke: string[] = []
      if (odbaceno > 0) {
        poruke.push(
          `Preskočeno ${odbaceno} ${pluralSr(odbaceno, [
            'fajl koji nije slika',
            'fajla koja nisu slike',
            'fajlova koji nisu slike',
          ])}.`,
        )
      }
      if (slike.length > uzeti.length) {
        poruke.push(`Oglas prima najviše ${MAKS} fotografija, višak je odbačen.`)
      }
      setOdbijeno(poruke.length ? poruke.join(' ') : undefined)

      if (uzeti.length === 0) return
      const nove: Fotografija[] = uzeti.map((f) => ({
        id: noviId(),
        url: URL.createObjectURL(f),
        ime: f.name,
      }))
      azuriraj({ fotografije: [...nacrt.fotografije, ...nove] })
    },
    [azuriraj, nacrt.fotografije],
  )

  function pomeri(indeks: number, smer: -1 | 1) {
    const cilj = indeks + smer
    if (cilj < 0 || cilj >= nacrt.fotografije.length) return
    const kopija = [...nacrt.fotografije]
    const [uzeta] = kopija.splice(indeks, 1)
    kopija.splice(cilj, 0, uzeta)
    azuriraj({ fotografije: kopija })
  }

  function naslovna(indeks: number) {
    if (indeks === 0) return
    const kopija = [...nacrt.fotografije]
    const [uzeta] = kopija.splice(indeks, 1)
    azuriraj({ fotografije: [uzeta, ...kopija] })
  }

  function pusti(ciljId: string) {
    if (!vucen || vucen === ciljId) return
    const kopija = [...nacrt.fotografije]
    const od = kopija.findIndex((f) => f.id === vucen)
    const na = kopija.findIndex((f) => f.id === ciljId)
    if (od < 0 || na < 0) return
    const [uzeta] = kopija.splice(od, 1)
    kopija.splice(na, 0, uzeta)
    azuriraj({ fotografije: kopija })
    setVucen(undefined)
  }

  return (
    <div className={s.korakTelo}>
      <div className={s.iskrenost}>
        <Ikona ime="stit" velicina={18} />
        <p>
          <strong>Fotografije se otpremaju tek kad klikneš Objavi.</strong> Pre slanja ih smanjujemo
          i brišemo podatke o lokaciji iz fotografije. Snimaj na dnevnom svetlu: pločicu sa
          modelom, mesta habanja i sav pribor iz oglasa. Najviše 12 fotografija, prva je naslovna.
        </p>
      </div>

      <div
        className={[s.dropzona, prevlaci ? s.dropzonaAktivna : ''].filter(Boolean).join(' ')}
        onDragOver={(e) => {
          e.preventDefault()
          setPrevlaci(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setPrevlaci(false)
        }}
        onDrop={(e) => {
          e.preventDefault()
          setPrevlaci(false)
          if (e.dataTransfer?.files?.length) dodaj(e.dataTransfer.files)
        }}
      >
        <span className={s.dropIkona}>
          <Ikona ime="foto" velicina={28} />
        </span>
        <p className={s.dropNaslov}>Prevuci fotografije ovde</p>
        <p className={s.dropOpis}>
          JPG ili PNG, do {MAKS} komada. Prva je naslovna i ona ide na karticu u pretrazi.
        </p>
        <button type="button" className="btn btn-secondary" onClick={() => unos.current?.click()}>
          Izaberi sa uređaja
        </button>
        <input
          ref={unos}
          id={`${id}-unos`}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          aria-label="Izaberi fotografije"
          onChange={(e) => {
            if (e.target.files?.length) dodaj(e.target.files)
            e.target.value = ''
          }}
        />
      </div>

      {odbijeno ? (
        <p className={s.upozorenje} role="status">
          {odbijeno}
        </p>
      ) : null}

      {greske.fotografije ? (
        <p className={s.greska} role="alert">
          {greske.fotografije}
        </p>
      ) : null}

      {nacrt.fotografije.length > 0 ? (
        <>
          <div className={s.proveraStatus} role="status">
            <span className={s.proveraBrojka}>{nacrt.fotografije.length}</span>
            <span className={s.proveraTekst}>
              {pluralSr(nacrt.fotografije.length, ['fotografija', 'fotografije', 'fotografija'])} ·
              redosled menjaš strelicama, na računaru i prevlačenjem
            </span>
          </div>

          <ul className={s.galerija}>
            {nacrt.fotografije.map((f, i) => (
              <li
                key={f.id}
                className={[s.slicica, vucen === f.id ? s.slicicaVucena : ''].filter(Boolean).join(' ')}
                draggable
                onDragStart={() => setVucen(f.id)}
                onDragEnd={() => setVucen(undefined)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  pusti(f.id)
                }}
              >
                <div className={s.slicicaMedija}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={f.url} alt={`Fotografija ${i + 1}: ${f.ime}`} className={s.slicicaSlika} />
                  {i === 0 ? <span className={s.naslovnaOznaka}>Naslovna</span> : null}
                </div>

                <div className={s.slicicaAlatke}>
                  <button
                    type="button"
                    className={s.slicicaDugme}
                    onClick={() => pomeri(i, -1)}
                    disabled={i === 0}
                    aria-label={`Pomeri fotografiju ${i + 1} unazad`}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className={s.slicicaDugme}
                    onClick={() => pomeri(i, 1)}
                    disabled={i === nacrt.fotografije.length - 1}
                    aria-label={`Pomeri fotografiju ${i + 1} unapred`}
                  >
                    ›
                  </button>
                  <button
                    type="button"
                    className={s.slicicaDugme}
                    onClick={() => naslovna(i)}
                    disabled={i === 0}
                    aria-label={`Postavi fotografiju ${i + 1} kao naslovnu`}
                    title="Postavi kao naslovnu"
                  >
                    <Ikona ime="zvezda" velicina={16} />
                  </button>
                  <button
                    type="button"
                    className={[s.slicicaDugme, s.slicicaUkloni].join(' ')}
                    onClick={() => ukloniFotografiju(f.id)}
                    aria-label={`Ukloni fotografiju ${i + 1}`}
                    title="Ukloni"
                  >
                    <Ikona ime="x" velicina={16} />
                  </button>
                </div>

                <p className={s.slicicaIme} title={f.ime}>
                  {f.ime}
                </p>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={s.savetBlok}>
          <h3 className={s.savetNaslov}>Četiri fotografije koje kupci traže</h3>
          <ol className={s.savetLista}>
            <li>
              <strong>Cela mašina na ravnoj podlozi</strong>, bez gomile alata okolo, po dnevnom
              svetlu.
            </li>
            <li>
              <strong>Natpisna pločica</strong> sa modelom i serijskim brojem, čitljivo. Ovo je
              fotografija koja razlikuje ozbiljan oglas od prepakovane krađe.
            </li>
            <li>
              <strong>Prihvat i najistrošeniji deo</strong>: stezna glava, ploča brusilice,
              kontakti baterije.
            </li>
            <li>
              <strong>Sve što ide uz mašinu</strong>, izloženo zajedno: kofer, punjač, ključevi,
              račun.
            </li>
          </ol>
        </div>
      )}
    </div>
  )
}

export default Korak4Fotografije
