/*
  Warnings:

  - You are about to drop the column `section_id` on the `lessons` table. All the data in the column will be lost.
  - Added the required column `module_id` to the `lessons` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_section_id_fkey";

-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "section_id",
ADD COLUMN     "module_id" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "sections"("id") ON DELETE CASCADE ON UPDATE CASCADE;
