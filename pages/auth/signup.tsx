import { Button } from '@material-ui/core';
import React from 'react';
import { useTextRef } from '../../common';
import AuthRequired from '../../common/auth_required';
import LabelledInput from '../../common/labelled_input';
import Redirecter from '../../common/redirecter';
import { signUp } from '../../firebase/auth';

export default function SignUpPage() {
  const [usernameRef, passwordRef, repeatPassRef, nameRef, emailRef] = useTextRef(5);

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

    if (password !== repeatPass) {
      setSignupError('Passwords do not match!');
      return;
    }

    (async () => {
      try {
        await signUp(username, password, nameRef.current!.value.trim());
        setSignUpSuccess(true);
      } catch (error: any) {
        if (error.code === 'auth/email-already-exists') {
          setSignupError('An account with this username already exists');
        } else {
          // TODO redirect to error page

        }
      }
    })();
  };

  return (
    <AuthRequired>
      {
        signUpSuccess
          ? (
            <Redirecter redirect="/index" duration={5}>
              <p>Sign up successful! Redirecting you to the login page</p>
            </Redirecter>
          )
          : (
            <>
              <p>Name:</p>
              <input type="text" ref={nameRef} />
              <LabelledInput type="text" ref={emailRef} />
              <p>Username:</p>
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
