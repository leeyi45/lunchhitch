import React from 'react';
import { Order, Shop } from '@prisma/client';
import {
  Button,
  CircularProgress, List, ListItem, Popover,
} from '@mui/material';
import useAsync from '../../common/async';

type Props = {
  onSubmit: () => void;
  onSelect: (order: Order) => void;
  shop: Shop | null;
  popoverElement: any;
  isSubmitting: boolean;
};

async function getOrders(shop: Shop): Promise<Order[]> {
  const result = await fetch('api/prisma?collection=order&method=findMany', {
    method: 'POST',
    body: JSON.stringify({
      where: {
        shop: shop.id,
      },
    }),
  });

  return result.json();
}

type OrderItemProps = {
  order: Order;
  onSelect: () => void;
};

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
        <h3>From {order.from}</h3>
        <ol>
          {order.orders.map((x, j) => (<li key={j}>{x}</li>))}
        </ol>
        <p> </p>
      </div>
    </ListItem>
  );
};

export default function FulFillForm({
  shop, onSelect, onSubmit, popoverElement, isSubmitting,
}: Props) {
  const [popover, setPopover] = React.useState(false);
  const [selected, setSelected] = React.useState<Order | null>(null);

  const orders = useAsync(getOrders);

  React.useEffect(() => {
    if (shop) orders.call(shop);
    setSelected(null);
    return orders.cancel;
  }, [shop]);

  const getForm = () => {
    switch (orders.state) {
      case 'loading': return (<CircularProgress />);
      case 'errored': return <>An error occurred, please refresh the page and try again</>;
      case 'done': {
        if (orders.result.length === 0) return <>No Orders</>;
        return (
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
        );
      }
      default: return null as never;
    }
  };

  return (
    <>
      <Popover
        open={popover}
        anchorEl={popoverElement}
      >
        <h3 style={{ paddingInline: '30px' }}>Accept the following order?</h3>
        <ol>
          {selected?.orders.map((order, i) => <li key={i}>{order}</li>)}
        </ol>
        <div style={{ textAlign: 'center' }}>
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
      </Popover>
      {getForm()}
    </>
  );
}
