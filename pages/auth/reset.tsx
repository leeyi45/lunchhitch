import {
  EmailAuthProvider,
  reauthenticateWithCredential, sendPasswordResetEmail, updatePassword, User,
} from '@firebase/auth';
import { Button } from '@material-ui/core';
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

        // Do nothing if the email wasn't registered
        if (error.code === 'auth/user-not-found') return;
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

  const [resetDone, setResetDone] = React.useState(false);
  const [resetError, setResetError] = React.useState<string | null>(null);

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
        setResetDone(true);
      } catch (error: any) {
        // TODO Error handling
        if (error.code === 'auth/wrong-password') {
          oldPassRef.current!.value = '';
          setResetError('Incorrect password');
        }
      }
    })();
  };

  return resetDone ? <p>Password successfully changed!</p>
    : (
      <>
        {resetError}
        <LabelledInput type="password" ref={oldPassRef} label="Existing Password" />
        <LabelledInput type="password" ref={passwordRef} label="New Password" />
        <LabelledInput type="password" ref={repeatPassRef} label="Repeat Password" />
        <Button onClick={resetCallback}>Reset my password</Button>
      </>
    );
}

// eslint-disable-next-line react/function-component-definition
const ResetPage = () => (FIREBASE_AUTH.currentUser ? <NoUserResetPage /> : <UserResetPage user={FIREBASE_AUTH.currentUser!} />);
export default ResetPage;
