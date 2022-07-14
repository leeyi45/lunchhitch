/**
 * auth.ts
 * Functions for managing users
 */
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut,
} from '@firebase/auth';
import { UserInfo } from '@prisma/client';

// import { useRouter } from 'next/router';
import { FIREBASE_AUTH } from '../firebase';
// import prisma from './prisma';

const DEFAULT_DOMAIN = 'lunchhitch.firebaseapp.com';

export type Credential = {
  username: string;
  password: string;
};

export type LunchHitchUser = {
  username: string;
  email: string;
  displayName: string;
  phoneNumber: string;
};

/**
 * Sign in with the given username and password
 */
export const signIn = ({ username, password }: Credential) => signInWithEmailAndPassword(FIREBASE_AUTH, `${username}@${DEFAULT_DOMAIN}`, password);

/**
 * Sign out the current user. Wraps around both the NextAuth signOut and Firebase signOut methods
 */
export const signOut = () => firebaseSignOut(FIREBASE_AUTH);

/**
 * Ask the Firebase API to create a new account
 * @param username Username of the new user
 * @param password Password of the new user
 * @param displayName Display name of the new user
 * @param email Email to be associated with the account
 * @param phoneNumber Phone number of the new user
 * @returns Created user
 */
export async function signUp({ password, ...params }: UserInfo & { password: string }): Promise<void> {
  await fetch('/api/userinfo/create', {
    method: 'POST',
    body: JSON.stringify(params as UserInfo),
  });
  await createUserWithEmailAndPassword(FIREBASE_AUTH, `${params.username}@${DEFAULT_DOMAIN}`, password);
  // await firebaseSignOut(FIREBASE_AUTH);
}
