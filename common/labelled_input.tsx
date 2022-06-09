/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';

type Props = {
    label: any;
} & any;

const LabelledInput = React.forwardRef<HTMLInputElement, Props>((props, ref) => (
  <>
    {props.label}
    <input {...props} ref={ref} />
  </>
));

export default LabelledInput;
