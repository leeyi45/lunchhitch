import React from 'react';
import { AsyncConstructor, createInstance } from 'react-async';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
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
    <Box style={{ backgroundColor: 'rgba(194, 194, 252, 0.6)' }}>
      <LinkedClickAwayPopover
        name="madeRemove"
      >
        {({ state: order, setState }) => (
          <Dialog
            open
            onClose={() => setState(false)}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">
              Remove
            </DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Remove this order?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => setState(false)}
                autoFocus
                style={{ color: '#faa7a7' }}
              >Close
              </Button>
              <Button
                onClick={() => {
                  fetchApiThrowOnError(`orders/delete?id=${order.id}`);
                  setState(false);
                }}
                autoFocus
                style={{ color: '#50C878' }}
              >Confirm
              </Button>
            </DialogActions>
          </Dialog>
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
