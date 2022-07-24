import * as firebaseAdmin from 'firebase-admin';

if (firebaseAdmin.apps.length === 0) {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert({
      privateKey,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      projectId: 'lunchhitch',
    }),
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
