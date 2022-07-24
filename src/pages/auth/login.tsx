import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import {
  Field, FieldProps, Form, Formik,
} from 'formik';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import { signIn } from '../../auth';
import { useSession } from '../../auth/auth_provider';
import Box from '../../common/components/Box';
import NavBar from '../../common/components/navbar';
import TextField from '../../common/components/textfield';
import PasswordField from '../../common/formik_wrapper/password_field';
import { firebaseErrorHandler } from '../../firebase';

type LoginFormValues = {
  username: string;
  password: string;
}

/**
 * Login page for users. If a callback URL is specified in the params, then
 * the user will be redirected to that page when the login is complete. Else
 * the user will automatically be directed to `/profile`
 */
export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  React.useEffect(() => {
    if (status === 'authenticated') {
      const redirectUrl = router.query.callback;
      if (redirectUrl === undefined) router.push('/profile');
      else if (typeof redirectUrl === 'string') router.push(redirectUrl);
      else router.push(redirectUrl[0]);
    }
  }, [status]);

  const [loginError, setLoginError] = React.useState<string | null>(null);

  return (
    <div style={{
      flexDirection: 'column',
      alignContent: 'center',
    }}
    >
      <Head>
        <title>Login to LunchHitch</title>
      </Head>
      <NavBar />
      <Stack
        style={{
          width: '30%',
          left: '35%',
          height: '90%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          paddingBottom: '100px',
          paddingTop: '5%',
        }}
        spacing={2}
      >
        <Box style={{ paddingInline: '30px', paddingTop: '30px' }}>
          <div style={{
            width: '100%',
          }}
          >
            <Typography
              variant="h4"
              component="div"
              style={{
                flexGrow: 1,
                textAlign: 'center',
                fontFamily: 'Raleway',
                color: '#50C878',
                fontWeight: 'bold',
              }}
            >
              Log In to Lunch Hitch
            </Typography>
          </div>
          <Formik<LoginFormValues>
            initialValues={{
              username: '',
              password: '',
            }}
            validateOnMount={false}
            validateOnBlur={false}
            validateOnChange={false}
            validationSchema={yup.object({
              username: yup.string().required('Username is required!'),
              password: yup.string().required('Password is required!'),
            })}
            onSubmit={async (values, { setFieldValue }) => {
              try {
                await signIn(values);
              } catch (error: any) {
                setLoginError(firebaseErrorHandler(error, {
                  'user-not-found': 'Incorrect username or password',
                  'wrong-password': 'Incorrect username or password',
                  'too-many-requests': 'Too many failed login attempts, please try again later',
                }));
              }
              setFieldValue('password', '', false);
            }}
          >
            {({ errors, isSubmitting, submitForm }) => (
              <Form>
                <Stack
                  direction="column"
                  spacing={1.5}
                >
                  <p>{loginError || Object.values(errors).at(0)}</p>
                  <Field name="username">
                    {({ field, meta }: FieldProps<LoginFormValues>) => (
                      <TextField
                        {...field}
                        type="text"
                        label="Username"
                        variant="standard"
                        onEscape={(event) => (event.target as any).blur()}
                        onEnter={submitForm}
                        error={meta.touched && !!meta.error}
                      />
                    )}
                  </Field>
                  <PasswordField
                    variant="standard"
                    label="Password"
                    name="password"
                  />
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >Sign In
                  </Button>
                </Stack>
              </Form>
            )}
          </Formik>
          <div style={{ fontFamily: 'Raleway', textAlign: 'center', padding: '30px' }}>
            <Link href="/auth/signup">Sign Up</Link>
            <p />
            <Link href="/auth/reset">Forgot your password?</Link>
          </div>
        </Box>
      </Stack>
    </div>
  );
}
