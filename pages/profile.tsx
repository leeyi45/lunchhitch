import React from 'react';
import { AuthRequired } from '../common/auth_wrappers';
import NavBar from '../common/navbar';

export default function ProfilePage() {
  return (
    <AuthRequired>
      {
        (user) => (
          <div>
            <NavBar user={user} />
            <h1>{user.displayName}</h1>
          </div>
        )
      }
    </AuthRequired>
  );
}
