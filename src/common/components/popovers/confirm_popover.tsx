import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import ClickAwayPopover from './clickaway_popover';
import { usePopover } from './linked_popovers';
import { PopoverProps } from './popover';

export type ConfirmPopoverProps = {
  confirmButton?: boolean | string | React.ComponentType<ButtonProps>;
  confirmAction?: () => void;
  cancelButton?: boolean | string | React.ComponentType<ButtonProps>;
  cancelAction?: () => void;
  name: string;
} & Omit<PopoverProps, 'open'>;

/**
 * A popover that comes with confirm and cancel buttons. THis popover must be used with
 * a popover context
 */
export default function ConfirmPopover({
  name, confirmButton, confirmAction, cancelButton, cancelAction, children, ...props
}: ConfirmPopoverProps) {
  const [state, setState] = usePopover(name);
  const confirmProps: ButtonProps = {
    ...(typeof confirmButton === 'object' ? confirmButton as ButtonProps : { children: typeof confirmButton === 'string' ? confirmButton : 'Confirm' }),
    onClick: () => {
      try {
        if (confirmAction) confirmAction();
      } finally {
        setState(false);
      }
    },
    color: 'success',
  };

  const cancelProps: ButtonProps = {
    ...(typeof cancelButton === 'object' ? cancelButton as ButtonProps : { children: typeof cancelButton === 'string' ? cancelButton : 'Cancel' }),
    onClick: () => {
      try {
        if (cancelAction) cancelAction();
      } finally {
        setState(false);
      }
    },
    color: 'error',
  };

  return (
    <ClickAwayPopover open={state} {...props}>
      {typeof children === 'function' ? children(setState) : children}
      {confirmButton || cancelButton ? (
        <Stack direction="row">
          {confirmButton ? (<Button {...confirmProps} />) : undefined}
          {cancelButton ? (<Button {...cancelProps} />) : undefined}
        </Stack>
      ) : undefined}
    </ClickAwayPopover>
  );
}

ConfirmPopover.defaultProps = {
  confirmButton: true,
  confirmAction: undefined,
  cancelButton: true,
  cancelAction: undefined,
};
