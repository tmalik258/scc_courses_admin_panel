import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seed() {
  try {
    // Create a student
    const student = await prisma.student.create({
      data: {
        fullName: "Ahmad Husain",
        email: "ahmad.husain@example.com",
      },
    });

    // Create a course
    const course = await prisma.course.create({
      data: {
        title: "Machine Learning with Python: From Basics to Deployment",
        price: 1350,
      },
    });

    // Create a purchase
    const purchase = await prisma.purchase.create({
      data: {
        studentId: student.id,
        courseId: course.id,
      },
    });

    // Create an invoice
    const invoice = await prisma.invoice.create({
      data: {
        purchaseId: purchase.id,
        invoiceNumber: "INV-001",
        paymentDate: new Date("2025-03-15T12:50:00Z"),
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

    console.log("Sample data inserted successfully:");
    console.log("Student:", student);
    console.log("Course:", course);
    console.log("Purchase:", purchase);
    console.log("Invoice:", invoice);
  } catch (err) {
    console.error("Error seeding data:", err);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
seed();
