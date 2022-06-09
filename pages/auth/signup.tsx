import { Button } from '@material-ui/core';
import React from 'react';
import AuthRequired from '../../common/auth_required';
import { signUp } from '../../firebase/auth';

export default function SignUpPage() {
  const usernameRef = React.useRef<HTMLInputElement | null>(null);
  const passwordRef = React.useRef<HTMLInputElement | null>(null);
  const repeatPassRef = React.useRef<HTMLInputElement | null>(null);
  const nameRef = React.useRef<HTMLInputElement | null>(null);

  const [signUpError, setSignupError] = React.useState('');
  const [signUpSuccess, setSignUpSuccess] = React.useState(false);

  const signUpCallback = () => {
    if (!usernameRef.current || !passwordRef.current
        || !repeatPassRef.current || !nameRef.current) return;

    const username = usernameRef.current.value?.trim();
    if (!username) {
      setSignupError('Username cannot be blank!');
      return;
    }

    const password = passwordRef.current.value;
    if (!password) {
      setSignupError('Password cannot be blank!');
      return;
    }

    const repeatPass = repeatPassRef.current.value;
    if (!repeatPass) {
      setSignupError('Password cannot be blank!');
      return;
    }

    if (password !== repeatPass) setSignupError('Passwords do not match!');

    signUp(username, password, nameRef.current.value.trim())
      .then(() => setSignUpSuccess(true))
      .catch((error) => {
        if (error.code === 'auth/email-already-exists') {
          setSignupError('An account with this username already exists');
        } else {
          // TODO redirect to error page

        }
      });
  };

  return (
    <AuthRequired>
      {
        signUpSuccess
          ? <p>Sign Up Succcessful! Refresh the page to login!</p>
          : (
            <>
              <p>Name:</p>
              <input type="text" ref={nameRef} />
              <p>Email:</p>
              <input type="text" ref={usernameRef} />
              <p>Password:</p>
              <input type="password" ref={passwordRef} />
              <p>Repeat Password:</p>
              <input type="password" ref={repeatPassRef} />
              {signUpError !== '' ? <p>{signUpError}</p>
                : undefined}
              <Button onClick={signUpCallback} />
            </>
          )
      }
    </AuthRequired>
  );
}
