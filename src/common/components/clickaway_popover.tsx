import React from 'react';
import ClickAwayListener, { ClickAwayListenerProps } from '@mui/material/ClickAwayListener';
import Popover, { PopoverProps } from '@mui/material/Popover';

type Props = PopoverProps & {
  children: ClickAwayListenerProps['children']
  onOpenChanged?: (opened: boolean) => void;
}

/**
 * A popover that closes when the user clicks outside of it
 */
export default function ClickAwayPopover({
  children, open: propsOpen, onOpenChanged, ...props
}: Props) {
  const [open, setOpen] = React.useState(propsOpen);

  React.useEffect(() => setOpen(propsOpen), [propsOpen]);
  React.useEffect(() => {
    if (onOpenChanged) onOpenChanged(open);
  }, [onOpenChanged, open]);

  return (
    <Popover
      open={open}
      {...props}
    >
      <ClickAwayListener
        onClickAway={() => setOpen(false)}
      >
        {children}
      </ClickAwayListener>
    </Popover>
  );
}

ClickAwayPopover.defaultProps = {
  onOpenChanged: undefined,
};
