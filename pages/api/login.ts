import { NextApiRequest, NextApiResponse } from 'next';
import { init, setAuthCookies } from 'next-firebase-auth';

function initAuth() {
  init({
    appPageURL: '/',
    loginAPIEndpoint: 'api/login',
    logoutAPIEndpoint: 'api/logout',
    firebaseClientInitConfig: {
      apiKey: process.env.FIREBASE_API_KEY!,
      authDomain: 'lunchhitch.firebaseapp.com',
      projectId: 'lunchhitch',
      storageBucket: 'lunchhitch.appspot.com',
      messagingSenderId: '947628920966',
      appId: '1:947628920966:web:9c51ce8dc29ed8971fc107',
      measurementId: 'G-QHNWEVTCH0',
    },
    cookies: {
      name: 'LunchHitch',
      secure: false,
      signed: false,
    },
  });
}

initAuth();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await setAuthCookies(req, res);
  } catch (e) {
    return res.status(500).json({ error: 'Unexpected error' });
  }

  return res.status(200).json({ success: true });
}
