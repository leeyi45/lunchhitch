import React from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { useField } from 'formik';

type Props = Omit<TextFieldProps, 'type' | 'InputProps'> & { name: string; };

export default function PasswordField(props: Props) {
  const [showPassword, setShowPassword] = React.useState(false);
  const [field, meta, helpers] = useField(props.name);

  return (
    <TextField
      {...props}
      onChange={(event) => helpers.setValue(event.target.value)}
      onBlur={field.onBlur}
      error={meta.touched && !!meta.error}
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
}
