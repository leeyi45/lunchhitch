import React from 'react';
import { Typography } from '@material-ui/core';
import Link from 'next/link';
import { FormikHelpers } from 'formik';
import FormikWrapper from '../../common/formik_wrapper/formik_wrapper';
import { Credential, signIn } from '../../auth';
import { RedirectOnAuth } from '../../common/auth_wrappers';
import { firebaseErrorHandler } from '../../firebase';

export default function LoginPage() {
  const submitCallback = async (creds: Credential) => {
    const result = await signIn(creds);

    if (!result.ok) throw result.error;
  };

  const errorCallback = (error: string, actions: FormikHelpers<Credential>) => {
    actions.setFieldValue('password', '', false);
    return firebaseErrorHandler(error, {
      'user-not-found': 'Incorrect username or password',
      'wrong-password': 'Incorrect username or password',
      'too-many-requests': 'Too many failed login attempts, please try again later',
    });
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
              password: FormikWrapper.PasswordField,
              // password: {
              //   type: 'password', labelText: 'Password', required: true, initialValue: '',
              // },
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
