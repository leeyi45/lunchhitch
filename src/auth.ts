/**
 * auth.ts
 * Functions for managing users
 */
import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile as updateFirebaseProfile, User,
} from '@firebase/auth';
import { FIREBASE_AUTH } from './firebase';
import getPrisma from './prisma';

const DEFAULT_DOMAIN = 'lunchhitch.firebaseapp.com';

export type Credential = {
  username: string;
  password: string;
};

export type LunchHitchUser = {
  username: string;
  email: string;
  displayName: string;
  firebaseObj: User;
};

/**
 * Query the Firebase API to sign in a user
 * @param username Username of the user to sign in with
 * @param password Password of the user to sign in with
 * @returns Signed in user
 */
export async function signIn(username: string, password: string): Promise<LunchHitchUser> {
  const signInTask = signInWithEmailAndPassword(FIREBASE_AUTH, `${username}@${DEFAULT_DOMAIN}`, password);
  const emailTask = getPrisma().userInfo.findFirst({
    where: {
      username,
    },
  });

  await Promise.all([signInTask, emailTask]);
  const signInResult = await signInTask;
  const emailResult = await emailTask;

  if (!emailResult) {
    // TODO handle sign in failure
    throw new Error();
  }

  return {
    username,
    email: emailResult.email,
    displayName: signInResult.user.displayName!,
    firebaseObj: signInResult.user,
  };
}

type SignUpParams = {
  username: string;
  password: string;
  displayName: string;
  email: string;
};

/**
 * Ask the Firebase API to create a new account
 * @param username Username of the new user
 * @param password Password of the new user
 * @param displayName Display name of the new user
 * @param email Email to be associated with the account
 * @returns Created user
 */
export async function signUp({
  username, password, displayName, email,
}: SignUpParams): Promise<void> {
  const result = await createUserWithEmailAndPassword(FIREBASE_AUTH, `${username}@${DEFAULT_DOMAIN}`, password);
  await updateFirebaseProfile(result.user, { displayName });

  // Update our db containing userinfo
  const dbtask = getPrisma().userInfo.create({
    data: {
      username,
      email,
    },
  }); // and update our own db
  await Promise.resolve([signOut(FIREBASE_AUTH), dbtask]);
}

export function updateProfile(user: LunchHitchUser, { email, displayName }: Record<'email' | 'displayName', string | undefined>) {
  const tasks: Promise<any>[] = [];

  if (displayName) tasks.push(updateFirebaseProfile(user.firebaseObj, { displayName }));

  if (email) {
    tasks.push(getPrisma().userInfo.updateMany({
      where: {
        username: user.username,
      },
      data: {
        email,
      },
    }));
  }

  return Promise.all(tasks);
}
