import React from 'react';
import { signInWithEmailAndPassword, signOut } from '@firebase/auth';
import {
  Box, Button, Popover,
  Stack, TextField, TextFieldProps,
} from '@mui/material';
import {
  Form, Formik, useField,
} from 'formik';
import * as yup from 'yup';

import { useSession } from '../../auth/auth_provider';
import { FIREBASE_AUTH } from '../../firebase';

type TextFieldWrapperProps = {
  name: string;
} & TextFieldProps;

const TextFieldWrapper = ({ name, ...props }: TextFieldWrapperProps) => {
  const [field, meta, helper] = useField(name);

  return (
    <TextField
      {...props}
      onChange={(event) => helper.setValue(event.target.value)}
      onBlur={(event) => field.onBlur(event)}
      error={Boolean(meta.error) && meta.touched}
    />
  );
};

const objectToThing = (obj: any, indent: number = 0): React.ReactNode => {
  const indentStr = ' '.repeat(indent * 2);
  if (obj === null) return (<p>{indentStr}null</p>);
  else if (obj === undefined) return (<p>{indentStr}undefined</p>);

  return Object.entries(obj).map(([key, value]) => {
    switch (typeof value) {
      case 'number':
      case 'boolean':
      case 'string': return (<p>{indentStr}{key}: {value}</p>);
      case 'undefined': return (<p>{indentStr}{key}: undefined</p>);
      default: {
        return (
          <>
            <p>{indentStr}{key}:</p>
            {objectToThing(value, indent + 1)}
          </>
        );
      }
    }
  });
};

export default function TestLoginPage() {
  const { user } = useSession();
  const [fetchResult, setFetchResult] = React.useState('');

  React.useEffect(() => console.log('user object: ', user), [user]);

  return (
    <Stack
      style={{
        top: '50%',
        left: '55%',
        width: '50%',
        transform: 'translate(-30%, -50%)',
        position: 'absolute',
      }}
      direction="column"
    >
      <h1>This is a test login page</h1>
      <Box
        style={{
          paddingBottom: '10px',
        }}
      >
        User Object: {user?.displayName}
      </Box>
      <Box>
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validationSchema={yup.object({
            username: yup.string().required(),
            password: yup.string().required(),
          })}
          validateOnChange={false}
          validateOnBlur={false}
          onSubmit={({ username, password }) => signInWithEmailAndPassword(FIREBASE_AUTH, `${username}@lunchhitch.firebaseapp.com`, password)}
        >
          {({ isSubmitting, errors }) => (
            <Form>
              <Stack
                style={{
                  width: '30%',
                  height: '30%',
                }}
                direction="column"
              >
                {Object.values(errors).at(0)}
                <TextFieldWrapper
                  style={{
                    paddingTop: '10px',
                    paddingBottom: '10px',
                  }}
                  name="username"
                  variant="standard"
                  label="Username"
                />
                <TextFieldWrapper
                  style={{
                    paddingBottom: '10px',
                  }}
                  name="password"
                  variant="standard"
                  label="Password"
                />
                <Stack direction="row">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                  >
                    Sign In
                  </Button>
                  <Button
                    disabled={!user}
                    onClick={() => signOut(FIREBASE_AUTH)}
                  >
                    Sign Out
                  </Button>
                </Stack>
              </Stack>
            </Form>
          )}
        </Formik>
      </Box>
      <Button
        onClick={async () => {
          const result = await fetch('/api/tester');
          setFetchResult(JSON.stringify(await result.json()));
        }}
      >
        Send test API request
      </Button>
      <Popover
        anchorReference="none"
        open={fetchResult !== ''}
      >
        <div>
          <p>{fetchResult}</p>
          <Button onClick={() => setFetchResult('')}>Close</Button>
        </div>
      </Popover>
    </Stack>
  );
}
