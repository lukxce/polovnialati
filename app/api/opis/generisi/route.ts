import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { stanjeLabela, stanjeDefinicija } from '@/lib/format'
import type { Stanje } from '@/lib/types'

// First API route in this app — everything else in the sell flow lives
// entirely in browser memory (see components/prodaj/model.ts: "Sve živi u
// memoriji pregledača: ništa se ne šalje niti čuva"). This one call is the
// exception, since generating a description needs a model call.

const anthropic = new Anthropic() // reads ANTHROPIC_API_KEY from env — see .env.example

type SpecRed = { naziv: string; vrednost: string }

type Zahtev = {
  brend: string
  model: string
  nazivKategorije?: string
  godiste?: number
  stanje?: Stanje
  akuSistem?: string
  specifikacije: SpecRed[]
  uPakovanju: string[]
  beleska?: string // seller's own rough notes, if they wrote any — optional
}

// Only the naziv/vrednost shape — matches SpecRed above, kept separate so
// the schema doesn't drift from the request type by accident.
const OPIS_SCHEMA = {
  type: 'object' as const,
  properties: {
    opis: {
      type: 'string',
      description:
        'Opis oglasa na srpskom, 150–350 znakova, u trećem licu izbegnuto (piše prodavac o svojoj mašini). Zasnovan ISKLJUČIVO na datim činjenicama — ne izmišljaj konkretne priče o korišćenju koje nisu date.',
    },
    specPredlozi: {
      type: 'array',
      description:
        'Predlozi VREDNOSTI samo za specifikacije koje su poslate sa praznom vrednošću. Za svaku takvu stavku: ili pouzdan predlog, ili prazan string ako nisi siguran — nikad izmišljen broj.',
      items: {
        type: 'object' as const,
        properties: {
          naziv: { type: 'string' },
          vrednost: {
            type: 'string',
            description: 'Predložena vrednost, ili prazan string "" ako nema pouzdanog podatka.',
          },
        },
        required: ['naziv', 'vrednost'],
        additionalProperties: false,
      },
    },
  },
  required: ['opis', 'specPredlozi'],
  additionalProperties: false,
}

function izgradiUpit(z: Zahtev): string {
  const cinjenice: string[] = [
    `Brend: ${z.brend}`,
    `Model: ${z.model}`,
  ]
  if (z.nazivKategorije) cinjenice.push(`Kategorija: ${z.nazivKategorije}`)
  if (z.godiste) cinjenice.push(`Godište: ${z.godiste}`)
  if (z.stanje) cinjenice.push(`Stanje: ${stanjeLabela(z.stanje)} — ${stanjeDefinicija(z.stanje)}`)
  if (z.akuSistem) cinjenice.push(`Akumulatorski sistem: ${z.akuSistem}`)

  const popunjeneSpec = z.specifikacije.filter((s) => s.naziv.trim() && s.vrednost.trim())
  if (popunjeneSpec.length > 0) {
    cinjenice.push('Specifikacije koje je prodavac već uneo: ' + popunjeneSpec.map((s) => `${s.naziv}: ${s.vrednost}`).join(', '))
  }

  const prazneSpec = z.specifikacije.filter((s) => s.naziv.trim() && !s.vrednost.trim())
  if (prazneSpec.length > 0) {
    cinjenice.push('Specifikacije bez vrednosti (predloži vrednost samo ako si SIGURAN, inače ostavi prazno): ' + prazneSpec.map((s) => s.naziv).join(', '))
  }

  if (z.uPakovanju.length > 0) cinjenice.push(`U pakovanju: ${z.uPakovanju.join(', ')}`)
  if (z.beleska?.trim()) cinjenice.push(`Beleška prodavca (uklopi je prirodno u opis, ne izmišljaj dalje): "${z.beleska.trim()}"`)

  return `Napiši opis oglasa za polovnu alatku na sajtu za prodaju polovnog alata, na osnovu ovih podataka:

${cinjenice.map((c) => `- ${c}`).join('\n')}

Piši u prvom licu, kao prodavac. Ton je iskren i konkretan, ne reklamni. Ako beleška prodavca postoji, to je jedini izvor bilo kakve priče o korišćenju — ne dodaji sopstvene detalje o tome koliko je mašina korišćena, zašto se prodaje, ili u kom stanju je bila ako to nije eksplicitno dato.

Za predloge specifikacija: nemoj nagađati brojeve iz deklaracije (snaga, težina, kapacitet...) osim ako je ${z.brend} ${z.model} dovoljno poznat model da si stvarno siguran u tačnu vrednost. Kad nisi siguran, vrati prazan string za tu stavku — pogrešan broj je gori od praznog polja.`
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY nije podešen na serveru — AI generisanje opisa nije dostupno.' },
      { status: 503 }
    )
  }

  const body = (await req.json().catch(() => null)) as Zahtev | null
  if (!body?.brend?.trim() || !body?.model?.trim()) {
    return NextResponse.json({ error: 'Brend i model su obavezni.' }, { status: 400 })
  }

  try {
    const response = await anthropic.messages.create({
      model: 'claude-opus-5',
      max_tokens: 2000,
      output_config: { format: { type: 'json_schema', schema: OPIS_SCHEMA } },
      messages: [{ role: 'user', content: izgradiUpit(body) }],
    })

    if (response.stop_reason === 'refusal') {
      return NextResponse.json({ error: 'AI nije mogao da generiše odgovor za ovaj zahtev.' }, { status: 422 })
    }

    const tekst = response.content.find((b): b is Anthropic.TextBlock => b.type === 'text')
    if (!tekst) {
      return NextResponse.json({ error: 'Prazan odgovor od AI.' }, { status: 502 })
    }

    const parsed = JSON.parse(tekst.text) as { opis: string; specPredlozi: SpecRed[] }
    // Never surface a suggestion the model itself declined to make.
    parsed.specPredlozi = parsed.specPredlozi.filter((s) => s.vrednost.trim())
    return NextResponse.json(parsed)
  } catch (e) {
    console.error('[opis/generisi]', e)
    return NextResponse.json({ error: 'Greška pri generisanju opisa.' }, { status: 500 })
  }
}
