import React from 'react';
import { ClickAwayListener } from '@mui/material';

import Popover, { PopoverProps } from './popover';

type Values = { [name: string ]: boolean };
export type PopoverContextType = {
  popovers: Values,
  setPopover: (name: keyof Values, value: boolean) => void;
};

const PopoverContext = React.createContext<PopoverContextType>({
  popovers: {},
  setPopover: () => {},
});

export type PopoverContainerProps = {
  popovers: { [name: string]: React.ReactNode | boolean },
  children: React.ReactNode | ((values: Values, setOpen: (name: keyof Values, value: boolean) => void) => React.ReactNode);
  blurDist?: number;
};

export const usePopoverContext = () => React.useContext(PopoverContext);

export const PopoverContainer = React.forwardRef<HTMLDivElement, PopoverContainerProps>(({ blurDist, children, popovers }, ref) => {
  const [popoverStates, setPopoversState] = React.useState(() => Object.entries(popovers)
    .reduce((res, [key, value]) => ({ ...res, [key]: typeof value === 'boolean' ? value : false }), {}));
  const setPopover = React.useCallback((name: keyof Values, value: boolean) => setPopoversState({ ...popoverStates, [name]: value }), [popoverStates]);
  const ctxObj = React.useMemo(() => ({
    values: popoverStates,
    setOpen: setPopover,
  }), [popoverStates]);

  return (
    <PopoverContext.Provider value={ctxObj}>
      <div
        style={{
          filter: Object.values(popoverStates).find((x) => x) ? `blur(${blurDist}px)` : '',
        }}
        ref={ref}
      >
        {Object.values(popovers)}
        {typeof children === 'function' ? children(popoverStates, setPopover) : children}
      </div>
    </PopoverContext.Provider>
  );
});

PopoverContainer.displayName = 'PopoverContainer';

PopoverContainer.defaultProps = {
  blurDist: 3,
};

export type LinkedPopoverProps = {
  name: string;
  open?: boolean;
  children?: React.ReactNode | ((setOpen: (newValue: boolean) => void) => React.ReactNode);
} & Omit<PopoverProps, 'children' | 'open'>;

export const LinkedPopover = React.forwardRef<HTMLDivElement, LinkedPopoverProps>(({
  name, open, children, ...props
}, ref) => {
  const { popovers, setPopover } = usePopoverContext();
  const callback = React.useCallback((value: boolean) => setPopover(name, value), [name, setPopover]);
  React.useEffect(() => callback(open!), [open]);

  return (
    <Popover
      open={popovers[name]}
      ref={ref}
      {...props}
    >
      {typeof children === 'function' ? children(callback) : children}
    </Popover>
  );
});

LinkedPopover.displayName = 'LinkedPopover';

LinkedPopover.defaultProps = {
  children: undefined,
  open: false,
};

export function connectPopover<P = {}>(Comp: React.ComponentType<P & { popover: PopoverContextType }>) {
  const newComp = (props: P & { popover: PopoverContextType }) => <Comp {...props} />;
  newComp.displayName = Comp.displayName;

  return newComp;
}

export const LinkedClickAwayPopover = React.forwardRef<HTMLDivElement, LinkedPopoverProps>(({ children, ...props }, ref) => (
  <LinkedPopover {...props}>
    {(setOpen) => (
      <ClickAwayListener onClickAway={() => setOpen(false)}>
        <div ref={ref}>
          {typeof children === 'function' ? children(setOpen) : children}
        </div>
      </ClickAwayListener>
    )}
  </LinkedPopover>
));

LinkedClickAwayPopover.displayName = 'ClickAwayPopover';
