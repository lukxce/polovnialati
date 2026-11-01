// Uvoz Milwaukee kataloga za prodavnicu Thermiq DS d.o.o.
//
// Ulaz je JSON sa listom „Oglasi" iz Alatnica-uvoz-Milwaukee-*.xlsx (jedan
// objekat po redu, ključevi = zaglavlja kolona). Uvoze se samo redovi sa
// Objaviti = DA. Fotografije se preuzimaju sa izvornih URL-ova, smanjuju na
// 1200 px (JPEG) i otpremaju u Vercel Blob; u bazi stoje samo naši URL-ovi.
//
//   npx tsx scripts/uvoz-milwaukee.ts oglasi.json --suvo        samo provera, ništa ne upisuje
//   npx tsx scripts/uvoz-milwaukee.ts oglasi.json               uvoz, jedna fotografija po oglasu
//   npx tsx scripts/uvoz-milwaukee.ts oglasi.json --slika=3     najviše 3 fotografije po oglasu
//
// Može da se pokrene više puta: slug oglasa je izveden iz kataloškog broja,
// pa postojeći oglasi ne nastaju ponovo, samo im se dodaju fotografije koje
// fale. Hobby plan na Vercel Blob-u dozvoljava ~2.000 otpremanja mesečno, a
// prekoračenje gasi Blob na 30 dana — zato --maks-otpremanja (podrazumevano
// 1.200) zaustavlja uvoz pre granice.
import { randomBytes } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { PrismaClient } from '@prisma/client'
import { put } from '@vercel/blob'
import bcrypt from 'bcryptjs'
import sharp from 'sharp'
import { proveriOglas, uSlug } from '../lib/oglasi'

const PRODAVAC = {
  email: 'kontakt@thermiq.rs',
  slug: 'thermiq-ds',
  naziv: 'Thermiq DS d.o.o.',
  tip: 'prodavnica',
  grad: 'Beograd',
  telefon: '063 1111 930',
  opis:
    'Nov Milwaukee alat i pribor sa garancijom 24 meseca. Preuzimanje u radnji na adresi Bulevar JNA 95, Beograd, ili dostava kurirskom službom širom Srbije.',
}
const GARANCIJA_MESECI = 24
const DOSTAVA = ['licno', 'kurirska']
const BLOB_DOMEN = '.public.blob.vercel-storage.com'

type Red = Record<string, string | number | null>

const argumenti = process.argv.slice(2)
const putanja = argumenti.find((a) => !a.startsWith('--'))
const opcija = (ime: string) => argumenti.find((a) => a.startsWith(`--${ime}=`))?.split('=')[1]
const SUVO = argumenti.includes('--suvo')
const MAKS_SLIKA = Number(opcija('slika') ?? 1)
const MAKS_OTPREMANJA = Number(opcija('maks-otpremanja') ?? 1200)
const OGRANICI = opcija('limit') ? Number(opcija('limit')) : Infinity

if (!putanja) {
  console.error('Upotreba: npx tsx scripts/uvoz-milwaukee.ts <oglasi.json> [--suvo] [--slika=3]')
  process.exit(1)
}
if (!SUVO && !process.env.BLOB_READ_WRITE_TOKEN) {
  console.error('BLOB_READ_WRITE_TOKEN nije podešen — bez njega fotografije nemaju gde da se otpreme.')
  process.exit(1)
}

const db = new PrismaClient()
let otpremljeno = 0

const s = (v: unknown) => (v === null || v === undefined ? '' : String(v).trim())
const lista = (v: unknown) => s(v).split(' | ').map((x) => x.trim()).filter(Boolean)

function specifikacije(r: Red) {
  const spec = lista(r.Specifikacije)
    .map((par) => {
      const i = par.indexOf(':')
      return i > 0 ? { naziv: par.slice(0, i).trim(), vrednost: par.slice(i + 1).trim() } : null
    })
    .filter((x): x is { naziv: string; vrednost: string } => !!x && !!x.naziv && !!x.vrednost)
  if (spec.length < 15 && s(r.Sifra)) spec.push({ naziv: 'Kataloški broj', vrednost: s(r.Sifra) })
  if (spec.length < 15 && s(r.EAN)) spec.push({ naziv: 'EAN', vrednost: s(r.EAN) })
  return spec.slice(0, 15)
}

/** Varijante u tabeli ponekad dobiju dimenziju dvaput: „Kruna - 62 mm 62 mm" → „Kruna - 62 mm". */
function naslov(r: Red) {
  const t = s(r.Naslov).replace(/\s+/g, ' ')
  const m = t.match(/^(.*?)(.+) \2$/)
  return m ? `${m[1]}${m[2]}` : t
}

async function preuzmi(url: string): Promise<Buffer> {
  for (let pokusaj = 1; ; pokusaj++) {
    try {
      const odg = await fetch(url, { signal: AbortSignal.timeout(30_000) })
      if (!odg.ok) throw new Error(`HTTP ${odg.status}`)
      return Buffer.from(await odg.arrayBuffer())
    } catch (e) {
      if (pokusaj >= 3) throw e
      await new Promise((r) => setTimeout(r, 1000 * pokusaj))
    }
  }
}

