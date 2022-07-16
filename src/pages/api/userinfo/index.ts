import { prismaHandler, wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  handler: prismaHandler(({ params: { username } }) => prisma.userInfo.findFirst({
    where: {
      username,
    },
  })),
});
