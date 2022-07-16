/**
 * Send a GET request to this API route to get orders\
 * Send the request with fulfilled=true query parameter to include/exclude orders that have
 * already been fulfilled
 */
import { prismaHandler, wrapWithQuery } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithQuery({
  handler: prismaHandler(({ data }) => prisma.order.findMany({
    ...data,
    include: {
      fulfiller: true,
      from: true,
      shop: true,
    },
  })),
});
