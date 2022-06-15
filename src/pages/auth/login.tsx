import React from 'react';
import { Typography } from '@material-ui/core';
import Link from 'next/link';
import { FormikHelpers } from 'formik';
import FormikWrapper from '../../common/formik_wrapper/formik_wrapper';
import { Credential, signIn } from '../../auth';
import { RedirectOnAuth } from '../../common/auth_wrappers';

export default function LoginPage() {
  const submitCallback = async (creds: Credential) => {
    const result = await signIn(creds);

    if (!result.ok) throw result.error;
  };

  const errorCallback = (error: string, actions: FormikHelpers<Credential>) => {
    // NextAuth wants to be stupid and return errors as strings
    // So we need to use regex and extract the Firebase error code from the string
    const errorRegex = /\(auth\/(.+)\)/;
    const errorCode = error.match(errorRegex);
    actions.setFieldValue('password', '', false);

    // console.log(errorCode);
    if (errorCode) {
      switch (errorCode[1]) {
        case 'user-not-found':
        case 'wrong-password': return 'Incorrect username or password';
        case 'too-many-requests': return 'Too many failed login attempts, please try again later';
      }
    }

    return `An unexpected error occured: '${errorCode}'`;
  }

  return (
    <RedirectOnAuth redirect="/profile">
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
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          paddingBottom: '100px',
          border: '5px solid black',
        }}
        >
          <FormikWrapper
            fields={{
              username: {
                type: 'text', labelText: 'Username', required: true, initialValue: '',
              },
              password: {
                type: 'password', labelText: 'Password', required: true, initialValue: '',
              },
            }}
            onSubmit={submitCallback}
            onSubmitError={errorCallback}
            submitButtonText="Sign In"
            resetButton={false}
          />
          <Link href="/auth/signup">Sign Up</Link>
          <Link href="/auth/reset">Forgot your password?</Link>
        </div>
      </div>
    </RedirectOnAuth>
  );
}
