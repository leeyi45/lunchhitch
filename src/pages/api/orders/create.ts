/**
 * API route for creating orders. Requires authentication.\
 * POST to the API route with the order data and the order will be created
 * under the currently logged in user.
 */
import { prismaHandler, wrapWithAuth } from '../../../api_helpers/api_wrappers';
import prisma from '../../../prisma';

export default wrapWithAuth({
  handler: prismaHandler(({ data, params: { username } }) => prisma.order.create({
    data: {
      ...data,
      fromId: username,
    },
  })),
});
