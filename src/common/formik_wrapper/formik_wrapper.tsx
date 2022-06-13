/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React from 'react';
import { Formik, FormikHelpers, Form } from 'formik';
import { Button, ButtonProps } from '@material-ui/core';
import FieldWrapper, { FieldWrapperProps } from './field_wrapper';

type FormikWrapperValues = {
    [name: string]: string;
};

type FormikWrapperErrors = {
  [name: string]: string | undefined;
};

export type FormikWrapperProps<Values extends FormikWrapperValues, Errors extends FormikWrapperErrors> = {
    fields: {
        [
        /**
         * Internal name that Formik will use to refer to the field
         */
        fieldName: string]: Omit<FieldWrapperProps, 'fieldName'> & {
          required?: boolean;
          initialValue: any;
        }
    };
    /**
     * Submission callback
     */
    onSubmit: (values: Values, action: FormikHelpers<Values>) => Promise<void> | void;
    /**
     * Validation callback called before the internal validation callback that checks
     * for empty fields
     */
    preValidate?: (values: Values) => Errors;
    /**
     * Boolean value indicating if a form reset button should be displayed
     */
    resetButton?: boolean;
    submitButtonText?: ButtonProps | string;
    validateOnBlur?: boolean;
    validateOnChange?: boolean;
};

/**
 * Wrapper around a Formik object to ease initialization
 */
export default function FormikWrapper<Values extends FormikWrapperValues, Errors extends FormikWrapperErrors>({
  submitButtonText, fields, onSubmit, preValidate, resetButton,
  validateOnBlur, validateOnChange,
}: FormikWrapperProps<Values, Errors>) {
  // Not sure if i should leave useMemo here
  const initialValues = React.useMemo(
    () => Object.entries(fields).reduce((res: any, [name, field]) => {
      res[name] = field.initialValue;
      return res;
    }, {} as Values),
    [fields],
  );

  const fieldElements = React.useMemo(() => Object.entries(fields).map(([name, field]) => (
    <FieldWrapper key={name} fieldName={name} labelText={field.labelText} type={field.type} hint={field.hint} />
  )), [fields]);

  const validateCallback = (values: Values) => Object.entries(fields).reduce((res: any, [name, field]) => {
    if (!values[name] && field.required) res[name] = `${field.labelText} Required`;
    return res;
  }, preValidate ? preValidate(values) : {} as Errors) as Errors;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
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
  );
}

FormikWrapper.defaultProps = {
  submitButtonText: undefined,
  preValidate: undefined,
  resetButton: true,
  validateOnBlur: false,
  validateOnChange: false,
};
