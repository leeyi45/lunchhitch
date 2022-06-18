import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

type Props = {
  tooltip?: any;
  buttonContent: any;
} & ButtonProps;

export default function IconButton({ tooltip, buttonContent, ...props }: Props) {
  const button = (
    <Button {...props}>
      {buttonContent}
    </Button>
  );
  return tooltip ? (<Tooltip title={tooltip}>{button}</Tooltip>) : button;
}

IconButton.defaultProps = {
  tooltip: undefined,
};
