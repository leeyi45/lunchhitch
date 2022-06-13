import React from 'react';
import { User } from '@firebase/auth';
import { useUserState } from '../common';
import Navbar from '../common/navbar';

function UserHomePage({ user }: { user: User }) {
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

export default () => {
  const user = useUserState();
  return (
    <>
      <Navbar user={user} />
      {user ? <UserHomePage user={user} /> : <NoUserHomePage />}
    </>
  );
};
