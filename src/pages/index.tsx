import React from 'react';

import { LunchHitchUser } from '../auth';
import AuthSelector from '../common/auth_selector';
import NoUserHomePage from './profile/noUser/NoUserHomePage';
import UserHomePage from './profile/user/UserHomePage';
import Navbar from '../common/navbar';

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
          <UserHomePage user={user as LunchHitchUser} />
        </>
      )}
    </AuthSelector>
  );
}
