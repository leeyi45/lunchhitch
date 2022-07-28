/**
 * Send a POST request to this API route to get orders
 */
import { prismaHandler, wrapWithQuery } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export const ordersFilter = {
  include: {
    fulfiller: {
      select: {
        displayName: true,
        username: true,
      },
    },
    from: {
      select: {
        displayName: true,
        username: true,
      },
    },
    shop: {
      select: {
        name: true,
      },
    },
  },
};

export default wrapWithQuery({
  handlers: {
    POST: prismaHandler(({ data }) => prisma.order.findMany({
      ...data,
      ...ordersFilter,
    })),
  },
});
