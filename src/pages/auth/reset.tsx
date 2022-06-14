import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential, sendPasswordResetEmail, updatePassword, User,
} from '@firebase/auth';
import { FormikHelpers } from 'formik';
import React from 'react';
import FormikWrapper from '../../common/formik_wrapper/formik_wrapper';
import { FIREBASE_AUTH } from '../../firebase';
// import prisma from '../../prisma';

function NoUserResetPage() {
  const [emailSent, setEmailSent] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);

  const emailCallback = async ({ email }: { email: string }) => {
    try {
      // Check with the database if the email is stored in it
      // const userResult = await prisma.userInfo.findFirst({
      //   where: {
      //     email,
      //   },
      // });

      // if (userResult) await sendPasswordResetEmail(FIREBASE_AUTH, email);
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
        <FormikWrapper
          fields={{
            email: {
              type: 'text', labelText: 'Email', required: true, initialValue: '',
            },
          }}
          onSubmit={emailCallback}
          submitButtonText="Send Reset Email"
        />
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

/**
 * Password reset page displayed to logged in users
 */
function UserResetPage({ user }: { user: User }) {
  const [resetDone, setResetDone] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);

  const validateCallback = ({ newPass, repeatPass }: UserResetFormValues) => {
    const errors: UserResetFormErrors = {};

    if (newPass !== repeatPass) {
      errors.repeatPass = 'Password does not match';
    }
    return errors;
  };

  const submitCallback = async ({ oldPass, newPass }: UserResetFormValues, actions: FormikHelpers<UserResetFormValues>) => {
    try {
      await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email!, oldPass));
      await updatePassword(user, newPass);
      setResetDone(true);
    } catch (error: any) {
      // TODO Error handling
      if (error.code === 'auth/wrong-password') {
        actions.resetForm();
        setResetError('Incorrect password');
      }
    }
  };

  return resetDone ? <p>Password successfully changed!</p>
    : (
      <>
        {resetError}
        <FormikWrapper
          fields={{
            oldPass: {
              labelText: 'Current Password', initialValue: '', required: true, type: 'text',
            },
            newPass: {
              labelText: 'New Password', initialValue: '', required: true, type: 'text',
            },
            repeatPass: {
              labelText: 'Repeat New Password', initialValue: '', required: true, type: 'text',
            },
          }}
          preValidate={validateCallback}
          onSubmit={submitCallback}
        />
      </>
    );
}

/**
 * Password reset page
 */
export default function ResetPage() {
  const [user, setUser] = React.useState<User | null>(null);
  onAuthStateChanged(FIREBASE_AUTH, setUser);

  return user ? <UserResetPage user={user} /> : <NoUserResetPage />;
}
