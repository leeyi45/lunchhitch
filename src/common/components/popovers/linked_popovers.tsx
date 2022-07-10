import React from 'react';

import ClickAwayPopover from './clickaway_popover';
import Popover, { PopoverProps } from './popover';

type Values = { [name: string ]: boolean };
export type PopoverContextType = {
  popovers: Values,
  setPopover: (name: keyof Values, value: boolean) => void;
};

const PopoverContext = React.createContext<PopoverContextType | null>(null);

/**
 * Returns the currently available PopoverContext
 * @returns PopoverContext
 */
export const usePopoverContext = () => {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error('usePopoverContext requires the PopoverContainer!');

  return ctx;
};

/**
 * Returns an array containing the current state of the desired popover, as well as its setter
 * from the current PopoverContext
 * @param name Name of the popover
 */
export const usePopover: (name: string) => [boolean, (newState: boolean) => void] = (name: string) => {
  const ctx = React.useContext(PopoverContext);
  if (!ctx) throw new Error('usePopover requires the PopoverContainer!');
  else if (ctx.popovers[name] === undefined) throw new Error(`Could not find popover with the key ${name}`);

  return [ctx.popovers[name], (state: boolean) => ctx.setPopover(name, state)];
};

export type PopoverContainerProps = {
  popovers: { [name: string]: React.ReactNode | boolean },
  children: React.ReactNode | ((values: Values, setOpen: (name: keyof Values, value: boolean) => void) => React.ReactNode);
  blurDist?: number;
};

/**
 * Component to make a PopoverContext available to all children. This component is intended for use for a viewport that needs to
 * support multiple popovers that have their states set from different sources.
 */
export const PopoverContainer = React.forwardRef<HTMLDivElement, PopoverContainerProps>(({ blurDist, children, popovers }, ref) => {
  const [popoverStates, setPopoversState] = React.useState(() => Object.entries(popovers)
    .reduce((res, [key, value]) => ({ ...res, [key]: typeof value === 'boolean' ? value : false }), {} as { [name: string]: boolean }));

  const setPopover = React.useCallback((name: keyof Values, value: boolean) => {
    if (popoverStates[name] === undefined) throw new Error(`Could not find a popover with name ${name}`);
    return setPopoversState({ ...popoverStates, [name]: value });
  }, [popoverStates]);

  const ctxObj = React.useMemo(() => ({
    popovers: popoverStates,
    setPopover,
  }), [popoverStates, setPopover]);

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

/**
 * Return a version of an existing Popover type that connects to a PopoverContext.
 */
export function linkPopover<P extends PopoverProps>(Component: React.ComponentType<P>, displayName: string) {
  type NewProps = { name: string; } & Omit<P, 'open'>;

  const newComp = React.forwardRef<HTMLDivElement, NewProps>(({ children, name, ...props }, ref) => {
    const [open, setOpen] = usePopover(name);
    return React.createElement<P>(Component, { ...props, open, ref } as unknown as P, typeof children === 'function' ? children(setOpen) : children);
  });

  newComp.displayName = displayName;

  return newComp;
}

export const LinkedPopover = linkPopover(Popover, 'LinkedPopover');
export const LinkedClickAwayPopover = linkPopover(ClickAwayPopover, 'LinkedClickAwayPopover');
