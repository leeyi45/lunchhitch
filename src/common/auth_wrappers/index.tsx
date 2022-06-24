import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from 'next-auth/react';
import { LunchHitchUser } from '../../auth';
import AuthSelector from './auth_selector';

type Props = {
    // eslint-disable-next-line no-unused-vars
    children: (user: LunchHitchUser) => any;
};

/**
 * Wrap child components with this component if they require the user to be logged in.
 * Unauthenticated users are redirected to the login page automatically
 */
export function AuthRequired({ children }: Props) {
  const { data: session, status } = useSession({
    required: true,
  });

  if (status === 'loading') {
    return (<CircularProgress />);
  }

  // User will never be null here because of the router redirect
  return children(session!.user as LunchHitchUser);
}

export { AuthSelector };
