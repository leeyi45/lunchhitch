import { EmailAuthProvider } from 'firebase/auth';
import firebaseui from 'firebaseui';
import React from 'react';
import FIREBASE_AUTH from '../firebase/auth';

export type AuthenticationUIProps = {
    onSignIn: (() => void) | undefined;
};

/**
 * Sign In prompt
 */
export default function AuthenticationUI(props: AuthenticationUIProps) {
  React.useEffect(() => {
    (async () => {
      // Need to use this style of importing firebaseui because NextJS utilizes server side
      // rendering. We need to wait until the window has loaded before trying to display
      // the login UI
      const firebaseUI = await import('firebaseui');
      const ui = firebaseUI.auth.AuthUI.getInstance() || new firebaseUI.auth.AuthUI(FIREBASE_AUTH);
      ui.start('#firebase-login', {
        callbacks: {
          signInSuccessWithAuthResult: () => {
            if (props.onSignIn) props.onSignIn();
            return true;
          },
          signInFailure(authError: firebaseui.auth.AuthUIError) {
            switch (authError.code) {
              case 'auth/invalid-email': {
                alert('Invalid email!');
                break;
              }
              default: {
                alert('Unknown error');
                console.error(authError);
                break;
              }
            }
          },
          // uiShown: () => document.getElementById('loader')!.style.display = 'none'
        },
        signInFlow: 'redirect',
        signInSuccessUrl: '/',
        signInOptions: [
          {
            provider: EmailAuthProvider.PROVIDER_ID,
            requireDisplayName: true,
          },
        ],
      });
    })();
  }, []);

  return <div id="firebase-login" />;
}
