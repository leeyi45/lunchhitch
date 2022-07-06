/** API route for managing orders */
import { Order } from '@prisma/client';

import { wrapWithAuth } from '../../../api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth([], async (req, _res, { username }) => {
  const orderInfo = JSON.parse(req.body) as Order;
  await prisma.order.create({
    data: {
      ...orderInfo,
      fromId: username,
    },
  });
});
