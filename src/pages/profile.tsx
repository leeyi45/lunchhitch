import React from 'react';
import { LunchHitchUser } from '../auth/auth';
import { AuthRequired } from '../common/auth_wrappers';
import NavBar from '../common/navbar';

type Props = {
  user: LunchHitchUser;
};

const ProfileDisplay = ({ user }: Props) => (
  <>
    <NavBar user={user} />
    <h1>Welcome {user.displayName}!</h1>
    <h2>Email: {user.email}</h2>
  </>
);

export default function ProfilePage() {
  return (
    <AuthRequired>
      {
        (user) => (<ProfileDisplay user={user} />)
      }
    </AuthRequired>
  );
}
