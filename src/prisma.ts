/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import {
  Community, Order, PrismaClient, Shop, UserInfo,
} from '@prisma/client';

import { KeysOfType } from './common';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

export default prisma;

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// type Collections = {
//   [K in keyof PrismaClient]: (PrismaClient[K] extends Function ? never : PrismaClient[K]);
// }[keyof PrismaClient];

type Collections = KeysOfType<PrismaClient, any>;

export const prismaFetch = (
  collection: Collections,
  method: string,
  args: any,
) => fetch(`/api/prisma?collection=${collection}&method=${method}`, {
  method: 'POST',
  body: JSON.stringify(args),
});

export type LunchHitchOrder = {
  from: UserInfo;
  shop: Shop;
} & Order;

export type LunchHitchCommunity = {
  shops: Shop[];
} & Community;
