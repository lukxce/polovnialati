import type { Metadata } from 'next'
import Link from 'next/link'
import Breadcrumbs from '@/components/Breadcrumbs'
import { Ikona } from '@/components/Ikone'
import s from '@/components/staticne/Stranica.module.css'

export const metadata: Metadata = {
  title: 'Privatnost',
  description:
    'Alatnica ne prikuplja lične podatke, nema naloge, nema analitiku i nema kolačiće za praćenje. Jedino što se čuva je lista sačuvanih oglasa, i to u tvom pregledaču.',
  alternates: { canonical: '/privatnost' },
}

export default function PrivatnostStranica() {
  return (
    <div className={`container ${s.strana}`}>
      <Breadcrumbs
        stavke={[{ naziv: 'Početna', href: '/' }, { naziv: 'Privatnost' }]}
        className={s.mrvice}
      />

      <header className={s.uvod}>
        <p className="micro">Podaci</p>
        <h1 className={s.naslov}>Privatnost</h1>
        <p className={s.lede}>
          Najkraća moguća verzija: ovaj sajt o tebi ne zna ništa i ne pokušava da sazna. Nema naloga,
          nema analitike, nema kolačića za praćenje i nema servera koji prima tvoje podatke.
        </p>
      </header>

      <div className={s.napomena}>
        <span className={s.napomenaIkona}>
          <Ikona ime="stit" velicina={16} />
        </span>
        <p>
          <strong className={s.napomenaNaslov}>Ovo nije standardni tekst o privatnosti.</strong>
          Alatnica je demonstracioni projekat bez naloga i bez baze korisnika, pa bi prepisivanje
          uobičajenih odredaba o „rukovaocu podataka" i „legitimnom interesu" ovde bilo samo
          zavaravanje. Ispod piše tačno šta se dešava, i ništa više od toga.
        </p>
      </div>

      <div className={s.proza}>
        <section aria-labelledby="ne-prikuplja">
          <h2 id="ne-prikuplja" className={`${s.h2} ${s.h2Prvi}`}>
            Šta se ne prikuplja
          </h2>
          <ul className={s.lista}>
            <li>Nema naloga, pa nema imena, imejla ni lozinke.</li>
            <li>Nema analitike: ni Google Analytics, ni bilo koji drugi merni servis.</li>
            <li>Nema piksela društvenih mreža i nema reklamnih mreža.</li>
            <li>Nema kolačića za praćenje. Zato nema ni onog dosadnog prozora za saglasnost.</li>
            <li>Nema slanja podataka trećim stranama, jer nema podataka koji bi se poslali.</li>
          </ul>
        </section>

        <section aria-labelledby="pregledac">
          <h2 id="pregledac" className={s.h2}>
            Šta ostaje u tvom pregledaču
          </h2>
          <p className={s.p}>
            Jedna jedina stvar: lista oglasa koje si sačuvao klikom na srce. Ona se upisuje u
            lokalno skladište tvog pregledača, pod ključem <code>alatnica:sacuvano</code>, i sadrži
            samo adrese oglasa, na primer <code>makita-hr2470-rotaciona-busilica</code>.
          </p>
          <p className={s.p}>
            Ta lista nikada ne napušta tvoj uređaj. Ne šalje se nigde, ne vidi je niko osim tebe, i
            nestaje čim obrišeš podatke sajta u podešavanjima pregledača ili klikneš na srce da
            skloniš oglas. Ako otvoriš sajt na drugom uređaju, tamo je prazno. Nema naloga koji bi
            ih povezao.
          </p>
          <p className={s.p}>
            Stranica <Link href="/sacuvano">sačuvani oglasi</Link> samo čita tu listu i prikazuje
            odgovarajuće oglase.
          </p>
        </section>

        <section aria-labelledby="obrasci">
          <h2 id="obrasci" className={s.h2}>
            Obrasci na sajtu
          </h2>
          <p className={s.p}>
            Obrazac na stranici <Link href="/kontakt">kontakt</Link> i ceo tok za{' '}
            <Link href="/prodaj">postavljanje oglasa</Link> proveravaju unos, ali ništa ne šalju.
            Ono što upišeš postoji samo u memoriji stranice i nestaje kada je zatvoriš ili
            osvežiš.
          </p>
          <p className={s.p}>
            Fotografije koje eventualno prevučeš u tok za prodaju ne odlaze nigde. Prikazuju se
            preko privremene adrese koju pravi sam pregledač i brišu se zajedno sa stranicom.
          </p>
        </section>

        <section aria-labelledby="tehnicko">
          <h2 id="tehnicko" className={s.h2}>
            Tehnička strana
          </h2>
          <p className={s.p}>
            Sajt je statičan. Fontovi Bricolage Grotesque i Schibsted Grotesk se isporučuju sa
            istog servera kao i sajt, a ne sa Google-ovih servera, pa se tvoja IP adresa ne šalje
            nikome trećem prilikom učitavanja stranice.
          </p>
          <p className={s.p}>
            Serveru na kome sajt stoji, kao i svakom veb serveru, ostaju standardni zapisi o
            pristupu: IP adresa, vreme i tražena adresa. To je tehnički minimum bez kog internet ne
            radi, i ti zapisi se ne koriste ni za kakvo profilisanje.
          </p>
        </section>

        <section aria-labelledby="prava">
          <h2 id="prava" className={s.h2}>
            Tvoja prava
          </h2>
          <p className={s.p}>
            Prava na uvid, ispravku i brisanje podataka imaju smisla kada neko čuva tvoje podatke.
            Ovde ih niko ne čuva, pa se pravo na brisanje ostvaruje jednim klikom u podešavanjima
            tvog pregledača: brisanjem lokalnog skladišta za ovaj sajt.
          </p>
          <p className={s.p}>
            Ako Alatnica ikada postane pravi servis sa nalozima i porukama, ovaj tekst bi morao da
            se napiše iznova, sa stvarnim rukovaocem podataka, pravnim osnovom obrade i rokovima
            čuvanja. Do tada, ovo je iskren opis stanja.
          </p>
        </section>
      </div>

      <p className={s.datum}>Poslednja izmena: 20. avgust 2026.</p>
    </div>
  )
}
