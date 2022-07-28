export const FIREBASE_ADMIN = {
  auth: () => ({
    verifyIdToken: (token: string) => Promise.resolve(token === 'test'),
  }),
  apps: [null],
};
export const getSession = (token: string) => Promise.resolve(token !== 'authorized' ? null : 'TestUser');
