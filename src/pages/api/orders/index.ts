/**
 * Send a GET request to this API route to get orders made, excluding orders made
 * by the current user
 */
import { wrapWithAuth } from '../../../api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth([], async (req, res, { username }) => {
  if (req.method !== 'GET') {
    res.status(405).end();
    return undefined as never;
  }

  const orders = await prisma.order.findMany({
    where: {
      fromId: {
        not: username,
      },
    },
  });
  return { orders, result: 'success' };
});
