/**
 * Send a GET request to this API route to get orders
 */
import { wrapWithAuth } from '../../../api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth(['shopId'], async (req, res, { shopId }) => {
  if (req.method !== 'GET') {
    res.status(405).end();
    return undefined as never;
  }

  const orders = await prisma.order.findMany({
    where: {
      shopId,
    },
    include: {
      shop: true,
      from: true,
      fulfiller: true,
    },
  });
  return { orders, result: 'success' };
});
