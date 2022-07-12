/* eslint-disable react/display-name */
import React from 'react';

import { PopoverContainer } from '../common/components/popovers';

import MakeForm from './orders/make_form';

export default () => (
  <PopoverContainer
    popovers={{
      makeFormClear: false,
      makeFormConfirm: false,
    }}
  >
    <MakeForm shop={null} />
  </PopoverContainer>
);
