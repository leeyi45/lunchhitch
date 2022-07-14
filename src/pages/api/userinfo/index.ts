import { wrapWithAuth } from '../../../api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  handler: async ({ params: { username } }) => ({
    result: 'success',
    value: await prisma.userInfo.findFirst({
      where: {
        username,
      },
    }),
  }),
});
