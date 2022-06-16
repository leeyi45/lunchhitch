import React from 'react';
import { LunchHitchUser, useSession } from '../auth';
import Navbar from '../common/navbar';

function UserHomePage({ user }: { user: LunchHitchUser }) {
  return (
    <>
      <h1>
        Welcome back,
        {user.displayName}
        !
      </h1>
      <p>What will it be today?</p>
    </>
  );
}

const NoUserHomePage = () => (
  <>
    <h1>Welcome to LunchHitch</h1>
    <p>Please I really need a web page that looks nice</p>
  </>
);

export default function IndexPage() {
  const { user, status } = useSession();
  return (
    <>
      <Navbar user={user} />
      {status === 'authenticated' ? <UserHomePage user={user} /> : <NoUserHomePage />}
    </>
  );
}
