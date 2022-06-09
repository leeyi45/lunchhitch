import {
  EmailAuthProvider,
  reauthenticateWithCredential, sendPasswordResetEmail, updatePassword, User,
} from '@firebase/auth';
import { Button } from '@material-ui/core';
import { useRouter } from 'next/router';
import React from 'react';
import { useTextRef } from '../../common';
import LabelledInput from '../../common/labelled_input';
import { FIREBASE_AUTH } from '../../firebase';

function NoUserResetPage() {
  const [emailSent, setEmailSent] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);
  const emailRef = useTextRef();

  const emailCallback = () => {
    if (!emailRef.current) return;

    const email = emailRef.current.value.trim();
    if (!email) {
      setResetError('Email field cannot be blank');
      return;
    }

    sendPasswordResetEmail(FIREBASE_AUTH, email)
      .then(() => setEmailSent(true))
      .catch((error) => {
        // TODO Error handling
      });
  };

  return emailSent ? (
    <p>A reset email has been sent to the provided email if there is an account associated with it</p>
  )
    : (
      <>
        <p>Enter your email</p>
        <input type="text" />
        <Button onClick={emailCallback}>Confirm</Button>
        {resetError}
      </>
    );
}

function UserResetPage({ user }: { user: User }) {
  const [oldPassRef, passwordRef, repeatPassRef] = useTextRef(3);
  const router = useRouter();

  const [resetDone, setResetDone] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (resetDone) {
      // Automatically redirect the user to their home page
      // 5 seconds after successfull reset
      setTimeout(() => router.push('./index'), 5000);
    }
  }, [resetDone]);

  const resetCallback = () => {
    if (!oldPassRef.current || !passwordRef.current || !repeatPassRef.current) return;

    const newPass = passwordRef.current.value;
    const repeatPass = repeatPassRef.current.value;

    if (newPass !== repeatPass) {
      oldPassRef.current.value = '';
      setResetError('Passwords do not match!');
      return;
    }

    const oldPass = oldPassRef.current.value;

    (async () => {
      try {
        await reauthenticateWithCredential(user, EmailAuthProvider.credential(user.email!, oldPass));
        await updatePassword(user, newPass);
      } catch (error) {
        // TODO Error handling
      }
    })().then(() => setResetDone(true));
  };

  return resetDone ? <p>Password successfully changed!</p>
    : (
      <>
        {resetError}
        <LabelledInput type="password" ref={oldPassRef} label="Existing Password" />
        <LabelledInput type="password" ref={passwordRef} label="New Password" />
        <LabelledInput type="password" ref={repeatPassRef} label="New Password" />
        <Button onClick={resetCallback}>Reset my password</Button>
      </>
    );
}

// eslint-disable-next-line react/function-component-definition
const ResetPage = () => (FIREBASE_AUTH.currentUser ? <NoUserResetPage /> : <UserResetPage user={FIREBASE_AUTH.currentUser!} />);
export default ResetPage;
