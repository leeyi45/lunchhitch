import {
  EmailAuthProvider,
  reauthenticateWithCredential, sendPasswordResetEmail, updatePassword, User,
} from '@firebase/auth';
import { FormikHelpers } from 'formik';
import Link from 'next/link';
import React from 'react';
import { LunchHitchUser } from '../../auth';
import { AuthSelector } from '../../common/auth_wrappers';
import FormikWrapper from '../../common/formik_wrapper/formik_wrapper';
import { firebaseErrorHandler, FIREBASE_AUTH } from '../../firebase';

function NoUserResetPage() {
  const [emailSent, setEmailSent] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);

  const emailCallback = async ({ email }: { email: string }) => {
    try {
      const userResult = await fetch(`/api/prisma?collection=userInfo&method=findFirst`, {
        method: 'POST',
        body: JSON.stringify({
          where: {
            email,
          }
        })
      })

      // const userResult = await prismaFetch('userInfo', 'findFirst', {
      //   where: {
      //     email,
      //   }
      // });

      if (userResult) await sendPasswordResetEmail(FIREBASE_AUTH, email);
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
          <p style={{ color: '#50C878', fontSize: '20px' }}>Enter your email and we'll send you a link to reset your password.</p>
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

type UserResetFormErrors = {
    oldPass?: string;
    newPass?: string;
    repeatPass?: string;
}

/**
 * Password reset page displayed to logged in users
 */
function UserResetPage({ user }: { user: LunchHitchUser }) {
  const [resetDone, setResetDone] = React.useState(false);

  const validateCallback = ({ newPass, repeatPass }: UserResetFormValues) => {
    const errors: UserResetFormErrors = {};

    if (newPass !== repeatPass) {
      errors.repeatPass = 'Password does not match';
    }
    return errors;
  };

  const submitCallback = async ({ oldPass, newPass }: UserResetFormValues) => {
    const currentUser = FIREBASE_AUTH.currentUser!;
    await reauthenticateWithCredential(currentUser, EmailAuthProvider.credential(user.email!, oldPass));
    await updatePassword(currentUser, newPass);
    setResetDone(true);
  };

  const errorCallback = (error: any, actions: FormikHelpers<UserResetFormValues>) => {
    actions.resetForm();
    return firebaseErrorHandler(error, { 'wrong-password': 'Incorrect password' });
  };

  return resetDone ? <p>Password successfully changed!</p>
    : (
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
        onSubmitError={errorCallback}
      />
    );
}

/**
 * Password reset page
 */
export default function ResetPage() {
  return (
    <AuthSelector>
      <AuthSelector.Authenticated>
        {(user) => (<UserResetPage user={user} />)}
      </AuthSelector.Authenticated>
      <AuthSelector.Unauthenticated>
        <NoUserResetPage />
      </AuthSelector.Unauthenticated>
    </AuthSelector>
  );
}
