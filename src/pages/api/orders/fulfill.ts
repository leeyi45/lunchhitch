import { wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  async handler({ data: { id }, params: { username } }) {
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
});
