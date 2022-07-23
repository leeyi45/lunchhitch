import React from 'react';
import { AsyncConstructor, createInstance } from 'react-async';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

import { fetchApiThrowOnError } from '../../api_helpers';
import Box from '../../common/components/Box';
import { LinkedClickAwayPopover, usePopover } from '../../common/components/popovers';
import TooltipButton from '../../common/components/tooltip_button';
import type { LunchHitchOrder } from '../../prisma/types';

import OrdersDisplay, { AsyncWrapper } from './orders_display';

export const MadeAsync = createInstance<LunchHitchOrder[]>({
  promiseFn: ({ user }) => fetchApiThrowOnError<LunchHitchOrder[]>('orders', {
    where: {
      fromId: user.username,
    },
  }),
});

const MadeDisplayOrderHeader = ({ order }: { order: LunchHitchOrder}) => {
  const { setState } = usePopover('madeRemove');

  return (
    <Stack direction="row">
      <h3>Order from {order.shop.name}</h3>
      <TooltipButton
        tooltip="Remove this order"
        onClick={() => setState(order)}
      >
        <DeleteIcon />
      </TooltipButton>
    </Stack>
  );
};

type Props = {
  Async: AsyncConstructor<LunchHitchOrder[]>;
}
/**
 * Display orders that the current user has made
 */
export default function MadeDisplay({ Async }: Props) {
  return (
    <Box style={{ backgroundColor: 'rgba(230,230, 250, 0.9)' }}>
      <LinkedClickAwayPopover
        name="madeRemove"
      >
        {({ state: order, setState }) => (
          <Stack direction="column">
            <h3>Remove this order?</h3>
            <Stack direction="row">
              <Button
                onClick={() => fetchApiThrowOnError(`orders/delete?id=${order.id}`)}
                color="success"
              >
                Confirm
              </Button>
              <Button
                onClick={() => setState(false)}
                color="error"
              >
                Cancel
              </Button>
            </Stack>
          </Stack>
        )}
      </LinkedClickAwayPopover>
      <AsyncWrapper<LunchHitchOrder[]> Async={Async}>
        {(data, { run }) => (
          <OrdersDisplay
            orders={data}
            OrderHeader={MadeDisplayOrderHeader}
            empty={(<p>You have not placed any orders</p>)}
            header={(
              <Stack direction="row" spacing={1}>
                <h2 style={{ float: 'left', color: '#47b16a' }}>My Pending Orders</h2>
                <TooltipButton
                  tooltip="Refresh"
                  onClick={() => run()}
                >
                  <RefreshIcon />
                </TooltipButton>
              </Stack>
            )}
          />
        )}
      </AsyncWrapper>
    </Box>
  );
}
