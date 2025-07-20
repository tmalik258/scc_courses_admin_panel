import { PrismaClient as GeneratedPrismaClient } from "./generated/prisma";
import { withAccelerate } from "@prisma/extension-accelerate";

// Extend the client type inline
const prismaClient = new GeneratedPrismaClient().$extends(withAccelerate());

const globalForPrisma = globalThis as unknown as {
  prisma: typeof prismaClient;
};

// Only create new client in dev to avoid hot-reload issues
const prisma = globalForPrisma.prisma ?? prismaClient;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
