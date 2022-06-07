import React from 'react';

import { Button } from '@blueprintjs/core';
import { Typography } from '@material-ui/core';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // If the user is logged in already redirect them to the
  // main page
  if (session && session.user) {
    router.push('.');
  }

  const [loginError, setLoginError] = React.useState<string | null>(null);

  const usernameRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);

  const submitCallback = () => {
    if (!usernameRef.current || !passwordRef.current) return;

    const username = usernameRef.current.value.trim();
    const password = passwordRef.current.value.trim();

    if (!username || !password) return;

    (async () => {
      try {
        await signIn('credentials', {
          redirect: false,
          username,
          password,
        });
        router.push('/');
      } catch (error: any) {
        if (error.errorCode) {
          switch (error.errorCode) {
            case 'EMAIL_NOT_FOUND':
            case 'INVALID_PASSWORD': {
              setLoginError('Incorrect username or password');
              break;
            }
            // eslint-disable-next-line no-lone-blocks
            default: {
              // TODO go to error page
              break;
            }
          }
        }
      }
    })();
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
