/* eslint-disable class-methods-use-this */
// eslint-disable-next-line import/no-extraneous-dependencies
import NodeEnvironment from 'jest-environment-node';

export default class APIRouteEnvironment extends NodeEnvironment {
  public async setup() {
    jest.mock('../../../../firebase/admin', () => ({
      FIREBASE_ADMIN: {
        auth: () => ({
          verifyIdToken: (token: string) => Promise.resolve(token === 'test'),
        }),
        apps: [null],
      },
      getSession: (token: string) => Promise.resolve(token !== 'authorized' ? null : 'TestUser'),
    }));
  }

  public teardown() { return super.teardown(); }

  public getVmContext() { return super.getVmContext(); }
}
