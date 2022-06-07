import { createUserWithEmailAndPassword, signInWithEmailAndPassword, User } from '@firebase/auth';
import { FIREBASE_AUTH } from '.';

/**
 * Represents a username password pair
 */
export type Credentials = Record<'username' | 'password', string>;

/**
 * Represents a user that has already signed in
 */
export type SessionedUser = Record<'username' | 'password' | 'token', string>;

export class AuthException extends Error {
  public readonly errorCode: string;

  constructor(errorCode: string) {
    super();
    this.errorCode = errorCode;
  }
}

/**
 * Query the Firebase API to sign in a user
 * @param credentials Credentials to sign in with
 * @returns Signed in user
 */
export async function signIn(credentials: Credentials): Promise<User> {
  try {
    const result = await signInWithEmailAndPassword(FIREBASE_AUTH, credentials.username, credentials.password);
    return result.user;
  } catch (error: any) {
    throw new AuthException(error.errorCode as string);
  }
}

/**
 * Ask the Firebase API to create a new account
 * @param creds Credentials to create the new user account with
 */
export async function signUp(creds: Credentials): Promise<User> {
  try {
    const result = await createUserWithEmailAndPassword(FIREBASE_AUTH, creds.username, creds.password);
    return result.user;
  } catch (error: any) {
    throw new AuthException(error.errorCode as string);
  }
}
