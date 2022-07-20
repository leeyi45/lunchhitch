import React from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

import { fetchApi, fetchApiThrowOnError } from '../../api_helpers';
import { useNullableState } from '../../common';
import { createAsync } from '../../common/async/async_provider';
import Box from '../../common/components/Box';
import { usePopoverContext } from '../../common/components/popovers';
import TooltipButton from '../../common/components/tooltip_button';
import type { LunchHitchOrder, SessionUser } from '../../prisma/types';

const OrdersAsync = createAsync((user: SessionUser) => fetchApiThrowOnError<LunchHitchOrder[]>('orders', {
  where: {
    fulfillerId: user.username,
  },
}));

export default function FulfilledDisplay({ user }: { user: SessionUser }) {
  const { setPopover } = usePopoverContext();
  const [removePopover, changeRemovePopover] = useNullableState<LunchHitchOrder>();
  const setRemovePopover = (value: LunchHitchOrder | null) => {
    changeRemovePopover(value);
    setPopover('unfulfillConfirm', Boolean(value));
  };

  return (
    <OrdersAsync>
      {(ctx) => (
        <Box>
          <Dialog
            onClose={() => setRemovePopover(null)}
            open={Boolean(removePopover)}
          >
            <DialogTitle>Abandon Order?</DialogTitle>
            <h3>Abandon this order from {removePopover?.from.displayName}</h3>
            <DialogActions>
              <Button
                onClick={() => fetchApi(`orders/unfulfill?id=${removePopover!.id}`)}
                color="success"
              >Confirm
              </Button>
              <Button
                onClick={() => setRemovePopover(null)}
                color="error"
              >Cancel
              </Button>
            </DialogActions>
          </Dialog>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Stack direction="column">
              <Stack direction="row">
                <Tooltip title="The orders you've decided to fulfill">
                  <h3>My Fulfilled Orders</h3>
                </Tooltip>
                <TooltipButton
                  tooltip="Refresh Orders"
                  onClick={() => ctx.call(user)}
                >
                  <RefreshIcon />
                </TooltipButton>
              </Stack>
              <OrdersAsync.Loading />
              <OrdersAsync.Errored />
              <OrdersAsync.Done>
                {({ result }) => (
                  <List>
                    {result.map((each, i) => (
                      <ListItem key={i}>
                        <Box>
                          <Stack direction="column">
                            <Stack direction="row">
                              <h3>Ordered by {each.from.displayName}</h3>
                              <TooltipButton
                                tooltip="Cancel this order"
                                onClick={() => setRemovePopover(each)}
                              >
                                <DeleteIcon />
                              </TooltipButton>
                            </Stack>
                            <ol>
                              {each.orders.map((entry, j) => (<li key={j}>{entry}</li>))}
                            </ol>
                          </Stack>
                        </Box>
                      </ListItem>
                    ))}
                  </List>
                )}
              </OrdersAsync.Done>
            </Stack>
          </div>
        </Box>
      )}
    </OrdersAsync>
  );
}
