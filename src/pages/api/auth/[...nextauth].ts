import { signInWithEmailAndPassword } from '@firebase/auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { LunchHitchUser } from '../../../auth';
import { FIREBASE_AUTH } from '../../../firebase';
import prisma from '../../../prisma';

export default NextAuth({
  callbacks: {
    jwt: async ({ token, user }) => {
      console.log('User value in jwt callback was', user);
      return {
        ...token,
        user,
      }
      // if (!user) return token;

      // const userInfo = user as unknown as LunchHitchUser;
      // const emailResult = await prisma.userInfo.findFirst({
      //     where: {
      //       id: userInfo.username,
      //     },
      //   });

      //   if (!emailResult) {
      //   // TODO error handling
      //     throw new Error('Prisma did not return an email for this account');
      //   }
      
      // return {
      //   ...token,
      //   user: {
      //     ...userInfo,
      //     email: emailResult.email,
      //   }
      // }
      
    },
    session: ({ session, token }) => Promise.resolve({ ...session, user: token.user as LunchHitchUser }),
  },
  pages: {
    signIn: '/auth/login',
  },
  session: {
    strategy: 'jwt',
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
        const emailResult = await prisma.userInfo.findFirst({
          where: {
            id: username,
          },
        });

        if (!emailResult) {
        // TODO error handling
          throw new Error('Prisma did not return an email for this account');
        }

        return {
          displayName: result.user.displayName,
          email: emailResult.email,
          username,
        };
      },
    })],
});
