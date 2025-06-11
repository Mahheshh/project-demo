-- CreateTable
CREATE TABLE "Case" (
    "id" SERIAL NOT NULL,
    "caseTitle" TEXT NOT NULL,
    "attorney" TEXT NOT NULL,
    "defendant" TEXT NOT NULL,

    CONSTRAINT "Case_pkey" PRIMARY KEY ("id")
);
