import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const eusoff = await prisma.community.findFirst({
    include: {
      shops: true,
    },
  });
  console.log(eusoff);
}

main().catch(console.error);
