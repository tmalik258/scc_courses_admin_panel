/*
  Warnings:

  - You are about to drop the `enrollments` table. If the table is not empty, all the data it contains will be lost.

*/

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "enrollments_course_id_fkey";

-- DropForeignKey
ALTER TABLE "enrollments" DROP CONSTRAINT IF EXISTS "enrollments_student_id_fkey";

-- DropIndex
DROP INDEX IF EXISTS "enrollments_course_id_idx";

-- DropIndex
DROP INDEX IF EXISTS "enrollments_student_id_idx";

-- DropIndex
DROP INDEX IF EXISTS "enrollments_student_id_course_id_key";

-- DropTable
DROP TABLE IF EXISTS "enrollments";