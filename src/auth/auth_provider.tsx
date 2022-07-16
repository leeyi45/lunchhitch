/* eslint-disable no-shadow */
import React from 'react';
import nookies from 'nookies';

import { SessionUser } from '../common';
import { FIREBASE_AUTH } from '../firebase';

export type Session = {
  user: SessionUser;
  status: 'authenticated';
  error: null;
} | {
  user: null;
  status: 'loading' | 'unauthenticated';
  error: null;
} | {
  user: null;
  status: 'errored';
  error: any;
};

const AuthContext = React.createContext<Session>({
  user: null,
  status: 'unauthenticated',
  error: null,
});

/**
 * Wrap _app.tsx with one of these to make the useSession hook available in all
 * components
 */
export function AuthProvider({ children }: any) {
  const [contextObj, setContext] = React.useState<Session>({
    user: null,
    status: 'unauthenticated',
    error: null,
  });

  const setContextObj = (value: Session) => {
    setContext(value);
  };

  React.useEffect(() => FIREBASE_AUTH.onAuthStateChanged((user) => {
    if (!user) {
      setContextObj({
        status: 'unauthenticated',
        user: null,
        error: null,
      });
    } else {
      const usernameMatch = user.email!.match(
        /(.+)@lunchhitch.firebaseapp.com/,
      );

      if (!usernameMatch) throw new Error(`Failed to match username: ${user.email}`);

      setContextObj({
        status: 'authenticated',
        user: {
          username: usernameMatch[1],
          displayName: user.displayName!,
        },
        error: null,
      });
    }
  }), []);

  React.useEffect(
    () => FIREBASE_AUTH.onIdTokenChanged(async (user) => {
      nookies.set(undefined, 'token', user ? await user.getIdToken() : '', {
        path: '/',
      });
    }),
    [],
  );

  React.useEffect(() => {
    const handle = setInterval(async () => {
      const user = FIREBASE_AUTH.currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={contextObj}>{children}</AuthContext.Provider>
  );
}

/**
 * Hook to return the current session information
 */
export const useSession = () => React.useContext(AuthContext);
