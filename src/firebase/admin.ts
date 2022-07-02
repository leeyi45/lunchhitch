import * as firebaseAdmin from 'firebase-admin';

if (firebaseAdmin.apps.length === 0) {
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.applicationDefault(),
  });
}

export const FIREBASE_ADMIN = firebaseAdmin.apps[0]!;

export async function getSession(cookieToken: string) {
  try {
    const token = await FIREBASE_ADMIN.auth().verifyIdToken(cookieToken);
    const usernameMatch = token.email?.match(/(.+)@lunchhitch.firebaseapp.com/);

    if (!usernameMatch) throw new Error(); // TODO Error handling
    return usernameMatch[1];
  } catch (error) {
    return null;
  }
}
