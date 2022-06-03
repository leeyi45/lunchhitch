import { getAuth } from 'firebase/auth';
import FIREBASE_APP from '.';

const FIREBASE_AUTH = getAuth(FIREBASE_APP);
export default FIREBASE_AUTH;
