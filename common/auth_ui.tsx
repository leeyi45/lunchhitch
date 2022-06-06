import { Button } from '@material-ui/core';
import { signIn } from 'next-auth/react';
import React from 'react';
import { SignInException } from '../pages/api/auth/[...nextauth]';

export default function AuthenticationUI() {
  const [signinError, setSiginError] = React.useState<string | undefined>(undefined);
  const usernameBox = React.useRef<HTMLInputElement | null>(null);
  const passwordBox = React.useRef<HTMLInputElement | null>(null);

  const onSignIn = () => {
    (async () => {
      try {
        signIn('credentials', { redirect: false });
      } catch (error) {
        if (error instanceof SignInException) {
          setSiginError(error.errorCode);
        } else {
          // TODO: make error page
        }
      }
    })();
  };

  const processError = () => {
    switch (signinError) {
      case 'EMAIL_NOT_FOUND':
      case 'INVALID_PASSWORD': return 'Incorrect username or password';
      default: return undefined;
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignContent: 'center',
    }}
    >
      {processError()}
      <input ref={usernameBox} type="text" />
      <input ref={passwordBox} type="password" />
      <Button onClick={onSignIn}>Sign In</Button>
    </div>
  );
}
