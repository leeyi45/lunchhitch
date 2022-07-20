import type { Community, Order, Shop } from '@prisma/client';

export type SessionUser = {
  username: string;
  displayName: string;
}

export type LunchHitchOrder = {
  from: SessionUser;
  fulfiller: SessionUser | null;
  shop: {
    name: string;
  }
} & Order;

export type LunchHitchCommunity = {
  shops: Shop[];
} & Community;
