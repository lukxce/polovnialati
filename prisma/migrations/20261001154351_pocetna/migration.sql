-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "naziv" TEXT NOT NULL,
    "tip" TEXT NOT NULL,
    "grad" TEXT NOT NULL,
    "telefon" TEXT,
    "pib" TEXT,
    "opis" TEXT,
    "uloga" TEXT NOT NULL DEFAULT 'PRODAVAC',
    "verifikovan" BOOLEAN NOT NULL DEFAULT false,
    "blokiran" BOOLEAN NOT NULL DEFAULT false,
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oglas" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "naslov" TEXT NOT NULL,
    "kategorija" TEXT NOT NULL,
    "brend" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "stanje" TEXT NOT NULL,
    "cena" INTEGER NOT NULL,
    "cenaDogovor" BOOLEAN NOT NULL DEFAULT false,
    "staraCena" INTEGER,
    "opis" TEXT NOT NULL,
    "slike" TEXT[],
    "specifikacije" JSONB NOT NULL DEFAULT '[]',
    "uPakovanju" TEXT[],
    "stanjeChecklist" JSONB NOT NULL DEFAULT '[]',
    "godiste" INTEGER,
    "satiRada" INTEGER,
    "garancija" INTEGER,
    "akuSistem" TEXT,
    "lokacija" TEXT NOT NULL,
    "dostava" TEXT[],
    "pregleda" INTEGER NOT NULL DEFAULT 0,
    "aktivan" BOOLEAN NOT NULL DEFAULT true,
    "provereno" BOOLEAN NOT NULL DEFAULT false,
    "istaknuto" BOOLEAN NOT NULL DEFAULT false,
    "demo" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Oglas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Razgovor" (
    "id" TEXT NOT NULL,
    "oglasId" TEXT NOT NULL,
    "kupacId" TEXT NOT NULL,
    "prodavacId" TEXT NOT NULL,
    "procitanoKupac" TIMESTAMP(3),
    "procitanoProdavac" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Razgovor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Poruka" (
    "id" TEXT NOT NULL,
    "razgovorId" TEXT NOT NULL,
    "posiljalacId" TEXT NOT NULL,
    "tekst" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Poruka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prijava" (
    "id" TEXT NOT NULL,
    "oglasId" TEXT NOT NULL,
    "userId" TEXT,
    "razlog" TEXT NOT NULL,
    "tekst" TEXT,
    "resena" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Prijava_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KontaktPoruka" (
    "id" TEXT NOT NULL,
    "ime" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "tema" TEXT NOT NULL,
    "tekst" TEXT NOT NULL,
    "procitana" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "KontaktPoruka_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pokusaj" (
    "id" TEXT NOT NULL,
    "kljuc" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Pokusaj_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_slug_key" ON "User"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Oglas_slug_key" ON "Oglas"("slug");

-- CreateIndex
CREATE INDEX "Oglas_userId_idx" ON "Oglas"("userId");

-- CreateIndex
CREATE INDEX "Oglas_aktivan_createdAt_idx" ON "Oglas"("aktivan", "createdAt");

-- CreateIndex
CREATE INDEX "Razgovor_kupacId_idx" ON "Razgovor"("kupacId");

-- CreateIndex
CREATE INDEX "Razgovor_prodavacId_idx" ON "Razgovor"("prodavacId");

-- CreateIndex
CREATE UNIQUE INDEX "Razgovor_oglasId_kupacId_key" ON "Razgovor"("oglasId", "kupacId");

-- CreateIndex
CREATE INDEX "Poruka_razgovorId_idx" ON "Poruka"("razgovorId");

-- CreateIndex
CREATE INDEX "Prijava_resena_createdAt_idx" ON "Prijava"("resena", "createdAt");

-- CreateIndex
CREATE INDEX "Pokusaj_kljuc_createdAt_idx" ON "Pokusaj"("kljuc", "createdAt");

-- AddForeignKey
ALTER TABLE "Oglas" ADD CONSTRAINT "Oglas_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Razgovor" ADD CONSTRAINT "Razgovor_oglasId_fkey" FOREIGN KEY ("oglasId") REFERENCES "Oglas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Razgovor" ADD CONSTRAINT "Razgovor_kupacId_fkey" FOREIGN KEY ("kupacId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Razgovor" ADD CONSTRAINT "Razgovor_prodavacId_fkey" FOREIGN KEY ("prodavacId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poruka" ADD CONSTRAINT "Poruka_razgovorId_fkey" FOREIGN KEY ("razgovorId") REFERENCES "Razgovor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Poruka" ADD CONSTRAINT "Poruka_posiljalacId_fkey" FOREIGN KEY ("posiljalacId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prijava" ADD CONSTRAINT "Prijava_oglasId_fkey" FOREIGN KEY ("oglasId") REFERENCES "Oglas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Prijava" ADD CONSTRAINT "Prijava_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
