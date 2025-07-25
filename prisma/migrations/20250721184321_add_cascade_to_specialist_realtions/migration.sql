-- DropForeignKey
ALTER TABLE "SpecialistSpeciality" DROP CONSTRAINT "SpecialistSpeciality_specialistId_fkey";

-- DropForeignKey
ALTER TABLE "SpecialistSubspeciality" DROP CONSTRAINT "SpecialistSubspeciality_specialistId_fkey";

-- AddForeignKey
ALTER TABLE "SpecialistSpeciality" ADD CONSTRAINT "SpecialistSpeciality_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialistSubspeciality" ADD CONSTRAINT "SpecialistSubspeciality_specialistId_fkey" FOREIGN KEY ("specialistId") REFERENCES "Specialist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
