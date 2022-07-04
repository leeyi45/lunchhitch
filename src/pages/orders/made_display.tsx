import React from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import {
  Autocomplete, Button, ClickAwayListener, List, ListItem, Popover, TextField,
} from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import { Order } from '@prisma/client';

import { LunchHitchUser } from '../../auth';
import useAsync from '../../common/async';
import TooltipButton from '../../common/components/tooltip_button';
import { LunchHitchOrder } from '../../prisma';

const getOrdersMade = async (user: LunchHitchUser) => {
  const result = await fetch('api/prisma?collection=order&method=findMany', {
    method: 'POST',
    body: JSON.stringify({
      where: {
        from: user.username,
      },
      include: {
        from: true,
        shop: true,
      },
    }),
  });

  return result.json() as unknown as LunchHitchOrder[];
};

type OrderDisplayProps = {
  orders: LunchHitchOrder[];
  onRemove: (index: number, order: LunchHitchOrder) => void;
};

const OrderDisplay = ({ orders, onRemove }: OrderDisplayProps) => {
  const shops = Array.from(new Set(orders.map((order) => order.shop)));
  const [selectedShop, setSelectedShop] = React.useState<string | null>(null);
  const [removePopover, setRemovePopover] = React.useState<Order | null>(null);
  const filteredOrders = selectedShop ? orders.filter((order) => order.shop.name.match(selectedShop)) : orders;

  return (
    <div>
      <Popover
        open={!!removePopover}
      >
        <ClickAwayListener
          onClickAway={() => setRemovePopover(null)}
        >
          <div>
            Remove this order?
            <Button>Confirm</Button>
            <Button
              onClick={() => setRemovePopover(null)}
            >
              Cancel
            </Button>
          </div>
        </ClickAwayListener>
      </Popover>
      <Autocomplete
        options={shops}
        value={selectedShop}
        getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
        onChange={(_event, value) => setSelectedShop(typeof value === 'string' ? value : (value?.name) ?? null)}
        freeSolo
        renderInput={(params) => (<TextField {...params} placeholder="Shop" />)}
      />
      <List>
        {filteredOrders.map((option, i) => (
          <ListItem key={i}>
            <div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                }}
              >
                <h3>Order from {option.shop.name}</h3>
                <TooltipButton
                  tooltip="Remove this order"
                  onClick={() => onRemove(i, option)}
                >
                  <CancelIcon />
                </TooltipButton>
              </div>
              <ol>
                {option.orders.map((each, j) => (<li key={j}>{each}</li>))}
              </ol>
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

/**
 * Display orders that the current user has made
 */
export default function MadeDisplay({ user }: { user: LunchHitchUser }) {
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
          <OrderDisplay
            onRemove={() => {}}
            orders={orders.result}
          />
        );
      }
      default: return null as never;
    }
  }, [user, orders.state]);

  return (
    <>
      <h2 style={{ color: '#47b16a' }}>My Pending Orders</h2>
      {getDisp()}
    </>
  );
}
