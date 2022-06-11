import { useRouter } from 'next/router';
import { onAuthStateChanged, User } from '@firebase/auth';
import React from 'react';
import { FIREBASE_AUTH } from '../firebase';

type Props = {
    // eslint-disable-next-line no-unused-vars
    children: (user: User) => any;
};

/**
 * Wrap child components with this component if they require the user to be logged in.
 * Unauthenticated users are redirected to the login page automatically
 */
export function AuthRequired({ children }: Props) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);

  onAuthStateChanged(FIREBASE_AUTH, setUser);

  React.useEffect(() => {
    if (!user) router.push('/auth/login');
  }, [user]);

  return children(user!);
}

type RedirectProps = {
  redirect: string;
    // eslint-disable-next-line no-unused-vars
  children: any;
};

/**
 * Wrap child components if the they require the user to be logged out
 * Authenticated users are redirected to the given redirect
 */
export function RedirectOnAuth({ redirect, children }: RedirectProps) {
  const router = useRouter();
  const [user, setUser] = React.useState<User | null>(null);

  onAuthStateChanged(FIREBASE_AUTH, setUser);

  React.useEffect(() => {
    if (user) router.push(redirect);
  }, [user]);

  return children;
}
