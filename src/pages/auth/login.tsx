import React from 'react';
import { Typography } from '@material-ui/core';
import Link from 'next/link';
import {
  FormikHelpers,
} from 'formik';
import FormikWrapper from '../../common/formik_wrapper/formik_wrapper';
import { Credential, signIn } from '../../auth';
import { RedirectOnAuth } from '../../common/auth_wrappers';

export default function LoginPage() {
  const [loginError, setLoginError] = React.useState<string | null>(null);

  const submitCallback = async (creds: Credential, actions: FormikHelpers<Credential>) => {
    const result = await signIn(creds);

    if (!result.ok) {
      switch (result.error) {
        case 'auth/user-not-found':
        case 'auth/wrong-password': {
          actions.setFieldValue('password', '', false);
          setLoginError('Incorrect username or password');
          break;
        }
        // eslint-disable-next-line no-lone-blocks
        default: {
          setLoginError(`An unexpected error occured: ${result.error}`);
          break;
        }
      }
    }
  };

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
          {
          loginError === null
            ? null
            : (
              <text fontStyle="color red">
                {loginError}
              </text>
            )
        }
          <FormikWrapper
            fields={{
              username: {
                type: 'text', labelText: 'Username', required: true, initialValue: '',
              },
              password: {
                type: 'text', labelText: 'Password', required: true, initialValue: '',
              },
            }}
            onSubmit={submitCallback}
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
