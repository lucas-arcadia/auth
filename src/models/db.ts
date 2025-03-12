import { PrismaClient } from "@prisma/client";
// import { readReplicas } from "@prisma/extension-read-replicas";

const globalForPrisma = global as unknown as { prisma: PrismaClient; prismaRead: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    errorFormat: "pretty",
    // log: ["query", "info", "warn", "error"],
    log: ["info", "warn", "error"],
  })
  
  export const prismaRead =
    globalForPrisma.prismaRead ||
    new PrismaClient({
      errorFormat: "pretty",
      log: ["info", "warn", "error"],
      // datasources: {
      //   db: {
      //     url: process.env.REPLICA_DATABASE_URL!,
      //   }
      // }
    })
  // .$extends(
  //   readReplicas({
  //     url: process.env.REPLICA_DATABASE_URL!,
  //   })
  // );

globalForPrisma.prisma = prisma;
globalForPrisma.prismaRead = prismaRead;
