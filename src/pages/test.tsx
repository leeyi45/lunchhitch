/* eslint-disable react/display-name */
import React from 'react';

import AuthSelector from '../common/auth_selector';

export default () => (
  <AuthSelector
    unauthenticated={<div>Hello There</div>}
  >
    {(user) => (<div>Hello there {user.displayName}</div>)}
  </AuthSelector>
);
