import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { LunchHitchUser, useSession } from '../auth';
import Navbar from '../common/navbar';
import NoUserHomePage from '../common/components/noUser/NoUserHomePage';

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



export default function IndexPage() {
  const { user, status } = useSession();

  switch (status) {
    case 'unauthenticated': return (
      <>
        <Navbar />
        <NoUserHomePage />
      </>
      );
    case 'loading': return (
      <>
        <Navbar />
        <CircularProgress />
      </>
      );
    case 'authenticated': return (
      <>
        <Navbar />
        <UserHomePage user={user}/>
      </>
      );
    default: throw new Error('Should not get here');
  }
}
