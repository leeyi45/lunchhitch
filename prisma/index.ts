import { PrismaClient } from '@prisma/client';

let prismaClient: PrismaClient;

export default function getPrisma() {
  if (!prismaClient) prismaClient = new PrismaClient();
  return prismaClient;
}
