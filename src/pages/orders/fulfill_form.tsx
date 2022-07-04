import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Button,
  ClickAwayListener, List, ListItem, Popover,
} from '@mui/material';
import { Order, Shop } from '@prisma/client';

import useAsync from '../../common/async';
import LoadingScreen from '../../common/auth_selector/loading_screen';
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
  const result = await fetch('api/prisma?collection=order&method=findMany', {
    method: 'POST',
    body: JSON.stringify({
      where: {
        shop: shop.id,
      },
      include: {
        from: true,
        shop: true,
      },
    }),
  });

  return result.json() as unknown as LunchHitchOrder[];
}

type OrderItemProps = {
  order: LunchHitchOrder;
  onSelect: () => void;
};

/**
 * Component to display a single order
 */
const OrderListItem = ({ order, onSelect }: OrderItemProps) => {
  const [showBorder, setShowBorder] = React.useState(false);

  return (
    <ListItem
      onClick={onSelect}
      onMouseEnter={() => setShowBorder(true)}
      onMouseLeave={() => setShowBorder(false)}
      style={{
        border: showBorder ? 'solid black 1px' : '',
      }}
    >
      <div>
        <h3>From {order.from.id}</h3>
        <ol>
          {order.orders.map((x, j) => (<li key={j}>{x}</li>))}
        </ol>
      </div>
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
  const [selected, setSelected] = React.useState<Order | null>(null);

  const orders = useAsync(getOrders);

  React.useEffect(() => {
    if (shop) orders.call(shop);
    setSelected(null);
    return orders.cancel;
  }, [shop]);

  React.useEffect(() => onPopoverChanged(popover), [popover, onPopoverChanged]);

  // Get the form content depending on the result of the getOrders operation
  const getForm = React.useCallback(() => {
    if (!shop) {
      return <>Select a community and shop to show orders!</>;
    }

    switch (orders.state) {
      case 'loading': return (<LoadingScreen />);
      case 'errored': return <>An error occurred, please refresh the page and try again</>;
      case 'done': {
        if (orders.result.length === 0) return <>No Orders</>;
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
      <div
        style={{
          display: 'inline',
        }}
      >
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
      </div>
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
