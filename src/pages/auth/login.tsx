import React from 'react';
import * as yup from 'yup';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import {
  Field,
  FieldProps,
  Form, Formik,
} from 'formik';
import { useRouter } from 'next/router';
import { Button, InputAdornment, TextField } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { signIn } from '../../auth/auth';
import { RedirectOnAuth } from '../../common/auth_wrappers';
import { firebaseErrorHandler } from '../../firebase';

export default function LoginPage() {
  const router = useRouter();

  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <RedirectOnAuth redirect="/profile">
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
          {loginError}
          <Formik
            initialValues={{
              username: '',
              password: '',
            }}
            validateOnChange={false}
            validateOnBlur={false}
            validationSchema={yup.object({
              username: yup.string().required(),
              password: yup.string().required(),
            })}
            onSubmit={async (values, actions) => {
              try {
                const result = await signIn(values);

                if (!result.ok) throw result.error;
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
                  Username
                  <TextField
                    type="text"
                    value={values.username}
                    variant="standard"
                    onChange={(event) => formik.setFieldValue('username', event.target.value)}
                    onBlur={formik.handleBlur}
                    error={errors.username !== null}
                  />
                  Password
                  <Field
                    name="password"
                  >
                    {({ field }: FieldProps) => (
                      <TextField
                        variant="standard"
                        type={showPassword ? 'text' : 'password'}
                        value={field.value}
                        onChange={(event) => formik.setFieldValue('password', event.target.value)}
                        onBlur={field.onBlur}
                        error={errors.password !== null}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">
                              <Button
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </Button>
                            </InputAdornment>),
                        }}
                      />
                    )}
                  </Field>
                  <Button
                    type="submit"
                    disabled={formik.isSubmitting || errors.password !== undefined || errors.username !== undefined}
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
    </RedirectOnAuth>
  );
}
