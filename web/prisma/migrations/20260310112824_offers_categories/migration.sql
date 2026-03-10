-- CreateTable
CREATE TABLE "Unapproved" (
    "id" SERIAL NOT NULL,
    "offerId" TEXT NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Unapproved_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Affiliate_Offers" (
    "id" SERIAL NOT NULL,
    "affiliateId" TEXT NOT NULL,
    "offerId" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Affiliate_Offers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Unapproved" ADD CONSTRAINT "Unapproved_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Affiliate_Offers" ADD CONSTRAINT "Affiliate_Offers_offerId_fkey" FOREIGN KEY ("offerId") REFERENCES "Offer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Affiliate_Offers" ADD CONSTRAINT "Affiliate_Offers_affiliateId_fkey" FOREIGN KEY ("affiliateId") REFERENCES "Affiliate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
