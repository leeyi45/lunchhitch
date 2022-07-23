const mockedFirebaseAdmin = {
  auth: () => ({
    verifyIdToken: (token: string) => Promise.resolve(token === 'test'),
  }),
};

jest.mock('firebase-admin', () => ({
  ...mockedFirebaseAdmin,
  apps: [mockedFirebaseAdmin],
}));