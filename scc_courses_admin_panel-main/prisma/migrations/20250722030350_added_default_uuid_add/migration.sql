/*
  Warnings:

  - The primary key for the `paypal_customers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `paypal_customers` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `resources` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `resources` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "paypal_customers" DROP CONSTRAINT "paypal_customers_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "paypal_customers_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "profiles" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();

-- AlterTable
ALTER TABLE "resources" DROP CONSTRAINT "resources_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "resources_pkey" PRIMARY KEY ("id");
