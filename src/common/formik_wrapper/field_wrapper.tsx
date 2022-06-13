import { Popper, Box, Fade } from '@material-ui/core';
import { ErrorMessage, Field, FieldProps } from 'formik';
import React from 'react';

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

  /**
   * Hint Element. If a string is provided, display the given string in a Popper
   * Else, if a React component is provided, display that instead
   */
  hint?: any;
};

/**
 * Wrapper around Formik fields, error message and label
 */
export default function FieldWrapper({
  fieldName, labelText, type, hint,
}: FieldWrapperProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLInputElement | null>(null);
  const handleOpen = (target: HTMLInputElement) => setAnchorEl(target);
  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <label>{labelText}</label>
      <ErrorMessage name={fieldName} />
      <Field
        style={{ width: '100%' }}
        name={fieldName}
      >
        {({ field: { onBlur, ...fieldProps } }: FieldProps) => (
          <input
            type={type}
            {...fieldProps}
            onFocus={(event) => handleOpen(event.target as HTMLInputElement)}
            onBlur={(event) => {
              handleClose();
              onBlur(event);
            }}
            onMouseEnter={(event) => handleOpen(event.target as HTMLInputElement)}
            onMouseLeave={handleClose}
          />
        )}
      </Field>
      { hint !== undefined
        ? (
          <Popper
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            transition
          >
            {({ TransitionProps }) => (
              <Fade
                {...TransitionProps}
                timeout={{
                  enter: 350,
                  exit: 0,
                }}
              >
                {typeof hint === 'string' ? (
                  <Box sx={{ border: 1, p: 1, bgcolor: 'background.paper' }}>
                    {hint}
                  </Box>
                ) : hint}
              </Fade>
            )}
          </Popper>
        )
        : undefined}
    </>
  );
}

FieldWrapper.defaultProps = {
  hint: undefined,
};
