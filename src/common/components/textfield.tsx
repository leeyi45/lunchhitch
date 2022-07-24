import React from 'react';
import MUITextField, { TextFieldProps as MUITextFieldProps } from '@mui/material/TextField';

export type TextFieldProps = {
  onEscape?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
  onEnter?: (e: React.KeyboardEvent<HTMLDivElement>) => void;
} & MUITextFieldProps;

export default function TextField({
  onEscape, onEnter, onKeyUp, ...props
}: TextFieldProps) {
  return (
    <MUITextField
      onKeyUp={(event) => {
        if (onKeyUp) onKeyUp(event);

        if (event.key === 'Enter' && onEnter) {
          onEnter(event);
        } else if (event.key === 'Escape' && onEscape) {
          onEscape(event);
        }
      }}
      {...props}
    />
  );
}

TextField.defaultProps = {
  onEscape: undefined,
  onEnter: undefined,
};
