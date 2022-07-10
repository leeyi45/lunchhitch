import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Stack from '@mui/material/Stack';

import Popover, { PopoverProps } from './popover';

type Values = { [name: string ]: boolean };
export type PopoverContextType = {
  popovers: Values,
  setPopover: (name: string, value: boolean) => void;
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
  popovers: Values;
  children: React.ReactNode | ((values: Values, setOpen: (name: keyof Values, value: boolean) => void) => React.ReactNode);
  blurDist?: number;
};

/**
 * Component to make a PopoverContext available to all children. This component is intended for use for a viewport that needs to
 * support multiple popovers that have their states set from different sources.
 */
export const PopoverContainer = React.forwardRef<HTMLDivElement, PopoverContainerProps>(({ blurDist, children, popovers }, ref) => {
  const [popoverStates, setPopoversState] = React.useState(() => Object.entries(popovers)
    .reduce((res, [key, value]) => ({ ...res, [key]: value }), {} as Values));

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
        {typeof children === 'function' ? children(popoverStates, setPopover) : children}
      </div>
    </PopoverContext.Provider>
  );
});

PopoverContainer.displayName = 'PopoverContainer';

PopoverContainer.defaultProps = {
  blurDist: 3,
};

export function withPopover<OuterProps>(popoverKeys: { [key: string ]: boolean | React.ReactNode }, Component: React.ComponentType<OuterProps & { popovers: PopoverContextType }>, displayName: string) {
  const popovers = Object.entries(popoverKeys).reduce((res, [key, value]) => ({ ...res, [key]: typeof value === 'boolean' ? value : false }), {} as PopoverContextType['popovers']);
  const callback = (name: string, value: boolean) => {
    if (popovers[name] === undefined) throw new Error(`Could not find popover with key ${name}`);
    popovers[name] = value;
  };

  const newComp = React.forwardRef<any, OuterProps>((props, ref) => {
    const ctxObj = React.useMemo(() => ({
      popovers,
      setPopover: callback,
    }), [popovers, callback]);

    return (
      <PopoverContext.Provider value={ctxObj}>
        <Component ref={ref} popovers={ctxObj} {...props} />
      </PopoverContext.Provider>
    );
  });

  newComp.displayName = displayName;
  return newComp;
}

/**
 * Component to wrap Popover components and connect them to the
 */
export function connectPopover(Component: React.ComponentType<PopoverProps>, displayName?: string) {
  const newComp = ({ name, children, ...props }: Omit<PopoverProps, 'open' | 'children'> & {
    /**
     * Name of the popover
     */
    name: string;
    /**
     * Content of the component
     */
    children: React.ReactNode | ((args: { open: boolean, setState: (newValue: boolean) => void }) => React.ReactNode);
  }) => {
    const [open, setState] = usePopover(name);

    return (
      <Component open={open} {...props}>
        {typeof children === 'function' ? children({ open, setState }) : children}
      </Component>
    );
  };

  newComp.displayName = displayName ?? Component.displayName;
  return newComp;
}

export const LinkedPopover = connectPopover(Popover);
export type LinkedPopoverProps = React.ComponentProps<typeof LinkedPopover> & { name: string };

export const LinkedClickAwayPopover = ({
  name, children, onClickAway, ...props
}: LinkedPopoverProps & { onClickAway?: () => void }) => (
  <LinkedPopover name={name} {...props}>
    {({ open, setState }) => (
      <ClickAwayListener
        onClickAway={() => {
          setState(false);
          if (onClickAway) onClickAway();
        }}
      >
        <div>
          {typeof children === 'function' ? children({ open, setState }) : children}
        </div>
      </ClickAwayListener>
    )}
  </LinkedPopover>
);

LinkedClickAwayPopover.defaultProps = {
  onClickAway: undefined,
};

export type ConfirmPopoverProps = {
  confirmButton?: boolean | string | React.ComponentType<ButtonProps>;
  confirmAction?: () => void;
  cancelButton?: boolean | string | React.ComponentType<ButtonProps>;
  cancelAction?: () => void;
  name: string;
} & React.ComponentProps<typeof LinkedClickAwayPopover>;

export const ConfirmPopover = ({
  children, confirmButton, confirmAction, cancelButton, cancelAction, name, ...props
}: ConfirmPopoverProps) => (
  <LinkedClickAwayPopover name={name} {...props}>
    {({ open, setState }) => {
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
        <Stack direction="column">
          {typeof children === 'function' ? children({ open, setState }) : children}
          {confirmButton || cancelButton ? (
            <Stack direction="row">
              {confirmButton ? <Button {...confirmProps} /> : undefined}
              {cancelButton ? <Button {...cancelProps} /> : undefined}
            </Stack>
          ) : undefined}
        </Stack>
      );
    }}
  </LinkedClickAwayPopover>
);

ConfirmPopover.defaultProps = {
  confirmButton: true,
  confirmAction: undefined,
  cancelButton: true,
  cancelAction: undefined,
};
