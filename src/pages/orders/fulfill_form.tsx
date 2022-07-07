import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import { Order, Shop } from '@prisma/client';

import { useNullableState } from '../../common';
import useAsync from '../../common/async';
import Box from '../../common/components/Box/Box';
import TooltipButton from '../../common/components/tooltip_button';
import { LunchHitchOrder } from '../../prisma';

type Props = {
  onSubmit: () => void;
  onSelect: (order: LunchHitchOrder) => void;
  onPopoverChanged: (opened: boolean) => void;
  shop: Shop | null;
  isSubmitting: boolean;
};

async function getOrders(shop: Shop): Promise<LunchHitchOrder[]> {
  const resp = await fetch(`api/orders?shop=${shop.id}`);
  return resp.json();
}

type OrderItemProps = {
  order: LunchHitchOrder;
  onSelect: () => void;
};

/**
 * Component to display a single order
 */
const OrderListItem = ({ order, onSelect }: OrderItemProps) => {
  const [hover, setHover] = React.useState(false);

  return (
    <ListItem
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Box elevation={hover ? 5 : 3}>
        <div>
          <h3>From {order.from.displayName}</h3>
          <p>Delivery by {order.deliverBy.toISOString()}</p>
          <ol>
            {order.orders.map((x, j) => (<li key={j}>{x}</li>))}
          </ol>
        </div>
      </Box>
    </ListItem>
  );
};

/**
 * Component to display orders that need to be fulfilled to the user
 */
export default function FulFillForm({
  shop, onSelect, onSubmit, isSubmitting, onPopoverChanged,
}: Props) {
  const [popover, setPopover] = React.useState(false);
  const [selected, setSelected] = useNullableState<Order>();

  const orders = useAsync(getOrders);

  React.useEffect(() => {
    if (shop) orders.call(shop);
    setSelected(null);
    return orders.cancel;
  }, [shop]);

  React.useEffect(() => { onPopoverChanged(popover); }, [popover, onPopoverChanged]);

  // Get the form content depending on the result of the getOrders operation
  const getForm = React.useCallback(() => {
    if (!shop) {
      return <>Select a community and shop to show orders!</>;
    }

    switch (orders.state) {
      case 'loading': return (<CircularProgress />);
      case 'errored': return <>An error occurred, please refresh the page and try again</>;
      case 'done': {
        if (orders.result.length === 0) {
          return (
            <div>
              <p
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  height: '100%',
                }}
              >No Orders
              </p>
            </div>
          );
        }
        return (
          <>
            Displaying orders from {shop.name}
            <List>
              {orders.result.map((order, i) => (
                <OrderListItem
                  order={order}
                  key={i}
                  onSelect={() => {
                    onSelect(order);
                    setPopover(true);
                    setSelected(order);
                  }}
                />
              ))}
            </List>
          </>
        );
      }
      default: return null as never;
    }
  }, [orders, shop]);

  return (
    <>
      <Stack direction="row" spacing={1}>
        <h2 style={{ color: '#47b16a' }}>Fulfill an Order!</h2>
        <TooltipButton
          style={{
            float: 'right',
          }}
          tooltip="Refresh orders"
          onClick={() => orders.call(shop!)}
          disabled={shop === null}
        >
          <RefreshIcon />
        </TooltipButton>
      </Stack>
      <Popover
        open={popover}
        anchorReference="none"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ClickAwayListener
          onClickAway={() => setPopover(false)}
        >
          <div
            style={{
              padding: '10px 10px 10px 10px',
            }}
          >
            <h3>Accept the following order?</h3>
            <ol>
              {selected?.orders.map((order, i) => <li key={i}>{order}</li>)}
            </ol>
            <Button
              color="success"
              onClick={() => {
                if (!isSubmitting) {
                  setPopover(false);
                  onSubmit();
                }
              }}
            >
              Accept order
            </Button>
            <Button
              color="error"
              onClick={() => setPopover(false)}
            >
              Cancel
            </Button>

          </div>
        </ClickAwayListener>
      </Popover>
      {getForm()}
    </>
  );
}
