import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MUITextField, { TextFieldProps } from '@mui/material/TextField';
import { useField } from 'formik';

type TextFieldWrapperProps = {
  name: string;
} & Omit<TextFieldProps, 'error' | 'value'>;

export const TextField = ({ onChange, onBlur, ...props }: TextFieldWrapperProps) => {
  const [field, meta] = useField(props.name);

  return (
    <MUITextField
      onChange={(event) => {
        field.onChange(event);
        if (onChange) onChange(event);
      }}
      onBlur={(event) => {
        field.onBlur(event);
        if (onBlur) onBlur(event);
      }}
      value={field.value}
      error={meta.touched && !!meta.error}
      {...props}
    />
  );
};

type PasswordFieldProps = Omit<TextFieldWrapperProps, 'type' | 'InputProps'>;

export const PasswordField = (props: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <TextField
      {...props}
      type={showPassword ? 'text' : 'password'}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <Button
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
            </Button>
          </InputAdornment>),
      }}
    />
  );
};
