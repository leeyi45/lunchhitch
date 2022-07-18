import { wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  params: ['id'],
  handlers: {
    async POST({ params: { id, username } }) {
      const order = await prisma.order.findFirst({
        where: {
          id,
          fulfillerId: username,
        },
      });

      if (!order) return { result: 'error', value: 'This order was not fulfilled by the given user' };
      else {
        await prisma.order.update({
          where: {
            id,
          },
          data: {
            fulfillerId: null,
          },
        });
        return { result: 'success', value: 'Success' };
      }
    },
  },
});
