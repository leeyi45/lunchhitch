import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { LunchHitchUser, useSession } from '../auth';

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

  switch (status) {
    case 'unauthenticated': return <NoUserHomePage />;
    case 'loading': return <CircularProgress />;
    case 'authenticated': return <UserHomePage user={user} />;
    default: throw new Error('Should not get here');
  }
}
