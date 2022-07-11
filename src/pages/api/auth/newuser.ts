import { wrapWithAuth } from '../../../api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth([], async (req, res, { username }) => {
  await prisma.userInfo.create({
    data: JSON.parse(req),
  });
});
