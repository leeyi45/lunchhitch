import React from 'react';
import {
  EmailAuthProvider,
  reauthenticateWithCredential, sendPasswordResetEmail, updatePassword,
} from '@firebase/auth';
import Button from '@mui/material/Button';
import { Form, Formik } from 'formik';
import Link from 'next/link';
import * as yup from 'yup';

import { LunchHitchUser } from '../../../auth';
import AuthSelector from '../../../common/auth_selector';
import FormikWrapper from '../../../common/formik_wrapper/formik_wrapper';
import PasswordField from '../../../common/formik_wrapper/password_field';
import NavBar from '../../../common/navbar';
import { FIREBASE_AUTH, firebaseErrorHandler } from '../../../firebase';

import style from './ResetPage.module.css';

function NoUserResetPage() {
  const [emailSent, setEmailSent] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);

  const emailCallback = async ({ email }: { email: string }) => {
    try {
      const userResult = await fetch('/api/prisma?collection=userInfo&method=findFirst', {
        method: 'POST',
        body: JSON.stringify({
          where: {
            email,
          },
        }),
      });

      if (userResult) await sendPasswordResetEmail(FIREBASE_AUTH, email);
      setEmailSent(true);
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') setResetError(`Unknown error occurred: ${error.code}`);
    }
  };

  return emailSent ? (
    <>
      <p style={{ fontSize: '30px' }}>A reset email has been sent to the provided email if there is an account associated with it</p>
      <Link href="./auth/login">Back to Login</Link>
    </>
  )
    : (
      <>
        {resetError}
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
          <p style={{ color: '#50C878', fontSize: '20px' }}>Enter your email and we&apos;ll send you a link to reset your password.</p>
          <FormikWrapper
            fields={{
              email: {
                type: 'text', labelText: 'Email', required: true, initialValue: '',
              },
            }}
            onSubmit={emailCallback}
            submitButtonText="Send Reset Email"
          />
          <Link href="/auth/login">Back to Login</Link>
        </div>
      </>
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
function UserResetPage({ user }: { user: LunchHitchUser }) {
  const [resetDone, setResetDone] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);

  const submitCallback = async ({ oldPass, newPass }: UserResetFormValues) => {
    try {
      const currentUser = FIREBASE_AUTH.currentUser!;
      await reauthenticateWithCredential(currentUser, EmailAuthProvider.credential(user.email!, oldPass));
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

/**
 * Password reset page
 */
export default function ResetPage() {
  return (
    <AuthSelector
      unauthenticated={(
        <div>
          <NavBar />
          <NoUserResetPage />
        </div>
      )}
    >
      {(user) => (
        <>
          <NavBar user={user} />
          <UserResetPage user={user} />
        </>
      )}
    </AuthSelector>
  );
}
