import React from 'react';
import { LunchHitchUser } from '../auth';
import { AuthRequired } from '../common/auth_wrappers';

type Props = {
  user: LunchHitchUser;
};

const ProfileDisplay = ({ user }: Props) => (
  <>
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
