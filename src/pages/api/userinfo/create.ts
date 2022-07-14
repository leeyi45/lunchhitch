import { UserInfo } from '@prisma/client';

import { wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  async handler({ req, params: { username } }) {
    const data = JSON.parse(req.body) as Omit<UserInfo, 'username'>;
    const user = await prisma.userInfo.create({
      data: {
        ...data,
        username,
      },
    });

    return { result: 'success', value: user };
  },
});
