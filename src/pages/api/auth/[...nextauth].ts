import { signInWithEmailAndPassword } from '@firebase/auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LunchHitchUser } from '../../../auth';
import { FIREBASE_AUTH } from '../../../firebase';
import prisma from '../../../prisma';

export default NextAuth({
  callbacks: {
    // user received from authorize, token to send to session
    jwt: ({ token, user }) => {
      console.log('jwt callback user value', user);
      return Promise.resolve({ ...token, user });
    },
    async session({ session, token }) {
      // session is current session object
      // user received from jwt callback
      const user = token.user as LunchHitchUser;

      console.log('Session callback user value', user);

      const emailResult = await prisma.userInfo.findFirst({
        where: {
          id: user.username,
        },
      });

      if (!emailResult) {
        // TODO error handling
        throw new Error('Prisma did not return an email for this account');
      }

      return {
        ...session,
        user: {
          ...user,
          email: emailResult.email,
        },
      };
    },
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
        if (!credentials) throw new Error('Credentials cannot be null');

        const { username, password } = credentials;
        const result = await signInWithEmailAndPassword(FIREBASE_AUTH, `${username}@lunchhitch.firebaseapp.com`, password);

        return {
          displayName: result.user.displayName,
          // getIdToken: result.user.getIdToken,
          username,
        };
      },
    })],
});
