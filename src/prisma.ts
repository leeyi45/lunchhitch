/* eslint-disable no-unused-vars */
/* eslint-disable no-var */
/* eslint-disable vars-on-top */
import {
  Community, Order, PrismaClient, Shop, UserInfo,
} from '@prisma/client';

// import { KeysOfType } from './common';

declare global {
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

export default prisma;

if (process.env.NODE_ENV !== 'production') global.prisma = prisma;

// type PrismaFuncs = KeysOfType<PrismaClient, Function>;
// type Collection = KeysOfType<Omit<PrismaClient, PrismaFuncs>>;
// type Method = KeysOfType<PrismaClient[Collection]>

export type LunchHitchOrder = {
  from: UserInfo;
  shop: Shop;
  fulfiller: UserInfo | null;
} & Order;

export type LunchHitchCommunity = {
  shops: Shop[];
} & Community;
