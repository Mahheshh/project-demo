/*
  Warnings:

  - You are about to drop the column `hashes` on the `Version` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Version" DROP COLUMN "hashes";

-- CreateTable
CREATE TABLE "File" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "dataSource" TEXT NOT NULL,
    "versionId" INTEGER NOT NULL,

    CONSTRAINT "File_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "Version"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
