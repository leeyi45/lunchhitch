/* eslint-disable react/display-name */
import React from 'react';
import Head from 'next/head';

import AuthSelector from '../common/auth_selector';

export default () => (
  <>
    <Head>
      <title>LunchHitch</title>
    </Head>
    <AuthSelector
      unauthenticated={<div>Hello There</div>}
    >
      {(user) => (<div>Hello there {user.displayName}</div>)}
    </AuthSelector>
  </>
);
