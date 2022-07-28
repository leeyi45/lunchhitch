/**
 * firebase/index.ts
 * Configuration information for firebase integrations
 */
import * as firebase from 'firebase/app';
import * as firebaseAuth from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: 'lunchhitch.firebaseapp.com',
  projectId: 'lunchhitch',
  storageBucket: 'lunchhitch.appspot.com',
  messagingSenderId: '947628920966',
  appId: '1:947628920966:web:9c51ce8dc29ed8971fc107',
  measurementId: 'G-QHNWEVTCH0',
};

if (firebase.getApps().length === 0) {
  firebase.initializeApp(firebaseConfig);
}

export const FIREBASE_APP = firebase.getApps()[0];
const FIREBASE_AUTH = firebaseAuth.initializeAuth(FIREBASE_APP);
firebaseAuth.setPersistence(FIREBASE_AUTH, firebaseAuth.browserLocalPersistence);
export { FIREBASE_AUTH };

export function firebaseErrorHandler(error: firebase.FirebaseError, codes: { [code: string]: string }) {
  const errorCode = error.code.match(/auth\/(.+)/);

  // eslint-disable-next-line no-param-reassign
  codes = {
    ...codes,
    'network-request-failed': 'Unable to reach Firebase servers!',
  };

  if (errorCode && codes[errorCode[1]]) return codes[errorCode[1]];
  return `Unexpected error: '${errorCode}'`;
}
