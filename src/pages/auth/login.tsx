import React from 'react';
import * as yup from 'yup';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Link from 'next/link';
import {
  Form, Formik,
} from 'formik';
import { useRouter } from 'next/router';
import { signIn, SignInResponse, useSession } from 'next-auth/react';
import { firebaseErrorHandler } from '../../firebase';
import PasswordField from '../../common/formik_wrapper/password_field';

export default function LoginPage() {
  const router = useRouter();
  const { status } = useSession();

  if (status === 'authenticated') {
    const redirectUrl = router.query.callbackUrl;
    if (redirectUrl === undefined) router.push('/profile');
    else if (typeof redirectUrl === 'string') router.push(redirectUrl);
    else router.push(redirectUrl[0]);
  }

  const [loginError, setLoginError] = React.useState<string | null>(null);

  return (
    <div style={{
      flexDirection: 'column',
      alignContent: 'center',
    }}
    >
      <div style={{ background: '#50C878' }}>
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
        border: '5px solid #50C878',
      }}
      >
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validateOnMount={false}
          validationSchema={yup.object({
            username: yup.string().required('Username is required!'),
            password: yup.string().required('Password is required!'),
          })}
          onSubmit={async (values, actions) => {
            try {
              const result = await signIn('credentials', { ...values, redirect: false }) as unknown as SignInResponse;

              if (!result.ok) throw result.error;
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {loginError || Object.values(errors).at(0)}<br />
                Username
                <TextField
                  type="text"
                  value={values.username}
                  variant="standard"
                  onChange={(event) => formik.setFieldValue('username', event.target.value)}
                  onBlur={formik.handleBlur}
                  error={!!errors.username && formik.touched.username}
                />
                Password
                <PasswordField
                  variant="standard"
                  value={values.password}
                  onChange={(event) => formik.setFieldValue('password', event.target.value)}
                  onBlur={formik.handleBlur}
                  error={!!errors.password && formik.touched.password}
                />
                <Button
                  type="submit"
                  disabled={formik.isSubmitting}
                >Sign In
                </Button>
              </div>
            </Form>
          )}
        </Formik>
        <Link href="/auth/signup">Sign Up</Link>
        <Link href="/auth/reset">Forgot your password?</Link>
      </div>
    </div>
  );
}
