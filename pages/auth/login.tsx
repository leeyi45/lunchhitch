import React from 'react';

import { Typography } from '@material-ui/core';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from '@firebase/auth';
import Link from 'next/link';
import {
  FormikHelpers,
} from 'formik';
import { FIREBASE_AUTH } from '../../firebase';
import { Credential, signIn } from '../../auth';
import FormikWrapper from '../../common/formik_wrapper';

export default function LoginPage() {
  const router = useRouter();

  // If the user is logged in already redirect them to the
  // main page
  onAuthStateChanged(FIREBASE_AUTH, (user) => {
    if (user) {
      router.push('./index');
    }
  });

  const [loginError, setLoginError] = React.useState<string | null>(null);

  const submitCallback = async ({ username, password }: Credential, actions: FormikHelpers<Credential>) => {
    try {
      await signIn(username, password);
    } catch (error: any) {
      console.log(error.code);
      switch (error.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password': {
          actions.setFieldValue('password', '', false);
          setLoginError('Incorrect username or password');
          break;
        }
        // eslint-disable-next-line no-lone-blocks
        default: {
          setLoginError('An unexpected error occured');
          break;
        }
      }
    }
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
  );
}
