-- CreateTable
CREATE TABLE "Interes" (
    "id" TEXT NOT NULL,
    "oglasId" TEXT NOT NULL,
    "tip" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Interes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Interes_createdAt_tip_idx" ON "Interes"("createdAt", "tip");

-- CreateIndex
CREATE INDEX "Interes_oglasId_tip_idx" ON "Interes"("oglasId", "tip");

-- AddForeignKey
ALTER TABLE "Interes" ADD CONSTRAINT "Interes_oglasId_fkey" FOREIGN KEY ("oglasId") REFERENCES "Oglas"("id") ON DELETE CASCADE ON UPDATE CASCADE;

