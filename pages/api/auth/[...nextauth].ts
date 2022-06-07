import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { signIn } from '../../../firebase/auth';

type SignInSuccess = {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered: boolean;
}

type SignInError = {
  error: {
    code: number;
    message: string;
    errors: {
      message: string;
      domain: string;
      reason: string;
    }[];
  }
};

export type FirebaseSignInResponse = SignInSuccess | SignInError;

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Lunch Hitch',
      credentials: {
        username: {
          label: 'Email',
          type: 'text',
          placeholder: 'Email',
        },
        password: {
          label: 'Password',
          type: 'password',
        },
      },
      async authorize(creds) {
        const result = await signIn(creds!);
        return {
          token: result.getIdToken(),
          ...creds,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
});
