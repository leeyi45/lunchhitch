import { ReactElement } from 'react';
import { LunchHitchUser } from '../../auth/auth';
import { useSession } from '../../auth/auth_provider';

type Props = {
    children: any;
};

type AuthProps = {
    children: (user: LunchHitchUser) => any;
};

type SelectorProps = {
    children: [ReactElement<AuthProps>, ReactElement<Props>, ReactElement<Props>];
};

export default Object.assign(({ children: [authed, unauthed, loading] }: SelectorProps) => {
  const { status } = useSession();

  switch (status) {
    case 'authenticated': return authed;
    case 'unauthenticated': return unauthed;
    case 'loading': return loading;
    default: throw new Error('should not get here');
  }
}, {
  Authenticated: ({ children }: AuthProps) => {
    const { user } = useSession();
    return children(user!);
  },
  Loading: ({ children }: Props) => children,
  Unauthenticated: ({ children }: Props) => children,
});
