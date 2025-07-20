// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const webDev = await prisma.category.upsert({
    where: { name: "Web Development" },
    update: {},
    create: {
      name: "Web Development",
      color: "blue",
    },
  });

  // Seed instructors
  const john = await prisma.profile.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      email: "john@example.com",
      fullName: "John Doe",
      role: "INSTRUCTOR",
      isActive: true,
    },
  });

  const jane = await prisma.profile.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      email: "jane@example.com",
      fullName: "Jane Smith",
      role: "INSTRUCTOR",
      isActive: true,
    },
  });

  // Seed courses
  const reactCourse = await prisma.course.upsert({
    where: { title: "React Masterclass" },
    update: {},
    create: {
      title: "React Masterclass",
      price: 1999,
      isPublished: true,
      instructorId: john.id,
      categoryId: webDev.id,
    },
  });

  const nextCourse = await prisma.course.upsert({
    where: { title: "Next.js Complete Guide" },
    update: {},
    create: {
      title: "Next.js Complete Guide",
      price: 2499,
      isPublished: true,
      instructorId: jane.id,
      categoryId: webDev.id,
    },
  });

  // Simulate purchases (sales)
  await prisma.purchase.createMany({
    data: [
      { courseId: reactCourse.id, userId: "user-1" },
      { courseId: reactCourse.id, userId: "user-2" },
      { courseId: reactCourse.id, userId: "user-3" },
      { courseId: nextCourse.id, userId: "user-4" },
      { courseId: nextCourse.id, userId: "user-5" },
    ],
    skipDuplicates: true,
  });

  console.log("✅ Seed data created!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
