import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { LunchHitchUser } from '../../auth';
import prisma from '../../prisma';

type QueryType = {
  username: string;
  method: 'get' | 'update';
};

export default async function UserInfo(req: NextApiRequest, res: NextApiResponse) {
  const { username, method } = req.query as QueryType;

  if (typeof username !== 'string') {
    res.status(400).json({ error: 'Expected only one user to be given' });
    return;
  }

  const session = await getSession();

  if (!session) {
    res.status(401);
    return;
  }

  const user = session.user as LunchHitchUser;
  if (user.username !== username) {
    res.status(401);
    return;
  }

  if (method === 'update') {
    await prisma.userInfo.update({
      where: {
        id: username,
      },
      data: req.body,
    });

    res.status(200).json({});
  }

  try {
    const userInfo = await prisma.userInfo.findFirst({
      where: {
        id: username as string,
      },
    });

    res.status(200).json(userInfo);
  } catch (error) {
    res.status(500).json({ error });
  }
}
