import { PrismaClient as GeneratedPrismaClient } from "./generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

// Set max listeners to avoid warnings
process.setMaxListeners(20);

// Extend the client type inline
const prismaClient = new GeneratedPrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
}).$extends(withAccelerate());

const globalForPrisma = globalThis as unknown as {
  prisma: typeof prismaClient;
};

// Only create new client in dev to avoid hot-reload issues
const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
// Graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
