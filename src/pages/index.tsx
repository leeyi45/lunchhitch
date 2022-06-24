import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from 'next-auth/react';
import Navbar from '../common/navbar';
import NoUserHomePage from '../common/components/noUser/NoUserHomePage';
import UserHomePage from '../common/components/user/UserHomePage';
import { LunchHitchUser } from '../auth';

export default function IndexPage() {
  const { data: session, status } = useSession();

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
        <Navbar user={session.user as LunchHitchUser} />
        <UserHomePage user={session.user as LunchHitchUser} />
      </>
    );
    default: throw new Error('Should not get here');
  }
}
