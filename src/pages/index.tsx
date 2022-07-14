import React from 'react';

import { LunchHitchUser } from '../auth';
import AuthSelector from '../common/auth_selector';
import Navbar from '../common/components/navbar';

import NoUserHomePage from './profile/noUser';
import UserHomePage from './profile/user';

export default function IndexPage() {
  return (
    <AuthSelector
      unauthenticated={(
        <>
          <Navbar user={null} />
          <NoUserHomePage />
        </>
      )}
    >
      {(user) => (
        <>
          <Navbar user={user as LunchHitchUser} />
          <UserHomePage />
        </>
      )}
    </AuthSelector>
  );
}
