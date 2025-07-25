/*
  Warnings:

  - You are about to drop the column `speciality` on the `Specialist` table. All the data in the column will be lost.
  - You are about to drop the column `subspecialities` on the `Specialist` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Specialist" DROP COLUMN "speciality",
DROP COLUMN "subspecialities";

-- CreateTable
CREATE TABLE "SpecialistSpeciality" (
    "specialistId" INTEGER NOT NULL,
    "specialityId" INTEGER NOT NULL,

    CONSTRAINT "SpecialistSpeciality_pkey" PRIMARY KEY ("specialistId","specialityId")
);

-- CreateTable
CREATE TABLE "SpecialistSubspeciality" (
    "specialistId" INTEGER NOT NULL,
    "subspecialityId" INTEGER NOT NULL,

    CONSTRAINT "SpecialistSubspeciality_pkey" PRIMARY KEY ("specialistId","subspecialityId")
);

-- CreateTable
CREATE TABLE "Speciality" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Speciality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subspeciality" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Subspeciality_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "SpecialistSpeciality_specialityId_idx" ON "SpecialistSpeciality"("specialityId");

-- CreateIndex
CREATE INDEX "SpecialistSubspeciality_subspecialityId_idx" ON "SpecialistSubspeciality"("subspecialityId");

-- CreateIndex
CREATE UNIQUE INDEX "Speciality_name_key" ON "Speciality"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Subspeciality_name_key" ON "Subspeciality"("name");

-- CreateIndex
CREATE INDEX "Specialist_category_is_active_idx" ON "Specialist"("category", "is_active");

-- AddForeignKey
ALTER TABLE "SpecialistSpeciality" ADD CONSTRAINT "SpecialistSpeciality_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialistSpeciality" ADD CONSTRAINT "SpecialistSpeciality_specialityId_fkey" FOREIGN KEY ("specialityId") REFERENCES "Speciality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialistSubspeciality" ADD CONSTRAINT "SpecialistSubspeciality_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialistSubspeciality" ADD CONSTRAINT "SpecialistSubspeciality_subspecialityId_fkey" FOREIGN KEY ("subspecialityId") REFERENCES "Subspeciality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
