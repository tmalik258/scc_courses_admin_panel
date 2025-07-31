/*
  Warnings:
  - You are about to drop the `sections` table. If the table is not empty, all the data it contains will be lost.
  - All lessons will be deleted to avoid foreign key constraint issues
*/

-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT IF EXISTS "lessons_module_id_fkey";

-- DropForeignKey  
ALTER TABLE "sections" DROP CONSTRAINT IF EXISTS "sections_course_id_fkey";

-- Delete all lessons data first (since module_id references will be invalid)
DELETE FROM "lessons";

-- DropTable
DROP TABLE IF EXISTS "sections";

-- CreateTable
CREATE TABLE "modules" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "course_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "order_index" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "modules_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "modules" ADD CONSTRAINT "modules_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_module_id_fkey" FOREIGN KEY ("module_id") REFERENCES "modules"("id") ON DELETE CASCADE ON UPDATE CASCADE;