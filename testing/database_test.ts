import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const niqqis = await prisma.shop.findFirst({});

  const result = await prisma.order.findMany({
    where: {
      shopId: niqqis!.id,
      fulfillerId: {
        not: null,
      },
    },
  });

  result.map(console.log);
}

main().catch(console.error);
