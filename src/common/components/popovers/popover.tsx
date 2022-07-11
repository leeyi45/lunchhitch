import React from 'react';
import MUIPopover, { PopoverProps as MUIPopoverProps } from '@mui/material/Popover';

export type PopoverProps = {
  /**
   * Determines which anchor prop to refer to when setting the position of the popover
   */
  anchorReference?: MUIPopoverProps['anchorReference'];
  style?: MUIPopoverProps['style'];
  /**
   * Automatically pad the content of the Popover with 10px of padding on all sides
   */
  autoPad?: boolean;
} & Omit<MUIPopoverProps, 'anchorReference'>;

/**
 * Custom wrapper around the Material UI Popover. This Popover will center itself on the viewport
 * by default and requires no `anchorReference`.
 */
const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(({
  autoPad, children, ...props
}, ref) => (
  <MUIPopover
    {...props}
    ref={ref}
  >
    <div
      style={{
        padding: autoPad ? '10px 10px 10px 10px' : '',
      }}
    >
      {children}
    </div>
  </MUIPopover>
));

Popover.displayName = 'Popover';
Popover.defaultProps = {
  anchorReference: 'none',
  autoPad: true,
  style: {
    top: '50%',
    left: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
  },
};

export default Popover;
