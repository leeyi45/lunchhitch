import { DateTime } from 'luxon';

import { asApiError, asApiSuccess } from '../../api_helpers';
import { wrapWithAuth } from '../../api_helpers/api_wrappers';
import prisma from '../../prisma';

export default wrapWithAuth({
  params: ['shopName'],
  handlers: {
    POST: async ({ data: { desc }, params: { shopName, username } }) => {
      const recent = await prisma.suggestion.findFirst({
        where: {
          madeById: username,
        },
        orderBy: {
          createdTime: 'desc',
        },
      });

      if (recent) {
        const timeDelta = DateTime.fromISO(recent.createdTime as unknown as string).diffNow();
        if (timeDelta.as('weeks') < 1) return asApiError('Max 1 suggestion per week!');
      }

      const past = await prisma.suggestion.findFirst({
        where: {
          madeById: username,
          suggestion: {
            equals: shopName,
            mode: 'insensitive',
          },
        },
      });

      if (past) return asApiSuccess('Suggestion already made');

      await prisma.suggestion.create({
        data: {
          madeById: username,
          suggestion: shopName,
          description: desc,
          createdTime: new Date(),
        },
      });

      return asApiSuccess('Suggestion stored');
    },
  },
});
