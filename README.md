# Alatnica

Oglasnik za nov i polovan alat (Next.js 16 · Prisma · Postgres · Vercel Blob).
Pre bilo kakve izmene pročitaj `SPEC.md`, `DESIGN.md` i `AGENTS.md`.

## Lokalni razvoj

```bash
npm install
npm run db:lokalno          # lokalni Postgres (Prisma Dev), bez Dockera
cp .env.example .env        # upiši SESSION_SECRET; adrese baze su već za lokalni server
npx prisma migrate deploy   # napravi tabele
npm run db:admin            # prvi admin (SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD iz .env)
npm run db:demo             # opciono: ~75 demo oglasa za razvoj (samo lokalna baza)
npm run dev -- -p 3102
```

`npm run db:demo:obrisi` briše demo podatke. Demo nalozi ne mogu da se prijave.

Promena šeme: izmeni `prisma/schema.prisma`, pa `npm run db:migracija -- --name opis`.

## Kako su podaci organizovani

- Taksonomija (kategorije, brendovi) je u kodu: `data/kategorije.ts`, `data/brendovi.ts`, `lib/taksonomija.ts`.
- Oglasi, nalozi, poruke, prijave i kontakt poruke su u bazi.
- Javne stranice čitaju bazu kroz `lib/queries.ts`, keširano (Next data cache, tag `katalog`).
  Svaka izmena kroz aplikaciju zove `osveziKatalog()` i keš se odmah osvežava;
  izmene direktno u bazi se vide najkasnije za 10 minuta.
- Fotografije: pregledač ih smanji (2000 px, JPEG), `/api/slike` ih upiše u Vercel Blob,
  u bazi stoji samo URL.

## Deploy (Vercel)

1. Novi projekat iz GitHub repoa (framework: Next.js, ostalo podrazumevano).
2. Storage → **Neon** (Postgres), region Frankfurt → poveži sa projektom.
   Upisuje `DATABASE_URL` i `DATABASE_URL_UNPOOLED`.
3. Storage → **Blob** → poveži sa projektom. Upisuje `BLOB_READ_WRITE_TOKEN`.
4. Settings → Environment Variables: `SESSION_SECRET`, `NEXT_PUBLIC_SITE_URL` i
   `NEXT_PUBLIC_OPERATER_*` / `NEXT_PUBLIC_KONTAKT_EMAIL` (vidi `.env.example`).
5. Deploy. Build sam pokreće `prisma migrate deploy`.
6. Prvi admin, jednom, sa svog računara (adresu baze uzmi iz Vercel → Storage → Neon):
   ```bash
   DATABASE_URL='…' SEED_ADMIN_EMAIL='ti@domen.rs' SEED_ADMIN_PASSWORD='…' npm run db:admin
   ```
7. Domen: Settings → Domains → dodaj domen, pa podesi DNS kod registra kako Vercel kaže.

Zaboravljene lozinke za sada idu ručno: korisnik piše preko /kontakt, admin u /admin
klikne „Nova lozinka" i javi mu privremenu.
