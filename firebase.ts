/**
 * firebase/index.ts
 * Configuration information for firebase integrations
 */
import { initializeAuth } from '@firebase/auth';
import { initializeApp } from 'firebase/app';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'lunchhitch.firebaseapp.com',
  projectId: 'lunchhitch',
  storageBucket: 'lunchhitch.appspot.com',
  messagingSenderId: '947628920966',
  appId: '1:947628920966:web:9c51ce8dc29ed8971fc107',
  measurementId: 'G-QHNWEVTCH0',
};

export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP);
export const FIRESTORE = initializeFirestore(FIREBASE_APP, {});
