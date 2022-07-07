import React from 'react';
import Popover, { PopoverProps } from '@mui/material/Popover';

type CustomPopoverProps = {
  onOpenChanged?: (newOpen: boolean) => void;
} & PopoverProps;

const CustomPopover = ({ open, onOpenChanged, ...props }: CustomPopoverProps) => {
  const [state, setState] = React.useState(open);

  React.useEffect(() => {
    setState(open);
    if (onOpenChanged) onOpenChanged(open);
  }, [open, onOpenChanged]);

  return (<Popover open={state} {...props} />);
};

CustomPopover.defaultProps = {
  onOpenChanged: undefined,
};

type Props = {
  children: (
    createPopover: (props: PopoverProps) => React.ReactNode,
    setBlur: React.Dispatch<React.SetStateAction<boolean>>
  ) => React.ReactNode;
};

export default function BlurrableDiv(props: Props) {
  const [blur, setBlur] = React.useState(false);
  const [popoverBlur, setPopoverBlur] = React.useState(false);

  return (
    <div
      style={{ filter: (blur || popoverBlur) ? 'blur(3px)' : '' }}
    >
      {props.children((popoverProps) => (
        <CustomPopover
          onOpenChanged={(newOpen) => setPopoverBlur(popoverBlur || newOpen)}
          {...popoverProps}
        />
      ), setBlur)}
    </div>
  );
}
