/*
  Warnings:

  - You are about to drop the `attachments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_course_id_fkey";

-- DropTable
DROP TABLE "attachments";

-- CreateTable
CREATE TABLE "resources" (
    "id" TEXT NOT NULL,
    "course_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "resources_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "resources_course_id_idx" ON "resources"("course_id");

-- AddForeignKey
ALTER TABLE "resources" ADD CONSTRAINT "resources_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
