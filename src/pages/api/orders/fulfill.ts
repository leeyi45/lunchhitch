import { prismaHandler, wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  params: ['id'],
  handlers: {
    POST: prismaHandler(async ({ params: { id, username } }) => {
      const order = await prisma.order.findFirst({
        where: {
          id,
          fulfillerId: null,
        },
      });

      if (order) {
        // Protect against changing an already fulfilled order
        return prisma.order.update({
          where: {
            id,
          },
          data: {
            fulfillerId: username,
          },
        });
      }
      return null;
    }),
  },
});
