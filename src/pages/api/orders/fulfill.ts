import { wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  async handler({ req, params: { username } }) {
    const { id } = JSON.parse(req.body);
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
