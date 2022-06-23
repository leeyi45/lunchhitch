import nookies from 'nookies';
import React from 'react';
import { FIREBASE_ADMIN, FIREBASE_AUTH } from '../firebase';
import { LunchHitchUser } from './auth';
import prisma from '../prisma';
import { extractUsername } from '.';
import { GetServerSidePropsContext } from 'next';

type Session = {
  status: 'unauthenticated' | 'loading';
  user: null;
} | {
  status: 'authenticated';
  user: LunchHitchUser;
};

const AuthContext = React.createContext<Session>({
  user: null,
  status: 'unauthenticated',
});

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = React.useState<LunchHitchUser | null>(null);
  const [status, setStatus] = React.useState<Session['status']>('unauthenticated');

  React.useEffect(() => {
    FIREBASE_AUTH.onAuthStateChanged(async (user) => {
      if (user) {
          try {
            setStatus('loading');
          const username = extractUsername(user);
          const emailResult = await prisma.userInfo.findFirst({
            where: {
              id: username,
            }
          });
          if (!emailResult) throw new Error(`Prisma failed to return an email for ${username}!`)

          setUser({
            email: emailResult.email,
            username,
            displayName: user.displayName!,
            firebaseObj: user,
          });
          setStatus('authenticated');
        }
        catch (error) {
          setUser(null);
          setStatus('unauthenticated');
        }
      } else { 
        setUser(null);
        setStatus('unauthenticated');
      }
    })

    return FIREBASE_AUTH.onIdTokenChanged((user) => {
      if (!user) {
        nookies.set(undefined, 'token', '', { path: '/' });
      } else {
        user.getIdToken().then((token) => nookies.set(undefined, 'token', token, { path: '/' }));
      }
      });
    }, []);

  React.useEffect(() => {
    const handle = setInterval(async () => {
      if (FIREBASE_AUTH.currentUser) await FIREBASE_AUTH.currentUser.getIdToken(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(handle);
  }, [])

  return (<AuthContext.Provider value={status === 'authenticated' ? { user: user!, status } : { user: null, status }}>{children}</AuthContext.Provider>);
}

export const useSession = () => React.useContext(AuthContext)

export const getSession = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await FIREBASE_ADMIN.auth().verifyIdToken(cookies.token);
    return token;
  } catch (err) {
    return null;
  }
}