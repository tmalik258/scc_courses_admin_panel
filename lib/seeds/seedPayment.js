// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

async function seedPayment() {
  try {
    const student = await prisma.student.findUnique({
      where: { email: "alice.johnson@student.com" },
    });

    if (!student) {
      throw new Error("Student not found with email alice.johnson@student.com");
    }

    const course = await prisma.course.create({
      data: {
        title: "Machine Learning with Python: From Basics to Deployment",
        price: 1350,
      },
    });

    const purchase = await prisma.purchase.create({
      data: {
        studentId: student.id,
        courseId: course.id,
      },
    });

    const invoice = await prisma.invoice.create({
      data: {
        purchaseId: purchase.id,
        invoiceNumber: "INV-ML001",
        paymentDate: new Date(),
        paymentMethod: "Credit Card",
        totalAmount: 1350,
        status: "SUCCESS",
        category: "Data Science",
        courseName: course.title,
        studentName: student.fullName,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    console.log("Sample data inserted successfully:", {
      student,
      course,
      purchase,
      invoice,
    });
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedPayment();