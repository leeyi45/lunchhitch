/**
 * API route for creating orders. Requires authentication.\
 * POST to the API route with the order data and the order will be created
 * under the currently logged in user.
 */
import { Order } from '@prisma/client';

import { wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth<any, Order>({
  async handler({ data: { orderInfo }, params: { username } }) {
    const order = await prisma.order.create({
      data: {
        ...orderInfo,
        fromId: username,
      },
    });
    return { result: 'success', value: order };
  },
});
