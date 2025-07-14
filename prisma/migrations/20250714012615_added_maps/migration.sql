/*
  Warnings:

  - You are about to drop the `Attachment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PaypalCustomer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Purchase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Attachment" DROP CONSTRAINT "Attachment_course_id_fkey";

-- DropForeignKey
ALTER TABLE "PaypalCustomer" DROP CONSTRAINT "PaypalCustomer_student_id_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_course_id_fkey";

-- DropForeignKey
ALTER TABLE "Purchase" DROP CONSTRAINT "Purchase_student_id_fkey";

-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_purchase_id_fkey";

-- DropTable
DROP TABLE "Attachment";

-- DropTable
DROP TABLE "PaypalCustomer";

-- DropTable
DROP TABLE "Purchase";

-- CreateTable
CREATE TABLE "attachments" (
    "id" TEXT NOT NULL,
    "course_id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "purchases" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "student_id" UUID NOT NULL,
    "course_id" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "purchases_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paypal_customers" (
    "id" TEXT NOT NULL,
    "student_id" UUID NOT NULL,
    "paypalCustomerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paypal_customers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "attachments_course_id_idx" ON "attachments"("course_id");

-- CreateIndex
CREATE INDEX "purchases_course_id_idx" ON "purchases"("course_id");

-- CreateIndex
CREATE UNIQUE INDEX "purchases_student_id_course_id_key" ON "purchases"("student_id", "course_id");

-- CreateIndex
CREATE UNIQUE INDEX "paypal_customers_student_id_key" ON "paypal_customers"("student_id");

-- CreateIndex
CREATE UNIQUE INDEX "paypal_customers_paypalCustomerId_key" ON "paypal_customers"("paypalCustomerId");

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "purchases" ADD CONSTRAINT "purchases_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices" ADD CONSTRAINT "invoices_purchase_id_fkey" FOREIGN KEY ("purchase_id") REFERENCES "purchases"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "paypal_customers" ADD CONSTRAINT "paypal_customers_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;
