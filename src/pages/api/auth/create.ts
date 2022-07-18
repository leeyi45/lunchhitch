import { prismaHandler, wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  handlers: {
    POST: prismaHandler(({ data, params: { username } }) => prisma.userInfo.create({
      data: {
        ...data,
        username,
      },
    })),
  },

});
