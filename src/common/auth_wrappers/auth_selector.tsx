import CircularProgress from '@mui/material/CircularProgress';
import { useSession } from 'next-auth/react';
import React, { ReactElement } from 'react';
import { LunchHitchUser } from '../../auth';

type Props = {
  children: any;
};

type AuthProps = {
  children: (user: LunchHitchUser) => any;
};

type SelectorProps = {
  children: [ReactElement<AuthProps>, ReactElement<Props>, ReactElement<Props>];
} | {
  children: [ReactElement<AuthProps>, ReactElement<Props>];
};

export default Object.assign(({ children: [authed, unauthed, loading] }: SelectorProps) => {
  const { status } = useSession();

  switch (status) {
    case 'authenticated': return authed;
    case 'unauthenticated': return unauthed;
    case 'loading': return loading || (<CircularProgress />);
    default: throw new Error('should not get here');
  }
}, {
  Authenticated: ({ children }: AuthProps) => {
    const { data: session } = useSession();
    return children(session!.user as LunchHitchUser);
  },
  Loading: ({ children }: Props) => children,
  Unauthenticated: ({ children }: Props) => children,
});
