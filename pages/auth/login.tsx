import React from 'react';

import { Button } from '@blueprintjs/core';
import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from '@firebase/auth';
import Link from 'next/link';
import { FIREBASE_AUTH } from '../../firebase';
import { signIn } from '../../firebase/auth';
import { useTextRef } from '../../common';

export default function LoginPage() {
  const router = useRouter();

  // If the user is logged in already redirect them to the
  // main page
  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    if (user) {
      router.push('..');
    }
  });

  const [loginError, setLoginError] = React.useState<string | null>(null);

  const [usernameRef, passwordRef] = useTextRef(2);

  const submitCallback = () => {
    if (!usernameRef.current || !passwordRef.current) return;

    const username = usernameRef.current.value.trim();
    const password = passwordRef.current.value;

    if (!username || !password) return;

    signIn(username, password)
      .catch((error) => {
        console.log(error.code);
        switch (error.code) {
          case 'auth/user-not-found':
          case 'auth/wrong-password': {
            passwordRef.current!.value = '';
            setLoginError('Incorrect username or password');
            break;
          }
          // eslint-disable-next-line no-lone-blocks
          default: {
            // TODO go to error page
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
        <Link href="/auth/reset">Forgot your password?</Link>
      </div>
    </div>
  );
}