async function otpremi(userId: string, sifra: string, redniBroj: number, izvor: string) {
  const sirovo = await preuzmi(izvor)
  const jpeg = await sharp(sirovo)
    .rotate()
    .resize({ width: 1200, height: 1200, fit: 'inside', withoutEnlargement: true })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer()
  if (otpremljeno >= MAKS_OTPREMANJA) throw new Error('GRANICA')
  otpremljeno++
  const rez = await put(`oglasi/${userId}/milwaukee-${uSlug(sifra)}-${redniBroj}.jpg`, jpeg, {
    access: 'public',
    contentType: 'image/jpeg',
    cacheControlMaxAge: 60 * 60 * 24 * 365,
    addRandomSuffix: false,
    allowOverwrite: true,
  })
  return rez.url
}

async function prodavac() {
  const postoji = await db.user.findUnique({ where: { email: PRODAVAC.email } })
  if (postoji) return { id: postoji.id, lozinka: null as string | null }
  const lozinka = randomBytes(12).toString('base64url')
  if (SUVO) return { id: 'suvo', lozinka: null }
  const u = await db.user.create({
    data: { ...PRODAVAC, passwordHash: await bcrypt.hash(lozinka, 12), verifikovan: true },
  })
  return { id: u.id, lozinka }
}

async function main() {
  const redovi = (JSON.parse(readFileSync(putanja!, 'utf8')) as Red[])
    .filter((r) => s(r.Objaviti) === 'DA')
    .slice(0, OGRANICI)
  const { id: userId, lozinka } = await prodavac()

  const zbir = { novih: 0, dopunjenih: 0, preskoceno: 0, gresaka: 0 }
  const greske: string[] = []

  for (const [i, r] of redovi.entries()) {
    const sifra = s(r.Sifra)
    const slug = `${uSlug(naslov(r), 60)}-${uSlug(sifra)}`
    const izvori = lista(r.Slike).slice(0, MAKS_SLIKA)
    const postojeci = SUVO ? null : await db.oglas.findUnique({ where: { slug }, select: { id: true, slike: true } })

    try {
      if (postojeci && postojeci.slike.length >= izvori.length) {
        zbir.preskoceno++
        continue
      }

      // Nov oglas se proverava pre otpremanja, da neispravan red ne potroši otpremanja.
      const provera = postojeci
        ? null
        : proveriOglas(
            {
              naslov: naslov(r),
              kategorija: s(r.Kategorija),
              brend: s(r.Brend),
              model: s(r.Model),
              stanje: 'novo',
              cena: Number(r.Cena_RSD),
              cenaDogovor: false,
              opis: s(r.Opis),
              slike: ['provera'],
              specifikacije: specifikacije(r),
              uPakovanju: lista(r.U_pakovanju),
              stanjeChecklist: [],
              garancija: GARANCIJA_MESECI,
              akuSistem: s(r.AkuSistem) || null,
              lokacija: PRODAVAC.grad,
              dostava: DOSTAVA,
            },
            () => true,
          )
      if (provera && !provera.ok) throw new Error(provera.greska)
      if (provera?.ok && !provera.oglas.akuSistem && s(r.AkuSistem)) {
        throw new Error(`nepoznat akumulatorski sistem „${s(r.AkuSistem)}"`)
      }

      // Fotografije koje već postoje se ne otpremaju ponovo.
      const slike = postojeci ? [...postojeci.slike] : []
      for (let n = slike.length; n < izvori.length; n++) {
        slike.push(SUVO ? `https://x${BLOB_DOMEN}/oglasi/${userId}/${n}.jpg` : await otpremi(userId, sifra, n + 1, izvori[n]))
      }

      if (postojeci) {
        await db.oglas.update({ where: { id: postojeci.id }, data: { slike } })
        zbir.dopunjenih++
      } else if (provera?.ok) {
        if (!SUVO) await db.oglas.create({ data: { ...provera.oglas, slike, slug, userId } })
        zbir.novih++
      }
    } catch (e) {
      if (e instanceof Error && e.message === 'GRANICA') {
        console.log(`\nZaustavljeno na granici od ${MAKS_OTPREMANJA} otpremanja. Ostatak pokreni sledećeg meseca.`)
        break
      }
      zbir.gresaka++
      greske.push(`${sifra} ${naslov(r)}: ${e instanceof Error ? e.message : e}`)
    }

    if ((i + 1) % 25 === 0) console.log(`${i + 1}/${redovi.length} · otpremljeno fotografija: ${otpremljeno}`)
  }

  console.log(`\n${SUVO ? '[SUVO] ' : ''}Novih: ${zbir.novih}, dopunjenih: ${zbir.dopunjenih}, preskočeno: ${zbir.preskoceno}, grešaka: ${zbir.gresaka}, otpremljeno fotografija: ${otpremljeno}`)
  for (const g of greske) console.log(`  ✗ ${g}`)
  if (lozinka) console.log(`\nNalog ${PRODAVAC.email} napravljen. Privremena lozinka: ${lozinka}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
