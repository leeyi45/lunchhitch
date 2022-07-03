import React, { HTMLInputTypeAttribute } from 'react';
import { useRouter } from 'next/router';
import {
  Form, Formik, useField,
} from 'formik';
import {
  Button, Stack, TextField, TextFieldProps,
} from '@mui/material';
import * as yup from 'yup';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import Redirecter from '../../common/redirecter';
import { signUp } from '../../auth';
// import { firebaseErrorHandler } from '../../firebase';
import { useSession } from '../../auth_provider';
import LoadingScreen from '../../common/auth_selector/loading_screen';
import NavBar from '../../common/navbar';
import PasswordField from '../../common/formik_wrapper/password_field';

type SignupFieldProps = {
  name: string;
  type: HTMLInputTypeAttribute;
  labelText: string;
} & TextFieldProps;

const SignUpField = ({
  name, type, labelText, ...props
}: SignupFieldProps) => {
  const [field, meta, helpers] = useField(name);

  return (
    <TextField
      style={{
        marginTop: '20px',
      }}
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

const SignUpForm = (props: SignUpFormProps) => {
  const router = useRouter();

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
        await signUp(values);
        props.onSubmitSuccess();
      }}
      validationSchema={yup.object({
        displayName: yup.string().required(),
        email: yup.string().email(),
        username: yup.string().required(),
        password: yup.string().required(),
        repeatPass: yup.string().required(),
      })}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {({ resetForm, isSubmitting }) => (
        <Form>
          <Stack
            style={{
              left: '50%',
              position: 'absolute',
              transform: 'translateX(-50%)',
              width: '30%',
            }}
            direction="column"
          >
            <p style={{
              color: '#50C878', fontSize: '30px', lineHeight: '100px', textAlign: 'center',
            }}
            >
              Sign up for a Lunch Hitch account
            </p>
            <Button
              onClick={() => router.push('/auth/login')}
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
