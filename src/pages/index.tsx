import React from 'react';
import Navbar from '../common/navbar';
import NoUserHomePage from '../common/components/noUser/NoUserHomePage';
import UserHomePage from '../common/components/user/UserHomePage';
import { LunchHitchUser } from '../auth';
import AuthSelector from '../common/auth_selector';

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
