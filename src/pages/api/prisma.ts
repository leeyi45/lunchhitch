import { wrapWithQuery } from '../../api_wrappers';
import prisma from '../../prisma';

type PrismaType = {
    [key: string]: any;
}

export default wrapWithQuery(
  ['collection', 'method'],
  async (req, _res, { collection, method }) => {
    return (prisma as PrismaType)[collection][method](req.body);
    // console.log(req.body);
  },
);
