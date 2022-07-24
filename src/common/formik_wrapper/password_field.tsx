import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import { useField } from 'formik';

import TextField, { TextFieldProps } from '../components/textfield';

type Props = Omit<TextFieldProps, 'type' | 'InputProps'> & { name: string, showError?: boolean };

export default function PasswordField({ name, showError, ...props }: Props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [field, meta] = useField(name);

  return (
    <TextField
      {...props}
      {...field}
      onEscape={(event) => (event.target as any).blur()}
      error={meta.touched && !!meta.error}
      type={showPassword ? 'text' : 'password'}
      helperText={showError ? meta.error : undefined}
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
}

PasswordField.defaultProps = {
  showError: false,
};
