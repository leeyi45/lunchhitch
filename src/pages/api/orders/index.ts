/**
 * Send a GET request to this API route to get orders\
 * Send the request with fulfilled=true query parameter to include/exclude orders that have
 * already been fulfilled
 */
import { wrapWithAuth } from '../../../api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth(['shopId', 'fulfilled'], async (req, res, { shopId, fulfilled }) => {
  if (req.method !== 'GET') {
    res.status(405).end();
    return undefined as never;
  }

  const orders = await prisma.order.findMany({
    where: {
      shopId,
      fulfillerId: !fulfilled ? undefined : {
        not: null,
      },
    },
    include: {
      shop: true,
      from: true,
      fulfiller: true,
    },
  });
  return { orders: orders ?? [], result: 'success' };
});
