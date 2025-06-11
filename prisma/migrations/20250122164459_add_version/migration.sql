-- CreateTable
CREATE TABLE "Version" (
    "id" SERIAL NOT NULL,
    "versionNo" INTEGER NOT NULL,
    "hashes" TEXT[],
    "caseId" INTEGER NOT NULL,

    CONSTRAINT "Version_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Version" ADD CONSTRAINT "Version_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "Case"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
