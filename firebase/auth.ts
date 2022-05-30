import { EmailAuthProvider, getAuth } from "firebase/auth";
import firebaseui from 'firebaseui';

import FIREBASE_APP from '.';

export const FIREBASE_AUTH = getAuth(FIREBASE_APP);

const auth_ui_config: firebaseui.auth.Config = {
    callbacks: {
        signInSuccessWithAuthResult: (authResult, redirectUrl) => true,
        // uiShown: () => document.getElementById('loader')!.style.display = 'none'
    },
    signInFlow: 'redirect',
    signInSuccessUrl: '/',
    signInOptions: [
        {
            provider: EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true,
        }
    ]
}
