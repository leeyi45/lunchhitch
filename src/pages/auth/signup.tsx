import React, { HTMLInputTypeAttribute } from 'react';
import DoneIcon from '@mui/icons-material/Done';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { FirebaseError } from 'firebase/app';
import { Form, Formik, useField } from 'formik';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as yup from 'yup';

import { signUp } from '../../auth';
import { useSession } from '../../auth/auth_provider';
import Box from '../../common/components/Box';
import NavBar from '../../common/components/navbar';
import {
  ConfirmPopover, PopoverContainer, usePopover,
} from '../../common/components/popovers';
import PasswordField from '../../common/formik_wrapper/password_field';
import LoadingScreen from '../../common/loading_screen';

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

/**
 * The actual signup form
 */
const SignUpForm = () => {
  const [signUpError, setSignUpError] = React.useState<string | null>(null);
  const { setState: setPopover } = usePopover('signupSuccess');

  return (
    <Formik
      initialValues={{
        displayName: '',
        email: '',
        username: '',
        phoneNumber: '',
        password: '',
        repeatPass: '',
      }}
      onSubmit={async ({
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        repeatPass, ...values
      }, { setFieldError }) => {
        try {
          await signUp(values);
          setPopover(true);
        } catch (error: any) {
          if (error instanceof FirebaseError) {
            switch ((error as FirebaseError).code) {
              case 'auth/email-already-exists': {
                setFieldError('username', 'An account with this username already exists');
                break;
              }
              default: {
                setSignUpError(`Unknown error: ${error.code}`);
                break;
              }
            }
          } else {
            setSignUpError(`Non FirebaseError error: ${error.toString()}`);
          }
        }
      }}
      validationSchema={yup.object({
        displayName: yup.string().required('Please enter a display name'),
        email: yup.string().email().required('Please enter a valid email'),
        // TODO username validation (stuff like cannot have @s or whatever)
        username: yup.string().required('Please enter a valid username'),
        // TODO add phone number validation
        phoneNumber: yup.string().required('Please enter a valid phone number'),
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
              height: '91%',
              position: 'absolute',
              transform: 'translateX(-50%)',
              width: '40%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            direction="column"
            spacing={1}
          >
            <Box>
              <p style={{
                color: '#50C878', fontSize: '30px', textAlign: 'center',
              }}
              >
                <b>Sign up for a Lunch Hitch account</b>
              </p>
              <Stack
                direction="column"
                spacing={1}
              >
                <Button
                  href="./login"
                  style={{
                    justifyContent: 'left',
                    width: '40%',
                  }}
                >
                  <KeyboardBackspaceIcon />
                  Back To Login
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
                <SignUpField
                  labelText="Phone Number"
                  type="text"
                  name="phoneNumber"
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
              </Stack>
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
            </Box>
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
  const { status } = useSession();
  const router = useRouter();

  if (status === 'authenticated') router.push('/profile');
  else if (status === 'loading') return <LoadingScreen />;

  return (
    <PopoverContainer
      popovers={{
        signupSuccess: false,
      }}
    >
      <Head>
        <title>Sign up for a LunchHitch account!</title>
      </Head>
      <ConfirmPopover
        name="signupSuccess"
        confirmButton={false}
        cancelButton="Close"
        onClickAway={() => router.push('/auth/login')}
      >
        <DoneIcon />
        <p>Successfully signed up!</p>
      </ConfirmPopover>
      <Stack>
        <NavBar />
        <SignUpForm />
      </Stack>
    </PopoverContainer>
  );
}
