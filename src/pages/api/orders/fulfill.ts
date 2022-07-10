import { wrapWithAuth } from '../../../api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth([], async (req, res, { username }) => {
  const { id } = JSON.parse(req.body);
  console.log('order id is', id);
  await prisma.order.update({
    where: {
      id,
    },
    data: {
      fulfillerId: username,
    },
  });

  return { result: 'success' };
});
