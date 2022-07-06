import React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';

type Props = {
  tooltip: any;
  tooltipOnDisabled?: boolean;
  children: any;
} & ButtonProps;

export default function TooltipButton({
  tooltip, tooltipOnDisabled, children, ...props
}: Props) {
  const [open, setOpen] = React.useState(false);
  const buttonRef = React.useRef(null);

  const mouseOver: React.MouseEventHandler<HTMLElement> = () => {
    setOpen(true);
  };

  const mouseLeave: React.MouseEventHandler<HTMLElement> = () => {
    setOpen(false);
  };

  const button = tooltipOnDisabled
    ? (
      <span
        onMouseOver={mouseOver}
        onMouseLeave={mouseLeave}
      >
        <Button ref={buttonRef} {...props}>
          {children}
        </Button>
      </span>
    )
    : (
      <Button
        {...props}
        ref={buttonRef}
        onMouseOver={mouseOver}
        onMouseLeave={mouseLeave}
      >
        {children}
      </Button>
    );
  return (
    <Tooltip
      title={tooltip}
      open={open}
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
    >{button}
    </Tooltip>
  );
}

TooltipButton.defaultProps = {
  tooltipOnDisabled: false,
};
