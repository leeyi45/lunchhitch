import React from 'react';
import {
  EmailAuthProvider, reauthenticateWithCredential, updatePassword,
} from '@firebase/auth';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import {
  Field, FieldProps, Form, Formik,
} from 'formik';
import { GetServerSideProps } from 'next';
import Link from 'next/link';
import * as yup from 'yup';

import { fetchApi } from '../../../api_helpers';
import { SessionUserWithProfile } from '../../../common';
import Box from '../../../common/components/Box';
import NavBar from '../../../common/components/navbar';
import PasswordField from '../../../common/formik_wrapper/password_field';
import { FIREBASE_AUTH, firebaseErrorHandler } from '../../../firebase';
import { getSession } from '../../../firebase/admin';
import prisma from '../../../prisma';

import style from './ResetPage.module.css';

function NoUserResetPage() {
  const [emailSent, setEmailSent] = React.useState(false);

  return (
    <div>
      <Box style={{
        display: 'flex',
        flexDirection: 'column',
        width: '35%',
        height: '30%',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        left: '32.5%',
        top: '30%',
      }}
      >
        <p
          style={{
            color: '#50C878',
            fontSize: '21px',
            textAlign: 'center',
          }}
        >{emailSent
          ? 'A reset email has been sent to the provided email if there is an account associated with it'
          : 'Enter your email and we\'ll send you a link to reset your password.'}
        </p>
        <Formik
          initialValues={{
            email: '',
          }}
          onSubmit={async ({ email }, { resetForm }) => {
            try {
              await fetchApi<void>('auth/reset', { email });
            } catch (error) {
              // TODO Error handling
            }
            setEmailSent(true);
            resetForm();
          }}
        >
          {({ resetForm }) => (
            <Form>
              <Field name="email">
                {({ field, meta }: FieldProps<{ email: string }>) => (
                  <TextField
                    placeholder="Email"
                    variant="standard"
                    error={meta.touched && !!meta.error}
                    style={{
                      width: '100%',
                    }}
                    {...field}
                  />
                )}
              </Field>
              <Stack direction="row">
                <Button type="submit">Send Reset Email</Button>
                <Button onClick={() => resetForm()}>Clear</Button>
              </Stack>
            </Form>
          )}
        </Formik>
        <br />
        <Link href="/auth/login">Back to Login</Link>
      </Box>
    </div>
  );
}

type UserResetFormValues = {
  oldPass: string;
  newPass: string;
  repeatPass: string;
};

/**
 * Password reset page displayed to logged in users
 */
function UserResetPage({ user }: { user: SessionUserWithProfile }) {
  const [resetDone, setResetDone] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);

  const submitCallback = async ({ oldPass, newPass }: UserResetFormValues) => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser!;
      await reauthenticateWithCredential(currentUser, EmailAuthProvider.credential(user.email, oldPass));
      await updatePassword(currentUser, newPass);
      setResetDone(true);
    } catch (error: any) {
      setResetError(firebaseErrorHandler(error, { 'wrong-password': 'Incorrect password' }));
    }
  };

  return resetDone ? <p>Password successfully changed!</p>
    : (
      <div id={style.formdiv}>
        <h2
          style={{
            textAlign: 'center',
          }}
        >Password Reset
        </h2>
        <Formik
          initialValues={{
            oldPass: '',
            newPass: '',
            repeatPass: '',
          }}
          onSubmit={submitCallback}
          validationSchema={yup.object({
            oldPass: yup.string().required('Current Password required!'),
            newPass: yup.string().required('New Password Required!'),
            repeatPass: yup.string().required().when(['newPass'], (newPass) => yup.string().test('equality', 'Passwords must match!', (value) => value === newPass)),
          })}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {({ values, errors, ...formik }) => (
            <>
              <p
                style={{
                  fontSize: '18px',
                }}
              >
                {resetError || Object.values(errors).at(0)}
              </p>
              <Form>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <PasswordField
                    className={style.PasswordField}
                    style={{
                      marginTop: '15px',
                    }}
                    label="Current Password"
                    value={values.oldPass}
                    onChange={(event) => formik.setFieldValue('oldPass', event.target.value)}
                    error={Boolean(errors.oldPass)}
                    name="oldPass"
                  />
                  <PasswordField
                    className={style.PasswordField}
                    label="New Password"
                    value={values.newPass}
                    onChange={(event) => formik.setFieldValue('newPass', event.target.value)}
                    error={Boolean(errors.newPass)}
                    name="newPass"
                  />
                  <PasswordField
                    className={style.PasswordField}
                    label="Repeat New Password"
                    value={values.repeatPass}
                    onChange={(event) => formik.setFieldValue('repeatPass', event.target.value)}
                    error={Boolean(errors.repeatPass)}
                    name="repeatPass"
                  />
                  <div>
                    <Button
                      onClick={() => formik.resetForm()}
                    >Clear
                    </Button>
                    <Button type="submit">
                      Reset Password
                    </Button>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    );
}

type PageProps = {
  user: SessionUserWithProfile | null;
}

/**
 * Password reset page
 */
export default function ResetPage({ user }: PageProps) {
  return (
    <Stack>
      <NavBar user={user} />
      {user ? <UserResetPage user={user} /> : <NoUserResetPage />}
    </Stack>
  );
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (ctx) => {
  const username = await getSession(ctx.req.cookies.token);

  if (!username) {
    return {
      props: {
        user: null,
      },
    };
  } else {
    const userInfo = await prisma.userInfo.findFirst({
      where: {
        username,
      },
    });

    if (!userInfo) {
      return {
        props: {
          user: null,
        },
      };
    }

    return {
      props: {
        user: {
          ...userInfo,
          username,
        },
      },
    };
  }
};
