/* eslint-disable no-shadow */
import React from 'react';
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

  React.useEffect(
    () => FIREBASE_AUTH.onIdTokenChanged(async (user) => {
      if (!user) {
        setContextObj({
          user: null,
          status: 'unauthenticated',
        });
        nookies.set(undefined, 'token', '', { path: '/' });
      } else {
        setContextObj({
          user: null,
          status: 'loading',
        });

        nookies.set(undefined, 'token', await user.getIdToken(), {
          path: '/',
        });
        const usernameMatch = user.email?.match(
          /(.+)@lunchhitch.firebaseapp.com/,
        );

        if (!usernameMatch) throw new Error(); // TODO Error handling
        const username = usernameMatch[1];

        const emailResp = await fetch(
          '/api/prisma?collection=userInfo&method=findFirst',
          {
            method: 'POST',
            body: JSON.stringify({
              where: {
                id: username,
              },
            }),
          },
        );

        const emailResult = await emailResp.json();

        if (!emailResult) {
        // TODO error handling
          throw new Error('Prisma did not return an email for this account');
        }

        setContextObj({
          user: {
            username,
            displayName: user.displayName!,
            email: emailResult.email,
          },
          status: 'authenticated',
        });
      }
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
