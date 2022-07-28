import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

import testUser from '../test_user';
import { signIn, signUp } from '..';

jest.mock('firebase/app');

jest.mock('firebase/auth', () => ({
  __esModule: true,
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));

describe('Testing signup', () => {
  test('normal function', async () => {
    await signUp({
      ...testUser,
      password: '1234@abcd',
    });

    expect(createUserWithEmailAndPassword).toBeCalledTimes(1);
    expect(updateProfile).toBeCalledTimes(1);
  });
});

describe('Testing signIn', () => {
  test('incorrect password', () => {
    const task = signIn({
      username: testUser.username,
      password: 'random',
    });

    return expect(task).toThrow();
  });
});
