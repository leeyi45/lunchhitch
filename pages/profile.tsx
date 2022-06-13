import { User } from '@firebase/auth';
import React from 'react';
import { useAsyncValue } from '../common';
import { AuthRequired } from '../common/auth_wrappers';
import NavBar from '../common/navbar';
import getPrisma from '../prisma';

const ProfileDisplay = ({ user }: { user: User }) => {
  const result = useAsyncValue(() => getPrisma().userInfo.findFirst({
    where: {
      username: user.email!,
    },
  }));

  if (!result) {
    // TODO redirect to error page
  }

  return (
    <div>
      <NavBar user={user} />
      <h1>{user.displayName}</h1>
      <h1>{result!.email}</h1>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <AuthRequired>
      {
        (user) => (<ProfileDisplay user={user} />)
      }
    </AuthRequired>
  );
}
