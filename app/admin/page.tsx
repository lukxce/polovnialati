import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { aktivnaSesija } from "@/lib/auth";
import { db } from "@/lib/db";
import { RAZLOZI_PRIJAVE } from "@/lib/prijave";
import { operaterPopunjen } from "@/lib/site";
import {
  interesPoOglasu,
  najtrazenijiOglasi,
  statistikaInteresa,
} from "@/lib/statistika";
import OdjaviDugme from "@/components/auth/OdjaviDugme";
import KontaktTabela from "@/components/admin/KontaktTabela";
import KorisniciTabela from "@/components/admin/KorisniciTabela";
import OglasiAdminTabela from "@/components/admin/OglasiAdminTabela";
import PrijaveTabela from "@/components/admin/PrijaveTabela";
import Statistika from "@/components/admin/Statistika";
import s from "@/components/nalog/nalog.module.css";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const sesija = await aktivnaSesija();
  if (!sesija) redirect("/prijava?odakle=/admin");
  if (sesija.uloga !== "ADMIN") redirect("/");

  const [
    korisnici,
    oglasi,
    prijave,
    kontakt,
    brojKorisnika,
    brojOglasa,
    statistika,
    najtrazeniji,
  ] = await Promise.all([
    db.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      select: {
        id: true,
        slug: true,
        naziv: true,
        email: true,
        tip: true,
        grad: true,
        telefon: true,
        pib: true,
        uloga: true,
        verifikovan: true,
        blokiran: true,
        createdAt: true,
        _count: { select: { oglasi: true } },
      },
    }),
    db.oglas.findMany({
      orderBy: { createdAt: "desc" },
      take: 300,
      select: {
        id: true,
        slug: true,
        naslov: true,
        cena: true,
        cenaDogovor: true,
        aktivan: true,
        provereno: true,
        istaknuto: true,
        pregleda: true,
        createdAt: true,
        user: { select: { naziv: true, email: true } },
        _count: {
          select: { prijave: { where: { resena: false } }, razgovori: true },
        },
      },
    }),
    db.prijava.findMany({
      where: { resena: false },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        oglas: { select: { naslov: true, slug: true, aktivan: true } },
        user: { select: { naziv: true, email: true } },
      },
    }),
    db.kontaktPoruka.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.user.count(),
    db.oglas.count(),
    statistikaInteresa(),
    najtrazenijiOglasi(),
  ]);
  const interes = await interesPoOglasu(oglasi.map((o) => o.id));

  const upozorenja: string[] = [];
  if (!operaterPopunjen()) {
    upozorenja.push(
      'Podaci o operateru sajta (naziv, adresa, PIB, matični broj, email) nisu uneti — podnožje, Kontakt, Uslovi i Privatnost prikazuju „[popuniti]". Unesi ih kao NEXT_PUBLIC_OPERATER_* promenljive na Vercel-u.',
    );
  }
  if (
    process.env.NODE_ENV === "production" &&
    !process.env.BLOB_READ_WRITE_TOKEN
  ) {
    upozorenja.push(
      "Vercel Blob nije povezan (BLOB_READ_WRITE_TOKEN) — otpremanje fotografija ne radi.",
    );
  }
  if (!process.env.NEXT_PUBLIC_SITE_URL) {
    upozorenja.push(
      "NEXT_PUBLIC_SITE_URL nije podešen — sitemap i deljenje linkova koriste privremenu adresu.",
    );
  }

  const neprocitanih = kontakt.filter((k) => !k.procitana).length;

  return (
    <div className={`container ${s.strana}`}>
      <div className={s.zaglavlje}>
        <div>
          <p className="micro">ADMIN</p>
          <h1 className={s.naslov}>Pregled</h1>
          <p className={s.lede}>
            {brojKorisnika} korisnika · {brojOglasa} oglasa · {prijave.length}{" "}
            otvorenih prijava · {neprocitanih} nepročitanih poruka
          </p>
        </div>
        <OdjaviDugme />
      </div>

      {upozorenja.length ? (
        <ul className={s.upozorenja}>
          {upozorenja.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      ) : null}

      <section className={s.sekcija}>
        <h2 className={s.sekcijaNaslov}>Interesovanje kupaca</h2>
        <Statistika {...statistika} najtrazeniji={najtrazeniji} />
      </section>

      <section className={s.sekcija}>
        <h2 className={s.sekcijaNaslov}>Prijave oglasa</h2>
        <PrijaveTabela
          prijave={prijave.map((p) => ({
            id: p.id,
            razlog: RAZLOZI_PRIJAVE[p.razlog] ?? p.razlog,
            tekst: p.tekst,
            createdAt: p.createdAt.toISOString(),
            prijavio: p.user ? `${p.user.naziv} (${p.user.email})` : null,
            oglasNaslov: p.oglas.naslov,
            oglasSlug: p.oglas.slug,
            oglasAktivan: p.oglas.aktivan,
          }))}
        />
      </section>

      <section className={s.sekcija}>
        <h2 className={s.sekcijaNaslov}>Poruke sa kontakt forme</h2>
        <KontaktTabela
          poruke={kontakt.map((k) => ({
            ...k,
            createdAt: k.createdAt.toISOString(),
          }))}
        />
      </section>

      <section className={s.sekcija}>
        <h2 className={s.sekcijaNaslov}>Oglasi</h2>
        <OglasiAdminTabela
          oglasi={oglasi.map((o) => ({
            id: o.id,
            slug: o.slug,
            naslov: o.naslov,
            cena: o.cena,
            cenaDogovor: o.cenaDogovor,
            aktivan: o.aktivan,
            provereno: o.provereno,
            istaknuto: o.istaknuto,
            createdAt: o.createdAt.toISOString(),
            prodavacNaziv: o.user.naziv,
            prodavacEmail: o.user.email,
            brojPrijava: o._count.prijave,
            pregleda: o.pregleda,
            klikovaPozovi: interes.get(o.id)?.telefon ?? 0,
            poziva: interes.get(o.id)?.poziv ?? 0,
            poruka: o._count.razgovori,
          }))}
        />
      </section>

      <section className={s.sekcija}>
        <h2 className={s.sekcijaNaslov}>Korisnici</h2>
        <KorisniciTabela
          korisnici={korisnici.map(({ _count, createdAt, ...k }) => ({
            ...k,
            brojOglasa: _count.oglasi,
            createdAt: createdAt.toISOString(),
          }))}
        />
      </section>
    </div>
  );
}
