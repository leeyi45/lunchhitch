import React from 'react';
import MUIPopover, { PopoverProps as MUIPopoverProps } from '@mui/material/Popover';

export type PopoverProps = {
  children: React.ReactNode | ((setOpen: (value: boolean) => void) => React.ReactNode);
} & Omit<MUIPopoverProps, 'children'>;

const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(({ open, children, ...props }, ref) => {
  const [state, setState] = React.useState(open);

  React.useEffect(() => setState(open), [open]);
  return (
    <MUIPopover open={state} {...props} ref={ref}>
      {typeof children === 'function' ? children(setState) : children}
    </MUIPopover>
  );
});

Popover.displayName = 'Popover';

export default Popover;
