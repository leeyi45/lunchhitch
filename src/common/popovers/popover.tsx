import React from 'react';
import MUIPopover, { PopoverProps as MUIPopoverProps } from '@mui/material/Popover';

export type PopoverProps = {
  /**
   * Content of the component
   */
  children: React.ReactNode | ((setOpen: (value: boolean) => void) => React.ReactNode);
  /**
   * Determines which anchor prop to refer to when setting the position of the popover
   */
  anchorReference?: MUIPopoverProps['anchorReference'];
  style?: MUIPopoverProps['style'];
  /**
   * Automatically pad the content of the Popover with 10px of padding on all sides
   */
  autoPad?: boolean;
} & Omit<MUIPopoverProps, 'children' | 'anchorReference'>;

/**
 * Custom wrapper around the Material UI Popover. This Popover will center itself on the viewport
 * by default and requires no `anchorReference`.
 */
const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(({
  autoPad, open, children, ...props
}, ref) => {
  const [state, setState] = React.useState(open);

  React.useEffect(() => setState(open), [open]);
  return (
    <MUIPopover
      open={state}
      {...props}
      ref={ref}
    >
      <div
        style={{
          padding: autoPad ? '10px 10px 10px 10px' : '',
        }}
      >
        {typeof children === 'function' ? children(setState) : children}
      </div>
    </MUIPopover>
  );
});

Popover.displayName = 'Popover';
Popover.defaultProps = {
  anchorReference: 'none',
  autoPad: true,
  style: {
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default Popover;
