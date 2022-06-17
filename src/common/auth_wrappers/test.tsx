import React from 'react';
import { AuthSelector } from '.';

const testPage = () => (
  <AuthSelector>
    <AuthSelector.Authenticated>
      {(user) => (<p>{user.displayName}</p>)}
    </AuthSelector.Authenticated>
    <AuthSelector.Unauthenticated>
      <p>Not logged in :(</p>
    </AuthSelector.Unauthenticated>
    <AuthSelector.Loading>
      <p>Loading....</p>
    </AuthSelector.Loading>
  </AuthSelector>
);

export default testPage;
