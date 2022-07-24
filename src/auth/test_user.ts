import type { LunchHitchUser } from './types';

/**
 * A set of credentials that can be used for testing without signing in
 */
const testUser: LunchHitchUser = {
  email: 'test@test.com',
  displayName: 'Test Man',
  username: 'TestUser',
  phoneNumber: '93748362',
};

export default testUser;
