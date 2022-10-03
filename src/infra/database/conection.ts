import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class Db {
  static async connect() {
    await prisma.$connect();
    console.info("Db connection started!");
  }

  static async disconnect() {
    await prisma.$disconnect();
  }
}
