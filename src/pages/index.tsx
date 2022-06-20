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

/*
const NoUserHomePage = () => (
  <body style={{
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
  }}
  >
    <Typography
      variant="h1"
      component="div"
      style={{
        flexGrow: 1,
        textAlign: 'center',
        fontFamily: 'Raleway',
        color: 'black',
      }}
    >
      Welcome to Lunch Hitch!
    </Typography>
    <p style={{
      textAlign: 'center',
    }}
    >
      Where food meets community
    </p>
  </body>
);
*/

export default function IndexPage() {
  const { user, status } = useSession();

  switch (status) {
    case 'unauthenticated': return <NoUserHomePage />;
    case 'loading': return <CircularProgress />;
    case 'authenticated': return <UserHomePage user={user} />;
    default: throw new Error('Should not get here');
  }
}
