"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_1 = require("./generated/prisma");
var extension_accelerate_1 = require("@prisma/extension-accelerate");
// Extend the client type inline
var prismaClient = new prisma_1.PrismaClient().$extends((0, extension_accelerate_1.withAccelerate)());
var globalForPrisma = globalThis;
// Only create new client in dev to avoid hot-reload issues
var prisma = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : prismaClient;
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}
exports.default = prisma;
