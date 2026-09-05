import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Breadcrumbs from '@/components/Breadcrumbs'
import ProdavacOznaka from '@/components/ProdavacOznaka'
import StanjeChip from '@/components/StanjeChip'
import PosaljiPoruku from '@/components/poruke/PosaljiPoruku'
import { ucitajSesiju } from '@/lib/auth'
import { db } from '@/lib/db'
import { formatCena, garancijaLabela, stanjeDefinicija } from '@/lib/format'
import { citanjePodataka } from '@/lib/oglasi'
import type { Stanje, TipProdavca } from '@/lib/types'
import s from './stranica.module.css'

export const metadata: Metadata = { title: 'Oglas', robots: { index: false, follow: false } }

type Props = { params: Promise<{ id: string }> }

/**
 * Prava, DB-podržana verzija stranice oglasa — namerno minimalna, ne kopira
 * svih 11 sekcija demo stranice (app/oglas/[slug]) koja radi sa bogatijim,
 * izmišljenim podacima (checklist, prodavčeva ocena, godine članstva...).
 * Ovde postoji da poruke imaju gde da počnu: bilo koji ulogovan korisnik
 * (osim vlasnika) može da vidi pravi oglas na direktnom linku i pošalje
 * poruku. Nije još uključena u javnu pretragu — vidi napomenu u /prodaj.
 */
export default async function PraviOglasStranica({ params }: Props) {
  const { id } = await params
  const red = await db.oglas.findUnique({ where: { id }, include: { user: true } })
  if (!red) notFound()

  const sesija = await ucitajSesiju()
  const jeVlasnik = sesija?.userId === red.userId
  const jeAdmin = sesija?.uloga === 'ADMIN'

  // Neaktivan oglas se ne prikazuje nikom osim vlasniku i adminu.
  if (!red.aktivan && !jeVlasnik && !jeAdmin) notFound()

  const oglas = citanjePodataka(red)

  return (
    <div className={['container', s.strana].join(' ')}>
      <Breadcrumbs stavke={[{ naziv: 'Početna', href: '/' }, { naziv: oglas.naslov }]} />

      <div className={s.raspored}>
        <div className={s.glavno}>
          <header>
            <p className={s.brend}>
              {oglas.brend} · {oglas.model}
              {oglas.godiste ? ` · godište ${oglas.godiste}` : ''}
            </p>
            <h1 className={s.naslov}>{oglas.naslov}</h1>
            <div className={s.meta}>
              <span>{oglas.lokacija}</span>
              {oglas.provereno ? <span className="oznaka oznaka-provereno">Provereno</span> : null}
              {oglas.istaknuto ? <span className="oznaka oznaka-istaknuto">Izdvojeno</span> : null}
              {!oglas.aktivan ? <span className="oznaka">Neaktivan</span> : null}
            </div>
          </header>

          {oglas.slike.length ? (
            <div className={s.galerija}>
              {oglas.slike.map((src, i) => (
                // eslint-disable-next-line @next/next/no-img-element -- data URL, next/image ne prihvata
                <img key={i} src={src} alt={`${oglas.naslov}, fotografija ${i + 1}`} className={s.slika} />
              ))}
            </div>
          ) : null}

          <section className={s.sekcija}>
            <h2 className={s.h2}>Opis prodavca</h2>
            <p className={s.opis}>{oglas.opis}</p>
          </section>

          {oglas.specifikacije.length ? (
            <section className={s.sekcija}>
              <h2 className={s.h2}>Specifikacije</h2>
              <table className={s.tabela}>
                <tbody>
                  {oglas.specifikacije.map((sp) => (
                    <tr key={sp.naziv}>
                      <th scope="row">{sp.naziv}</th>
                      <td>{sp.vrednost || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          ) : null}

          {oglas.uPakovanju.length ? (
            <section className={s.sekcija}>
              <h2 className={s.h2}>U pakovanju</h2>
              <ul>
                {oglas.uPakovanju.map((stavka) => (
                  <li key={stavka}>{stavka}</li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <div className={s.bocna}>
          <div className={['card', 'card-static', s.cenaBlok].join(' ')}>
            <p className="micro">Cena</p>
            <div className={s.cenaRed}>
              <span className="cena-velika">{formatCena(oglas.cena)}</span>
              {oglas.cenaDogovor ? <span>Dogovor</span> : null}
            </div>
            <StanjeChip stanje={oglas.stanje as Stanje} veliki />
            <p className={s.stanjeDef}>{stanjeDefinicija(oglas.stanje as Stanje)}</p>
            <p className={s.garancija}>{garancijaLabela(oglas.garancija ?? undefined)}</p>
          </div>

          <div className={['card', 'card-static', s.prodavacKartica].join(' ')}>
            <p className="micro">Prodavac</p>
            <p className={s.prodavacNaziv}>{red.user.naziv}</p>
            <ProdavacOznaka tip={red.user.tip as TipProdavca} velicina="srednje" />
            <p className={s.prodavacGrad}>{red.user.grad}</p>
          </div>

          {jeVlasnik ? (
            <div className={s.vlasnikNapomena}>
              <p>Ovo je tvoj oglas.</p>
              <Link href="/nalog" className="btn btn-tertiary btn-puni">
                Idi na Moj nalog
              </Link>
            </div>
          ) : (
            <PosaljiPoruku oglasId={red.id} naslov={oglas.naslov} prijavljen={!!sesija} />
          )}
        </div>
      </div>
    </div>
  )
}
