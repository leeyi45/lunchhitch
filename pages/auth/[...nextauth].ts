import { getApp } from 'firebase/app';
import { NextApiRequest, NextApiResponse } from 'next';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const firebaseApp = getApp();
const firebaseAuthSignIn = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=[${firebaseApp.options.apiKey!}]`;

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

type FirebaseSignInResponse = SignInSuccess | SignInError;

type Credentials = Record<'username' | 'password', string> | undefined;

async function authorizer(credentials: Credentials) {
  const resp = await fetch(firebaseAuthSignIn, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: credentials?.username,
      password: credentials?.password,
      returnSecureToken: true,
    }),
  });

  const authResult = await resp.json();

  if (resp.status !== 200) {
    // some sign in error idk
    // INVALID_EMAIL, EMAIL_NOT_FOUND, INVALID_PASSWORD
    return false;
  }
  // sign in was successfull
  return {
    ...credentials,
    id: authResult.localId,
    token: authResult.idToken,
  };
}

export default function auth(req: NextApiRequest, res: NextApiResponse) {
  return NextAuth(req, res, {
    providers: [
      CredentialsProvider({
        name: 'Lunch Hitch',
        credentials: {
          username: {
            label: 'Username',
            type: 'text',
            placeholder: 'email',
          },
          password: {
            label: 'Password',
            type: 'password',
          },
        },
        authorize: authorizer,
      }),
    ],
  });
}
