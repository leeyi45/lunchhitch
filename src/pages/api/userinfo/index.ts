import { wrapWithAuth } from '../../../api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth([], (req, res, { username }) => prisma.userInfo.findFirst({
  where: {
    username,
  },
}));
