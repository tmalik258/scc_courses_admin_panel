/*
  Warnings:

  - You are about to drop the column `order_index` on the `lessons` table. All the data in the column will be lost.
  - You are about to drop the column `order_index` on the `modules` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "lessons" DROP COLUMN "order_index";

-- AlterTable
ALTER TABLE "modules" DROP COLUMN "order_index";
