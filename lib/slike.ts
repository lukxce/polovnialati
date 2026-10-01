import 'server-only'
import { randomBytes } from 'node:crypto'
import { mkdir, unlink, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { del, put } from '@vercel/blob'

/**
 * Skladište fotografija oglasa.
 *
 * Produkcija: Vercel Blob (BLOB_READ_WRITE_TOKEN upisuje Vercel kad se Blob
 * store poveže sa projektom). U bazi stoji samo javni URL.
 * Lokalno, bez tokena: fajl ide u public/uploads/ i služi ga `next dev`.
 */

const BLOB_DOMEN = '.public.blob.vercel-storage.com'
const LOKALNI_PREFIKS = '/uploads/'

export const MAKS_BAJTOVA = 4 * 1024 * 1024
export const TIPOVI: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
}

function blobUkljucen(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN
}

/** Proverava prave bajtove fajla, ne samo ono što je klijent rekao u Content-Type. */
export function prepoznajTip(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return 'image/jpeg'
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return 'image/png'
  if (
    b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46 &&
    b[8] === 0x57 && b[9] === 0x45 && b[10] === 0x42 && b[11] === 0x50
  )
    return 'image/webp'
  return null
}

export async function sacuvajSliku(
  userId: string,
  bajtovi: Uint8Array,
  tip: string,
): Promise<string> {
  const ime = `${Date.now().toString(36)}-${randomBytes(6).toString('hex')}.${TIPOVI[tip]}`

  if (blobUkljucen()) {
    const rez = await put(`oglasi/${userId}/${ime}`, Buffer.from(bajtovi), {
      access: 'public',
      contentType: tip,
      cacheControlMaxAge: 60 * 60 * 24 * 365,
    })
    return rez.url
  }

  if (process.env.NODE_ENV === 'production') {
    throw new Error('BLOB_READ_WRITE_TOKEN nije podešen — poveži Vercel Blob store sa projektom.')
  }

  const folder = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(folder, { recursive: true })
  await writeFile(path.join(folder, ime), bajtovi)
  return `${LOKALNI_PREFIKS}${ime}`
}

/** Samo URL-ovi iz našeg skladišta smeju u oglas — ne tuđi linkovi ni data: URL-ovi. */
export function nasaSlika(url: string): boolean {
  if (blobUkljucen() || process.env.NODE_ENV === 'production') {
    try {
      const u = new URL(url)
      return u.protocol === 'https:' && u.hostname.endsWith(BLOB_DOMEN) && u.pathname.startsWith('/oglasi/')
    } catch {
      return false
    }
  }
  return url.startsWith(LOKALNI_PREFIKS) && !url.includes('..')
}

/** Best effort — oglas se briše i ako brisanje fajla ne uspe. */
export async function obrisiSlike(urlovi: string[]) {
  const blob = urlovi.filter((u) => u.includes(BLOB_DOMEN))
  const lokalne = urlovi.filter((u) => u.startsWith(LOKALNI_PREFIKS) && !u.includes('..'))
  if (blob.length && blobUkljucen()) await del(blob).catch(() => {})
  for (const u of lokalne) {
    await unlink(path.join(process.cwd(), 'public', u)).catch(() => {})
  }
}
