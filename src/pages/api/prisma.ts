import { wrapWithQuery } from '../../api_wrappers';
import prisma from '../../prisma';

type PrismaType = {
    [key: string]: any;
}

export default wrapWithQuery(
  ['collection', 'method'],
  async (req, res, { collection, method }) => {
    console.log(req.body);
    return (prisma as PrismaType)[collection][method](req.body);
  }
);
