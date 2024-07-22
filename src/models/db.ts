import { PrismaClient } from "@prisma/client";
import { readReplicas } from "@prisma/extension-read-replicas";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    errorFormat: "pretty",
    // log: ["query", "info", "warn", "error"],
    log: ["info", "warn", "error"],
  }).$extends(
    readReplicas({
      url: process.env.DATABASE_URL_REPLICA!,
    })
  );

globalForPrisma.prisma = prisma;
