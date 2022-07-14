import { UserInfo } from '@prisma/client';

import { wrapWithAuth } from '../../../api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth([], async (req, res, { username }) => {
  const data = JSON.parse(req.body) as Omit<UserInfo, 'username'>;
  await prisma.userInfo.create({
    data: {
      ...data,
      username,
    },
  });

  return { result: 'success' };
});
