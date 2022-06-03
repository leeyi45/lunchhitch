import React from 'react';

import { Button } from '@blueprintjs/core';
import { signInWithEmailAndPassword } from '@firebase/auth';
import { Typography } from '@material-ui/core';
import FIREBASE_AUTH from '../firebase/auth';

export default function LoginPage() {
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const usernameRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);

  FIREBASE_AUTH.onAuthStateChanged((user) => {
    if (user) alert(`Successfully signed in as ${user.displayName}`);
  });

  const submitCallback = () => {
    if (!usernameRef.current || !passwordRef.current) return;

    const username = usernameRef.current.value.trim();
    const password = usernameRef.current.value.trim();

    if (!username || !password) return;

    signInWithEmailAndPassword(FIREBASE_AUTH, username, password)
      .catch((error) => {
        switch (error.code) {
          case 'auth/invalid-email': {
            setLoginError('Enter a valid email address');
            break;
          }
          case 'auth/wrong-password': {
            setLoginError('Invalid email or password');
            break;
          }
          case 'auth/too-many-requests': {
            setLoginError('Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later');
            break;
          }
          default: {
            console.error(error);
            setLoginError('Unknown error');
            break;
          }
        }
      });
  };

  return (
    <div style={{
      flexDirection: 'column',
      alignContent: 'center',
    }}
    >
      <div style={{ background: '#454B1B' }}>
        <Typography
          variant="h6"
          component="div"
          style={{
            flexGrow: 1,
            textAlign: 'left',
            fontFamily: 'Raleway',
            color: 'white',
          }}
        >
          Log In to Lunch Hitch
        </Typography>
      </div>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '70%',
        alignContent: 'center',
        justifyContent: 'center',
      }}
      >
        {
                    loginError === null
                      ? null
                      : (
                        <text fontStyle="color red">
                          {loginError}
                        </text>
                      )
                }
        <text
          style={{
            marginBottom: '10px',
          }}
        >
          Username:
        </text>
        <input
          type="text"
          ref={usernameRef}
          onSubmit={submitCallback}
        />
        <text
          style={{
            marginBottom: '10px',
          }}
        >
          Password:
        </text>
        <input
          type="password"
          ref={passwordRef}
          onSubmit={submitCallback}
        />
        <Button
          onClick={submitCallback}
          style={{
            marginTop: '10px',
          }}
        >
          Sign In
        </Button>
      </div>
    </div>
  );
}
