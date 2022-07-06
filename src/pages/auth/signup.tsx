import React, { HTMLInputTypeAttribute } from 'react';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { FirebaseError } from 'firebase/app';
import { Form, Formik, useField } from 'formik';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import { signUp } from '../../auth';
import { useSession } from '../../auth/auth_provider';
import LoadingScreen from '../../common/auth_selector/loading_screen';
import Redirecter from '../../common/components/redirecter';
import PasswordField from '../../common/formik_wrapper/password_field';
import NavBar from '../../common/components/navbar';

type SignupFieldProps = {
  name: string;
  type: HTMLInputTypeAttribute;
  labelText: string;
} & TextFieldProps;

/**
 * Wrapper combining a Formik field and a MUI textfield
 */
const SignUpField = ({
  name, type, labelText, ...props
}: SignupFieldProps) => {
  const [field, meta, helpers] = useField(name);

  return (
    <TextField
      type={type}
      variant="standard"
      label={labelText}
      onChange={(event) => helpers.setValue(event.target.value)}
      onBlur={field.onBlur}
      value={field.value}
      error={meta.touched && !!meta.error}
      {...props}
    />
  );
};

type SignUpFormProps = {
  onSubmitSuccess: () => void;
};

/**
 * The actual signup form
 */
const SignUpForm = (props: SignUpFormProps) => {
  const [signUpError, setSignUpError] = React.useState<string | null>(null);

  return (
    <Formik
      initialValues={{
        displayName: '',
        email: '',
        username: '',
        password: '',
        repeatPass: '',
      }}
      onSubmit={async (values) => {
        try {
          await signUp(values);
          props.onSubmitSuccess();
        } catch (error: any) {
          switch ((error as FirebaseError).code) {
            case 'auth/email-already-exists': {
              setSignUpError('An account with this username already exists');
              break;
            }
            default: {
              setSignUpError(`Unknown error: ${error.code}`);
              break;
            }
          }
        }
      }}
      validationSchema={yup.object({
        displayName: yup.string().required(),
        email: yup.string().email().required(),
        username: yup.string().required(),
        password: yup.string().required(),
        repeatPass: yup.string().required(),
      })}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ resetForm, isSubmitting, errors }) => (
        <Form>
          <Stack
            style={{
              left: '50%',
              position: 'absolute',
              transform: 'translateX(-50%)',
              width: '30%',
            }}
            direction="column"
            spacing={1.5}
          >
            <p style={{
              color: '#50C878', fontSize: '30px', lineHeight: '100px', textAlign: 'center',
            }}
            >
              Sign up for a Lunch Hitch account
            </p>
            <Button
              href="/auth/login"
              style={{
                float: 'left',
                width: '20%',
              }}
            >
              <Stack direction="row">
                <KeyboardBackspaceIcon />
                Back To Login
              </Stack>
            </Button>
            {signUpError || Object.values(errors).at(0)}
            <SignUpField
              labelText="Display Name"
              type="text"
              name="displayName"
            />
            <SignUpField
              labelText="Username"
              type="text"
              name="username"
            />
            <SignUpField
              labelText="Email"
              type="text"
              name="email"
            />
            <PasswordField
              style={{
                marginTop: '20px',
              }}
              label="Password"
              name="password"
              variant="standard"
            />
            <PasswordField
              style={{
                marginTop: '20px',
                marginBottom: '20px',
              }}
              label="Repeat Password"
              name="repeatPass"
              variant="standard"
            />
            <Stack direction="row">
              <Button
                onClick={() => resetForm()}
              >
                Clear Form
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
              >Sign Up
              </Button>
            </Stack>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};

/**
 * Signup page to be displayed to the user
 */
export default function SignUpPage() {
  const [signUpSuccess, setSignUpSuccess] = React.useState(false);
  const { status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') router.push('/profile');
  else if (status === 'loading') return <LoadingScreen />;

  return (
    <Stack>
      <NavBar />
      {signUpSuccess
        ? (
          <Redirecter redirect="/auth/login" duration={5}>
            <p>Sign up successful! Redirecting you to the login page</p>
          </Redirecter>
        )
        : (<SignUpForm onSubmitSuccess={() => setSignUpSuccess(true)} />)}
    </Stack>
  );
}
