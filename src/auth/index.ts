/**
 * auth.ts
 * Functions for managing users
 */
import type { UserInfo } from '@prisma/client';
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut as firebaseSignOut, updateProfile,
} from 'firebase/auth';

import { fetchApiThrowOnError } from '../api_helpers';
import { FIREBASE_AUTH } from '../firebase';

import { useSession } from './auth_provider';
import type { Credential } from './types';

/**
 * The login domain in use
 */
export const DEFAULT_DOMAIN = 'lunchhitch.firebaseapp.com';

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
  await createUserWithEmailAndPassword(FIREBASE_AUTH, `${params.username}@${DEFAULT_DOMAIN}`, password);
  await updateProfile(FIREBASE_AUTH.currentUser!, {
    displayName: params.displayName,
  });
  await fetchApiThrowOnError('userinfo/create', params);
  // await firebaseSignOut(FIREBASE_AUTH);
}

export { useSession };
