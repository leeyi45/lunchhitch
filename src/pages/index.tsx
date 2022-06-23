import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from '../auth/auth';
import Navbar from '../common/navbar';
import NoUserHomePage from '../common/components/noUser/NoUserHomePage';
import UserHomePage from '../common/components/user/UserHomePage';



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
