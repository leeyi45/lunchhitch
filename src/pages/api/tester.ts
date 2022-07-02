import { NextApiRequest, NextApiResponse } from 'next';
import { wrapWithAuth } from '../../api_wrappers';
import { getSession } from '../../firebase/admin';

export default wrapWithAuth([], async (req: NextApiRequest, res: NextApiResponse) => {
  const user = await getSession(req.cookies.token);
  return {
    username: user,
  };
});
