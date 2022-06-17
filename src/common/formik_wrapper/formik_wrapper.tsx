/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Formik, FormikHelpers, Form } from 'formik';
import { Button, ButtonProps } from '@mui/material';
import FieldWrapper, { FieldWrapperProps } from './field_wrapper';

type FormikWrapperValues = {
  [name: string]: string;
};

type FieldConfig = Omit<FieldWrapperProps, 'fieldName'> & {
  /**
   * Set this value to undefined if this field isn't required\
   * Set this value to `true` to display the default error message when the field wasn't filled
   * Set this value to a string to display a custom error message when the field isn't filled
   */
  required?: boolean | string;

  /**
   * The initial value of the field
   */
  initialValue: any;
}

export type FormikWrapperProps<Values extends FormikWrapperValues> = {
    fields: { [K in keyof Values]: FieldConfig };
    /**
     * Submission callback
     */
    onSubmit: (values: Values, action: FormikHelpers<Values>) => Promise<void> | void;

    /**
     * Validation callback called before the internal validation callback that checks for empty fields
     */

    preValidate?: (values: Values) => Partial<Values>;

    /**
     * Boolean value indicating if a form reset button should be displayed
     */
    resetButton?: boolean;

    /**
     * Callback called to convert an error object to a submission error value that is displayed above the form
     */
    onSubmitError?: (error: any, actions: FormikHelpers<Values>) => any;
    submitButtonText?: ButtonProps | string;

    /**
     * Set to true if fields should be validated when they lose focus
     */
    validateOnBlur?: boolean;

    /**
     * Set to true if fields should be validated every time their value changes
     */
    validateOnChange?: boolean;
};

/**
 * Wrapper around a Formik object to ease initialization
 */
function FormikWrapper<Values extends FormikWrapperValues>({
  submitButtonText, fields, onSubmit, onSubmitError, preValidate, resetButton,
  validateOnBlur, validateOnChange,
}: FormikWrapperProps<Values>) {
  const [submitError, setSubmitError] = React.useState<any | null>(null);

  // Not sure if i should leave useMemo here
  const initialValues = React.useMemo(
    () => Object.entries(fields).reduce((res: any, [name, field]) => {
      res[name] = field.initialValue;
      return res;
    }, {} as Values),
    [fields],
  );

  const fieldElements = React.useMemo(() => Object.entries(fields).map(([name, { labelText, type, hint }]) => (
    <FieldWrapper key={name} fieldName={name} labelText={labelText} type={type} hint={hint} />
  )), [fields]);

  const validateCallback = (values: Values) => Object.entries(fields).reduce((res, [name, { required, labelText }]) => {
    if (!values[name] && required) (res as any)[name] = typeof required === 'string' ? required : `${labelText} Required`;
    return res;
  }, preValidate ? preValidate(values) : {} as Partial<Values>);

  const submitCallback = async (values: Values, actions: FormikHelpers<Values>) => {
    try {
      const result = onSubmit(values, actions);

      if (result instanceof Promise) await result;
    } catch (error) {
      if (onSubmitError) setSubmitError(onSubmitError(error, actions));
    }
  };

  return (
    <>
      {submitError}
      <Formik
        initialValues={initialValues}
        onSubmit={submitCallback}
        validate={validateCallback}
        validateOnBlur={validateOnBlur}
        validateOnChange={validateOnChange}
      >
        {({ resetForm, isSubmitting }) => (
          <Form>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              height: '100%',
            }}
            >
              {fieldElements}
              {
                (resetButton || submitButtonText)
                  ? (
                    <div style={{
                      display: 'flex',
                      flexDirection: 'row',
                    }}
                    >
                      {submitButtonText === undefined ? undefined
                        : typeof submitButtonText === 'string'
                          ? <Button type="submit" disabled={isSubmitting}>{submitButtonText}</Button>
                          : <Button {...submitButtonText} type="submit" disabled={isSubmitting} />}
                      {resetButton ? <Button onClick={() => resetForm()}>Clear</Button> : undefined}
                    </div>
                  )
                  : undefined
              }
            </div>
          </Form>
        )}
      </Formik>
    </>
  );
}

const passwordField: FieldConfig = {
  type: 'password',
  initialValue: '',
  required: true,
  labelText: 'Password',
};

export default Object.assign(FormikWrapper, {
  PasswordField: passwordField,
});

FormikWrapper.defaultProps = {
  submitButtonText: undefined,
  onSubmitError: undefined,
  preValidate: undefined,
  resetButton: true,
  validateOnBlur: false,
  validateOnChange: false,
};
