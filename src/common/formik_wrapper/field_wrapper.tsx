/* eslint-disable react/require-default-props */
import React, { HTMLInputTypeAttribute } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button, InputAdornment, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import Fade from '@mui/material/Fade';
import Popper from '@mui/material/Popper';
import { ErrorMessage, Field, FieldProps } from 'formik';

export type FieldWrapperProps = {
  /**
   * Identifier to use internally with the Formik object
   */
  fieldName: string;

  /**
   * Text to display above the field
   */
  labelText: string;

  placeholder?: string;

  /**
   * Field type
   */
  type: HTMLInputTypeAttribute;

  /**
   * Hint Element. If a string is provided, display the given string in a Popper
   * Else, if a React component is provided, display that instead
   */
  hint?: any;

  renderInput?: (props: FieldProps) => any;
};

/**
 * Wrapper around Formik fields, error message and label
 */
export default function FieldWrapper({
  fieldName, labelText, type, hint, renderInput, placeholder,
}: FieldWrapperProps) {
  const [anchorEl, setAnchorEl] = React.useState<HTMLInputElement | null>(null);
  const focusedRef = React.useRef(false);

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
        {renderInput || (({ field: { onBlur, ...fieldProps } }: FieldProps) => (
          <input
            placeholder={placeholder}
            type={type}
            {...fieldProps}
            onFocus={(event) => {
              focusedRef.current = true;
              handleOpen(event.target as HTMLInputElement);
            }}
            onBlur={(event) => {
              focusedRef.current = false;
              handleClose();
              onBlur(event);
            }}
            onMouseEnter={(event) => handleOpen(event.target as HTMLInputElement)}
            onMouseLeave={() => {
              if (!focusedRef.current) handleClose();
            }}
          />
        ))}
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

export type PasswordFieldProps = {
  fieldName?: string;
  labelText?: string;
  hint?: any;
};

export const PasswordField = ({ fieldName, labelText, hint }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <FieldWrapper
      hint={hint}
      fieldName={fieldName || 'password'}
      labelText={labelText || 'Password'}
      type={showPassword ? 'text' : 'password'}
      renderInput={({ field, form }) => (
        <TextField
          value={field.value}
          onBlur={field.onBlur}
          onChange={(event) => form.setFieldValue(fieldName || 'password', event.target.value)}
          error={form.errors[fieldName || 'password'] !== undefined}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Button onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </Button>
              </InputAdornment>),
          }}
        />
      )}
    />
  );
};
