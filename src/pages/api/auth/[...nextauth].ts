import { signInWithEmailAndPassword } from '@firebase/auth';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import { FIREBASE_AUTH } from '../../../firebase';
import prisma from '../../../prisma';

export default NextAuth({
  pages: {
    signIn: '/auth/login',
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
