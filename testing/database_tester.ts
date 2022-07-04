import { PrismaClient } from '@prisma/client';

async function main() {
  const prisma = new PrismaClient();
  const eusoff = await prisma.community.findFirst({
    where: {
      name: {
        contains: 'Eusoff',
      },
    },
    include: {
      shops: true,
    },
  });

  const ammans = await prisma.shop.create({
    data: {
      name: 'Amaans',
      communityId: eusoff!.id,
    },
  });

  const user = await prisma.userInfo.findFirst({
    where: {
      id: 'test',
    },
  });

  const order = await prisma.order.create({
    data: {
      from: user!.id,
      orders: ['item1', 'item2', 'item3'],
      shop: ammans.id,
    },
  });

  console.log(eusoff);
  console.log(user);
  console.log(order);
}

main();
