/**
 * Send a GET request to this API route to get orders\
 * Send the request with fulfilled=true query parameter to include/exclude orders that have
 * already been fulfilled
 */
import { wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  params: ['shopId', 'fulfilled'],
  async handler({ req, res, params: { username, shopId, fulfilled } }) {
    if (req.method !== 'GET') {
      res.status(405).end();
      return undefined as never;
    }

    const orders = await prisma.order.findMany({
      where: {
        shopId: shopId === '' ? undefined : shopId,
        fromId: req.query.userOnly !== undefined ? username : undefined,
        fulfillerId: !fulfilled ? undefined : {
          not: null,
        },
      },
      include: {
        shop: true,
        from: true,
        fulfiller: {
          select: {
            displayName: true,
            username: true,
          },
        },
      },
    });
    return { value: orders ?? [], result: 'success' };
  },
});
