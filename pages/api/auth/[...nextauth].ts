import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { FIREBASE_APP } from '../../../firebase';

const firebaseAuthSignIn = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_APP.options.apiKey!}`;

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

type Credentials = Record<'username' | 'password', string> | undefined;

export class SignInException extends Error {
  public readonly errorCode: string;

  constructor(errorCode: string) {
    super();
    this.errorCode = errorCode;
  }
}

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
      async authorize(credentials: Credentials) {
        const resp = await fetch(firebaseAuthSignIn, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: credentials!.username,
            password: credentials!.password,
            returnSecureToken: true,
          }),
        });

        const authResult = await resp.json();

        if (resp.status !== 200) {
          // some sign in error idk
          // INVALID_EMAIL, EMAIL_NOT_FOUND, INVALID_PASSWORD
          throw new SignInException(authResult.error);
        }
        // sign in was successful
        return {
          name: credentials!.username,
          id: authResult.localId,
          token: authResult.idToken,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
});
