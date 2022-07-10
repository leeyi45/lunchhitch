import React from 'react';
import ClickAwayListener from '@mui/material/ClickAwayListener';

import Popover, { PopoverProps } from './popover';

export type ClickAwayPopoverProps = {
  onClickAway?: () => void;
} & PopoverProps;

/**
 * Popover component that automatically closes when the user clicks away
 */
export default function ClickAwayPopover({ onClickAway, children, ...props }: ClickAwayPopoverProps) {
  return (
    <Popover {...props}>
      {(setState) => (
        <ClickAwayListener onClickAway={() => {
          setState(false);
          if (onClickAway) onClickAway();
        }}
        >
          <div>
            {typeof children === 'function' ? children(setState) : children}
          </div>
        </ClickAwayListener>
      )}
    </Popover>
  );
}

ClickAwayPopover.defaultProps = {
  onClickAway: undefined,
};
