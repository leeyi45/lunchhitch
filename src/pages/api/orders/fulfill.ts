import { wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  params: ['id'],
  handlers: {
    async POST({ params: { id, username } }) {
      const order = await prisma.order.update({
        where: {
          id,
        },
        data: {
          fulfillerId: username,
        },
      });

      return { result: 'success', value: order };
    },
  },
});
