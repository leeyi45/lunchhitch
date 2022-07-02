import { wrapWithQuery } from '../../api_wrappers';
import prisma from '../../prisma';

type PrismaType = {
    [key: string]: any;
}

export default wrapWithQuery(
  ['collection', 'method'],
  async (req, { collection, method }) => (prisma as PrismaType)[collection][method](req.body),
  (error, res) => res.status(500).json({ error }),
);
