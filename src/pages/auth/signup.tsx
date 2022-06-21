import React from 'react';
import { FormikHelpers } from 'formik';
import Link from 'next/link';
import { RedirectOnAuth } from '../../common/auth_wrappers';
import Redirecter from '../../common/redirecter';
import { signUp } from '../../auth';
import FormikWrapper from '../../common/formik_wrapper/formik_wrapper';
import { firebaseErrorHandler } from '../../firebase';

export default function SignUpPage() {
  const [signUpSuccess, setSignUpSuccess] = React.useState(false);

  return (
    <RedirectOnAuth redirect="./profile">
      {
        signUpSuccess
          ? (
            <Redirecter redirect="/auth/login" duration={5}>
              <p>Sign up successful! Redirecting you to the login page</p>
            </Redirecter>
          )
          : (
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
              <FormikWrapper
                fields={{
                  displayName: {
                    initialValue: '', type: 'text', labelText: 'Name', required: true, hint: 'Name displayed to other users',
                  },
                  email: {
                    initialValue: '', type: 'text', labelText: 'Email', required: true, hint: 'Email associated with this account',
                  },
                  username: {
                    initialValue: '', type: 'text', labelText: 'Username', required: true,
                  },
                  password: {
                    initialValue: '', type: 'text', labelText: 'Password', required: true,
                  },
                  repeatPass: {
                    initialValue: '', type: 'text', labelText: 'Repeat Password', required: true,
                  },
                }}
                onSubmit={async (values) => {
                  await signUp(values);
                  setSignUpSuccess(true);
                }}
                onSubmitError={(error, actions) => {
                  actions.setFieldValue('password', '', false);
                  actions.setFieldValue('repeatPass', '', false);

                  return firebaseErrorHandler(error, {
                    'email-already-exists': 'An account with this username already exists',
                  });
                }}
                preValidate={({ password, repeatPass }) => {
                  if (password !== repeatPass) {
                    return { password: 'Passwords did not match!' };
                  }
                  return {};
                }}
                submitButtonText="Sign Up"
              />
              <Link href="/auth/login">Back to Login</Link>
            </div>
          )
      }
    </RedirectOnAuth>
  );
}
