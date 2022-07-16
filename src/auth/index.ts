/**
 * auth.ts
 * Functions for managing users
 */
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut,
} from '@firebase/auth';
import { UserInfo } from '@prisma/client';

import { fetchApi } from '../api_helpers';
import { FIREBASE_AUTH } from '../firebase';

import { useSession } from './auth_provider';

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
 * Sign out the current user.
 */
export const signOut = () => firebaseSignOut(FIREBASE_AUTH);

/**
 * Ask the Firebase API to create a new account and update the database
 */
export async function signUp({ password, ...params }: UserInfo & { password: string }): Promise<void> {
  await fetchApi('userinfo/create', params);
  await createUserWithEmailAndPassword(FIREBASE_AUTH, `${params.username}@${DEFAULT_DOMAIN}`, password);
  // await firebaseSignOut(FIREBASE_AUTH);
}

export { useSession };
