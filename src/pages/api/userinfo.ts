import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { LunchHitchUser } from '../../auth';
import prisma from '../../prisma';

export default async function UserInfo(req: NextApiRequest, res: NextApiResponse) {
  const { username, method } = req.query;

  if (typeof username !== 'string') {
    res.status(400).json({ error: 'Expected string for username!' });
    return;
  }

  if (typeof method !== 'string') {
    res.status(400).json({ error: 'Expected string for method!' });
    return;
  }

  const session = await getSession();
  const user = session?.user as LunchHitchUser;

  if (!session || user.username !== username) {
    res.status(403).json({ error: `Not authenticated as ${username}!` });
    return;
  }

  try {
    const result = await (prisma.userInfo as any)[method](req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error });
  }
}