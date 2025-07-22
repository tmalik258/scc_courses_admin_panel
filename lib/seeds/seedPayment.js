// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

async function seedPayment() {
  try {
    const student = await prisma.profile.findUnique({
      where: { email: "alice.johnson@student.com", role: "STUDENT" },
    });

    if (!student) {
      throw new Error("Student not found with email alice.johnson@student.com");
    }

    const category = await prisma.category.findUnique({
      where: { name: "Data Science" },
    });

    if (!category) {
      throw new Error("Category not found with name Data Science");
    }

    const instructor = await prisma.profile.findUnique({
      where: { email: "john.doe@instructor.com", role: "INSTRUCTOR" },
    });

    if (!instructor) {
      throw new Error(
        "Instructor not found with email john.doe@instructor.com"
      );
    }

    const course = await prisma.course.create({
      data: {
        title: "Machine Learning with Python: From Basics to Deployment",
        price: 1350,
        category: {
          connect: { id: category.id },
        },
        instructor: {
          connect: { id: instructor.id },
        },
      },
    });

    const purchase = await prisma.purchase.create({
      data: {
        studentId: student.id,
        courseId: course.id,
      },
    });

    await prisma.invoice.create({
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

    console.log("Payment data inserted successfully");
  } catch (err) {
    console.error("❌ Error seeding data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

seedPayment();
