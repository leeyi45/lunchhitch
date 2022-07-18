import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';

import { fetchApiThrowOnError } from '../../api_helpers';
import { SessionUser } from '../../common';
import useAsync from '../../common/async';
import Box from '../../common/components/Box';
import { LinkedClickAwayPopover, usePopover } from '../../common/components/popovers';
import TooltipButton from '../../common/components/tooltip_button';
import { LunchHitchOrder } from '../../prisma';

import OrdersDisplay from './orders_display';

const getOrdersMade = async (user: SessionUser) => fetchApiThrowOnError<LunchHitchOrder[]>('orders', {
  where: {
    fromId: user.username,
  },
});

const MadeDisplayOrderHeader = ({ order }: { order: LunchHitchOrder}) => {
  const { setState } = usePopover('madeRemovePopover');

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

/**
 * Display orders that the current user has made
 */
export default function MadeDisplay({ user }: { user: SessionUser }) {
  const orders = useAsync(getOrdersMade);

  React.useEffect(() => {
    orders.call(user);
    return orders.cancel;
  }, [user]);

  const getDisp = React.useCallback(() => {
    switch (orders.state) {
      case 'waiting':
      case 'loading': return <CircularProgress />;
      case 'errored': return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <h2>:(</h2>
          <p>An error occurred</p>
          {process.env.NODE_ENV === 'production' ? '' : orders.result.toString()}
        </div>
      );
      case 'done': {
        if (orders.result.length === 0) return <>You have no pending orders</>;

        return (
          <OrdersDisplay
            orders={orders.result}
            header={<h2 style={{ color: '#47b16a' }}>My Pending Orders</h2>}
            OrderHeader={MadeDisplayOrderHeader}
          />
        );
      }
      default: return null as never;
    }
  }, [orders.state]);

  return (
    <Box style={{ backgroundColor: 'rgba(230, 230, 250, 0.9)' }}>
      <LinkedClickAwayPopover
        name="madeRemovePopover"
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
      <Stack direction="row" spacing={1}>
        <h2 style={{ color: '#47b16a' }}>My Pending Orders</h2>
        <TooltipButton
          tooltip="Refresh"
          onClick={() => orders.call(user)}
        >
          <RefreshIcon />
        </TooltipButton>
      </Stack>
      {getDisp()}
    </Box>
  );
}
