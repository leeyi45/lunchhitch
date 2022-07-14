import { sendPasswordResetEmail } from '@firebase/auth';

import { wrapWithAuth } from '../../../api_helpers/api_wrappers';
import { FIREBASE_AUTH } from '../../../firebase';
import prisma from '../../../prisma';

export default wrapWithAuth({
  async handler({ data: { email } }) {
    const result = await prisma.userInfo.findFirst({
      where: {
        email,
      },
    });

    if (result) await sendPasswordResetEmail(FIREBASE_AUTH, email);

    return { result: 'success', value: '' };
  },
});
