import {
  EmailAuthProvider,
  reauthenticateWithCredential, sendPasswordResetEmail, updatePassword, User,
} from '@firebase/auth';
import {
  ErrorMessage, Field, Form, Formik,
} from 'formik';
import React from 'react';
import { FIREBASE_AUTH } from '../../firebase';

function PasswordField({ label }: { label: string;}) {
  return (
    <>
      <label htmlFor={label}>Current Password</label>
      <Field name={label} type="password" />
      <ErrorMessage name={label} />
    </>
  );
}

function NoUserResetPage() {
  const [emailSent, setEmailSent] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);

  const validateCallback = ({ email }: { email?: string }) => {
    if (!email) {
      return { email: 'Required' };
    }
    return {};
  };
  const emailCallback = async ({ email }: { email: string }) => {
    try {
      await sendPasswordResetEmail(FIREBASE_AUTH, email);
      setEmailSent(true);
    } catch (error: any) {
      if (error.code !== 'auth/user-not-found') setResetError(`Unknown error occurred: ${error.code}`);
    }
  };

  return emailSent ? (
    <p>A reset email has been sent to the provided email if there is an account associated with it</p>
  )
    : (
      <>
        {resetError}
        <Formik
          initialValues={{ email: '' }}
          onSubmit={emailCallback}
          validate={validateCallback}
        >
          <Form>
            <label>Email</label>
            <Field name="email" type="text" />
            <ErrorMessage name="email" />
          </Form>
        </Formik>
      </>
    );
}

type UserResetFormValues = {
    oldPass: string;
    newPass: string;
    repeatPass: string;
};

type UserResetFormErrors = {
    oldPass?: string;
    newPass?: string;
    repeatPass?: string;
}

function UserResetPage({ user }: { user: User }) {
  const [resetDone, setResetDone] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);

  const validateCallback = ({ oldPass, newPass, repeatPass }: UserResetFormValues) => {
    const errors: UserResetFormErrors = {};

    if (!oldPass) errors.oldPass = 'Required';
    if (!newPass) errors.newPass = 'Required';
    if (!repeatPass) errors.repeatPass = 'Required';

    if (newPass !== repeatPass) {
      errors.repeatPass = 'Password does not match';
    }
    return errors;
  };

  const submitCallback = async ({ oldPass, newPass, repeatPass }: UserResetFormValues) => {
    try {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email!, oldPass));
      await updatePassword(user, newPass);
      setResetDone(true);
    } catch (error: any) {
      // TODO Error handling
      if (error.code === 'auth/wrong-password') {
        setResetError('Incorrect password');
      }
    }
  };

  return resetDone ? <p>Password successfully changed!</p>
    : (
      <>
        {resetError}
        <Formik
          initialValues={{ oldPass: '', newPass: '', repeatPass: '' }}
          validate={validateCallback}
          onSubmit={submitCallback}
        >
          <Form>
            <PasswordField label="oldPass" />
            <PasswordField label="newPass" />
            <PasswordField label="repeatPass" />
          </Form>
        </Formik>
      </>
    );
}

// eslint-disable-next-line react/function-component-definition
const ResetPage = () => (FIREBASE_AUTH.currentUser ? <NoUserResetPage /> : <UserResetPage user={FIREBASE_AUTH.currentUser!} />);
export default ResetPage;
