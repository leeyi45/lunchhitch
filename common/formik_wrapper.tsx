/* eslint-disable no-unused-vars */
import React from 'react';
import {
  Formik, Field, FormikHelpers, ErrorMessage, Form,
} from 'formik';
import { Button } from '@material-ui/core';

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
        fieldName: string]: {
          /**
           * Type of the field
           */
          type: 'text' | 'password';
          /**
           * Text to display above the field
           */
          labelText: string;
          /**
           * Initial value of the field
           */
          initialValue: string;
          /**
           * Boolean value indicating if the field can be left empty
           */
          required: boolean;
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
    buttonText?: string;
};

export type FieldWrapperProps = {
  /**
   * Identifier to use internally with the Formik object
   */
  fieldName: string;
  /**
   * Text to display above the field
   */
  labelText: string;
  /**
   * Field type
   */
  type: 'text' | 'password';
};

/**
 * Wrapper around Formik fields, error message and label
 */
export function FieldWrapper({ fieldName, labelText, type }: FieldWrapperProps) {
  return (
    <>
      <label>{labelText}</label>
      <ErrorMessage name={fieldName} />
      <Field name={fieldName} type={type} />
    </>
  );
}

/**
 * Wrapper around a Formik object to ease initialization
 */
export default function FormikWrapper<Values extends FormikWrapperValues, Errors extends FormikWrapperErrors>({
  buttonText, fields, onSubmit, preValidate, resetButton,
}: FormikWrapperProps<Values, Errors>) {
  const initialValues = Object.entries(fields).reduce((res: any, [name, field]) => {
    res[name] = field.initialValue;
    return res;
  }, {} as Values);

  const validateCallback = (values: Values) => Object.entries(fields).reduce((res: any, [name, field]) => {
    if (!values[name] && field.required) res[name] = `${field.labelText} Required`;
    return res;
  }, preValidate ? preValidate(values) : {} as Errors) as Errors;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validate={validateCallback}
    >
      {({ resetForm, isSubmitting }) => (
        <Form>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          >
            { Object.entries(fields).map(([name, field]) => (
              <FieldWrapper fieldName={name} labelText={field.labelText} type={field.type} />
            ))}
            {
              (resetButton || buttonText)
                ? (
                  <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                  }}
                  >
                    {buttonText ? <Button type="submit" disabled={isSubmitting}>{buttonText}</Button> : undefined}
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
  buttonText: undefined,
  preValidate: undefined,
  resetButton: true,
};
