/* eslint-disable no-shadow */
import React from 'react';
import { UserInfo } from '@prisma/client';
import nookies from 'nookies';

import { FIREBASE_AUTH } from '../firebase';

import { LunchHitchUser } from '.';

export type Session = {
  user: LunchHitchUser;
  status: 'authenticated';
} | {
  user: null;
  status: 'loading' | 'unauthenticated';
};

const AuthContext = React.createContext<Session>({
  user: null,
  status: 'unauthenticated',
});

/**
 * Wrap _app.tsx with one of these to make the useSession hook available in all
 * components
 */
export function AuthProvider({ children }: any) {
  const [contextObj, setContextObj] = React.useState<Session>({
    user: null,
    status: 'unauthenticated',
  });

  React.useEffect(() => FIREBASE_AUTH.onAuthStateChanged(async (user) => {
    if (!user) {
      setContextObj({
        user: null,
        status: 'unauthenticated',
      });
    } else {
      setContextObj({
        user: null,
        status: 'loading',
      });

      const usernameMatch = user.email?.match(
        /(.+)@lunchhitch.firebaseapp.com/,
      );

      if (!usernameMatch) throw new Error(); // TODO Error handling

      const userInfoResp = await fetch('/api/userinfo');
      const userInfoResult: UserInfo = await userInfoResp.json();

      if (!userInfoResult) {
        // TODO error handling
        throw new Error('Prisma did not return userinfo for this account');
      }

      setContextObj({
        user: userInfoResult,
        status: 'authenticated',
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
