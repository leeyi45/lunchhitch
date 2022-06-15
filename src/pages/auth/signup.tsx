import React from 'react';
import {
  FormikHelpers,
} from 'formik';
import { RedirectOnAuth } from '../../common/auth_wrappers';
import Redirecter from '../../common/redirecter';
import { signUp } from '../../auth';
import FormikWrapper from '../../common/formik_wrapper/formik_wrapper';

type SignUpFormValues = {
  displayName: string;
  email: string;
  username: string;
  password: string;
  repeatPass: string;
};

export default function SignUpPage() {
  const [signUpSuccess, setSignUpSuccess] = React.useState(false);

  const submitCallback = async (values : SignUpFormValues) => {
    await signUp(values);
    setSignUpSuccess(true);
  };

  const errorCallback = (error: any, actions: FormikHelpers<SignUpFormValues>) => {
      actions.setFieldValue('password', '', false);
      actions.setFieldValue('repeatPass', '', false);

      if (error.code === 'auth/email-already-exists') return 'An account with this username already exists';

      return `Unknown error: ${error}`;
  };

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
                onSubmit={submitCallback}
                onSubmitError={errorCallback}
                preValidate={({ password, repeatPass }) => {
                  if (password !== repeatPass) {
                    return { password: 'Passwords did not match!' };
                  }
                  return {};
                }}
                submitButtonText="Sign Up"
              />
          )
      }
    </RedirectOnAuth>
  );
}
