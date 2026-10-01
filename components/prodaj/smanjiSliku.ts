/**
 * Smanjuje fotografiju u pregledaču pre otpremanja: najduža strana 2000 px,
 * JPEG ~85%. Fotografija sa telefona od 4–8 MB postaje ~300–700 KB — brže
 * otpremanje na mobilnoj mreži i daleko ispod limita tela zahteva na serveru.
 * Usput briše EXIF (GPS lokaciju iz fotografije), jer se crta na canvas.
 */
const MAKS_STRANA = 2000
const KVALITET = 0.85

export async function smanjiSliku(izvor: Blob): Promise<Blob> {
  let bitmapa: ImageBitmap
  try {
    bitmapa = await createImageBitmap(izvor, { imageOrientation: 'from-image' })
  } catch {
    throw new Error(
      'Ovaj format fotografije pregledač ne može da otvori (npr. HEIC). Sačuvaj je kao JPG i dodaj ponovo.',
    )
  }

  const razmera = Math.min(1, MAKS_STRANA / Math.max(bitmapa.width, bitmapa.height))
  const sirina = Math.round(bitmapa.width * razmera)
  const visina = Math.round(bitmapa.height * razmera)

  const platno = document.createElement('canvas')
  platno.width = sirina
  platno.height = visina
  const ctx = platno.getContext('2d')
  if (!ctx) throw new Error('Pregledač ne može da obradi fotografiju.')
  ctx.fillStyle = '#ffffff' // providne PNG površine postaju bele, ne crne
  ctx.fillRect(0, 0, sirina, visina)
  ctx.drawImage(bitmapa, 0, 0, sirina, visina)
  bitmapa.close()

  return new Promise((resolve, reject) =>
    platno.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('Fotografija nije obrađena.'))),
      'image/jpeg',
      KVALITET,
    ),
  )
}
