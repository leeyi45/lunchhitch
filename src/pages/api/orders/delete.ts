import { wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  params: ['id'],
  async handler({ params: { id, username } }) {
    const order = await prisma.order.findFirst({
      where: {
        id,
        fromId: username,
      },
    });

    if (!order) return { result: 'error', value: 'This order was not made by the given user' };
    else {
      await prisma.order.delete({
        where: {
          id,
        },
      });
      return { result: 'success', value: 'Success' };
    }
  },
});
