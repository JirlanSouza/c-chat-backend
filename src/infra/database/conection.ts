import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function connect(): Promise<void> {
  await prisma.$connect();
  console.info("Db connection started!");
}

async function disconnect(): Promise<void> {
  await prisma.$disconnect();
}

export const Db = {
  connect,
  disconnect,
};
