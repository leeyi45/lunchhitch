import React from 'react';
import {
  FormikHelpers,
} from 'formik';
import { RedirectOnAuth } from '../../common/auth_wrappers';
import Redirecter from '../../common/redirecter';
import { signUp } from '../../auth';
import FormikWrapper from '../../common/formik_wrapper';

type SignUpFormValues = {
  name: string;
  email: string;
  username: string;
  password: string;
  repeatPass: string;
};

export default function SignUpPage() {
  const [signUpError, setSignupError] = React.useState('');
  const [signUpSuccess, setSignUpSuccess] = React.useState(false);

  const submitCallback = async (values : SignUpFormValues, actions: FormikHelpers<SignUpFormValues>) => {
    actions.setSubmitting(true);
    try {
      await signUp(values.username, values.password, values.name, values.email);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        setSignupError('An account with this username already exists');
      } else {
        // TODO redirect to error page

      }
      return;
    }
    setSignUpSuccess(true);
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
            <>
              {signUpError}
              <FormikWrapper
                fields={{
                  name: {
                    initialValue: '', type: 'text', labelText: 'Name', required: true,
                  },
                  email: {
                    initialValue: '', type: 'text', labelText: 'Email', required: true,
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
                preValidate={(values: any) => {
                  if (values.password !== values.repeatPass) {
                    return { password: 'Passwords did not match!' };
                  }
                  return {};
                }}
                submitButtonText="Sign Up"
              />
            </>
          )
      }
    </RedirectOnAuth>
  );
}
