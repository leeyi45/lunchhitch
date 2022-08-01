import React from 'react';
import { FormikConfig, FormikProps as OriFormikProps, Formik as OriFormik } from 'formik';
import { Dialog, DialogProps } from '@mui/material';

export type FormikProps<Values> = {
  onSubmitError?: (err: any) => void;
} & FormikConfig<Values>;

export default function Formik<Values>({ onSubmit, onSubmitError, ...props }: FormikProps<Values>) {
  return <OriFormik 
    onSubmit={async (values, actions) => {
      try {
        await onSubmit(values, actions);
      } catch (error) {
        if (onSubmitError)  onSubmitError(error);
      }
    }}
    {...props}
  />
}

type DialogFormikContextType = {
  state: 'initial';
  error: null;
} | {
  state: 'success';
  error: null;
} | {
  state: 'error';
  error: any;
}

const DialogFormikContext = React.createContext<DialogFormikContextType>({
  state: 'initial',
  error: null,
});

type InternalDialogProps = Omit<DialogProps, 'open'>;

export type DialogFormikProps<Values> = {
  children: React.ReactNode | React.ReactNode[] | ((helpers: OriFormikProps<Values>) => (React.ReactNode | React.ReactNode[]));
} & Omit<FormikProps<Values>, 'children'>;

export const DialogFormik = Object.assign(<Values extends { [key: string]: any }>({ onSubmit, onSubmitError, children, ...props }: FormikProps<Values>) => {
  const [state, setState] = React.useState<DialogFormikContextType>({
    state: 'initial',
    error: null,
  })

  return <Formik 
      onSubmit={async (values, actions) => {
        await onSubmit(values, actions);
        setState({
          state: 'success',
          error: null,
        });
      }}
      onSubmitError={(error) => {
        setState({
          state: 'error',
          error,
        })
        if(onSubmitError) onSubmitError(error);
      }}
    {...props}>
      {(formikProps) => (
      <DialogFormikContext.Provider value={state}>
        {typeof children === 'function' ? children(formikProps) : children}
      </DialogFormikContext.Provider>
      )}
    </Formik>
}, {
  Success: (props: InternalDialogProps) => {
    const { state } = React.useContext(DialogFormikContext);

    return <Dialog open={state === 'success'} {...props} />;
  },
  Error: ({ children, ...props }: Omit<InternalDialogProps, 'children'> & {
    children: React.ReactNode | ((error: any) => React.ReactNode)
  }) => {
    const { state, error } = React.useContext(DialogFormikContext);

    return <Dialog open={state === 'error'} {...props}>
      {typeof children === 'function' ? children(error) : children}
      </Dialog>
  },
});