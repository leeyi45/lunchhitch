import * as firebaseAuth from '@firebase/auth';

import { prismaMock } from '../../testing/singleton';
import testUser from '../test_user';
import { signUp } from '..';

describe('Testing signup', () => {
  test('normal function', async () => {
    const createUser = jest.spyOn(firebaseAuth, 'createUserWithEmailAndPassword').mockImplementation((auth, email, password) => Promise.resolve({
      user: {
        ...testUser,
        emailVerified: false,
        isAnonymous: false,
        metadata: null,
        providerData: null,
        refreshToken: () => {},
        tenantId: '',
        delete: () => {},
        getIdToken: () => Promise.resolve(''),
        getIdTokenResult: () => Promise.resolve(''),
      },
      providerId: 'firebase',
      operationType: 'signIn',
    }));

    await signUp({
      ...testUser,
      password: '1234@abcd',
    });

    expect(createUser).toBeCalledTimes(1);
  });
});
