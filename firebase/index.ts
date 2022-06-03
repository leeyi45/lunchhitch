/**
 * firebase/index.ts
 * Configuration information for firebase integrations
 */
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: 'lunchhitch.firebaseapp.com',
  projectId: 'lunchhitch',
  storageBucket: 'lunchhitch.appspot.com',
  messagingSenderId: '947628920966',
  appId: '1:947628920966:web:9c51ce8dc29ed8971fc107',
  measurementId: 'G-QHNWEVTCH0',
};

const FIREBASE_APP = initializeApp(firebaseConfig);
export default FIREBASE_APP;
