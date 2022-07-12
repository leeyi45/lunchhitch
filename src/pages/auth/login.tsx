import React from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import { signIn } from '../../auth';
import { useSession } from '../../auth/auth_provider';
import NavBar from '../../common/components/navbar';
import PasswordField from '../../common/formik_wrapper/password_field';
import { firebaseErrorHandler } from '../../firebase';

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
  }, []);

  const [loginError, setLoginError] = React.useState<string | null>(null);

  return (
    <div style={{
      flexDirection: 'column',
      alignContent: 'center',
    }}
    >
      <NavBar />
      <Stack
        style={{
          width: '30%',
          left: '35%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          paddingBottom: '100px',
        }}
        spacing={2}
      >
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
        <Formik
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
          onSubmit={async (values, actions) => {
            try {
              await signIn(values);
              // router.push('/profile');
            } catch (error: any) {
              actions.setFieldValue('password', '');
              setLoginError(firebaseErrorHandler(error, {
                'user-not-found': 'Incorrect username or password',
                'wrong-password': 'Incorrect username or password',
                'too-many-requests': 'Too many failed login attempts, please try again later',
              }));
            }
          }}
        >
          {({ values, errors, ...formik }) => (
            <Form>
              <Stack
                direction="column"
                spacing={1.5}
              >
                {loginError || Object.values(errors).at(0)}<br />
                <TextField
                  type="text"
                  label="Username"
                  value={values.username}
                  variant="standard"
                  onChange={(event) => formik.setFieldValue('username', event.target.value)}
                  onBlur={formik.handleBlur}
                  error={!!errors.username && formik.touched.username}
                />
                <PasswordField
                  variant="standard"
                  label="Password"
                  name="password"
                />
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                >Sign In
                </Button>
              </Stack>
            </Form>
          )}
        </Formik>
        <Link href="/auth/signup">Sign Up</Link>
        <Link href="/auth/reset">Forgot your password?</Link>
      </Stack>
    </div>
  );
}
