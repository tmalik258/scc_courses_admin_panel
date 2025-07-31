// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

async function seedCategories() {
  try {
    await prisma.category.createMany({
      data: [
        {
          name: "Web Development",
          slug: "web-development",
          description: "Learn to build modern web applications",
          icon: "fa-code",
          color: "#2563eb",
          isActive: true,
        },
        {
          name: "Mobile Development",
          slug: "mobile-development",
          description: "Create apps for iOS and Android",
          icon: "fa-mobile",
          color: "#059669",
          isActive: true,
        },
        {
          name: "Data Science",
          slug: "data-science",
          description: "Analyze and visualize data effectively",
          icon: "fa-chart-line",
          color: "#dc2626",
          isActive: true,
        },
        {
          name: "Artificial Intelligence",
          slug: "artificial-intelligence",
          description: "Explore machine learning and AI",
          icon: "fa-brain",
          color: "#7c3aed",
          isActive: true,
        },
        {
          name: "Cloud Computing",
          slug: "cloud-computing",
          description: "Master cloud technologies and services",
          icon: "fa-cloud",
          color: "#f59e0b",
          isActive: true,
        },
      ],
      skipDuplicates: true,
    });

    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seedCategories();