import React from 'react';

import { PopoverContainer } from '../common/popovers';

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
