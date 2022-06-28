/* eslint-disable no-nested-ternary */
import React from 'react';
import Popover, { PopoverProps } from '@mui/material/Popover';
import { Button, ClickAwayListener } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type Props = {
  confirmMessage: string;
  children: (onConfirm: () => void) => any;
  onOpenChanged?: (opened: boolean) => void;
} & Omit<PopoverProps, 'children'>;

export default function ConfirmPopover({
  open: propsOpen, children, onOpenChanged, ...props
}: Props) {
  const [confirm, setConfirm] = React.useState(false);
  const [open, setOpen] = React.useState(propsOpen);

  React.useEffect(() => setOpen(propsOpen), [propsOpen]);
  React.useEffect(() => {
    if (onOpenChanged) onOpenChanged(open);
  }, [open, onOpenChanged]);

  const handleClose = () => {
    setOpen(false);
    setConfirm(false);
  };

  return (
    <Popover
      open={open}
      {...props}
    >
      <ClickAwayListener
        onClickAway={handleClose}
      >
        {confirm ? (
          <div>
            <CheckCircleIcon />
            {props.confirmMessage}
            <Button
              onClick={handleClose}
            >Done
            </Button>
          </div>
        ) : typeof children === 'function' ? children(() => setConfirm(true)) : children}
      </ClickAwayListener>
    </Popover>
  );
}

ConfirmPopover.defaultProps = {
  onOpenChanged: undefined,
};
