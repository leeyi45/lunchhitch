import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import { Order, Shop } from '@prisma/client';
import { useFormik } from 'formik';

import useAsync from '../../common/async';
import Box from '../../common/components/Box/Box';
import TooltipButton from '../../common/components/tooltip_button';
import { LinkedClickAwayPopover } from '../../common/popovers';
import { usePopoverContext } from '../../common/popovers/linked_popovers';
import { LunchHitchOrder } from '../../prisma';

type Props = {
  shop: Shop | null;
};

async function getOrders(shop: Shop): Promise<LunchHitchOrder[]> {
  const resp = await fetch(`api/orders?shopId=${shop.id}&force=`);
  const res = await resp.json();

  if (res.result === 'success') return res.orders;
  else throw new Error(res.error);
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
          <p>Delivery by {order.deliverBy.toString()}</p>
          <ol>
            {order.orders.map((x, j) => (<li key={j}>{x}</li>))}
          </ol>
        </div>
      </Box>
    </ListItem>
  );
};

const FulFillForm = ({ shop }: Props) => {
  const { setPopover } = usePopoverContext();
  const ordersAsync = useAsync(getOrders);
  const {
    values: { order }, submitForm, setFieldValue, isSubmitting, handleBlur, handleSubmit,
  } = useFormik<{ order: null | Order}>({
    initialValues: {
      order: null,
    },
    onSubmit: ({ order }) => {},
  });

  React.useEffect(() => {
    if (shop) ordersAsync.call(shop);
    setFieldValue('order', null);
    return ordersAsync.cancel;
  }, [shop]);

  const getForm = React.useCallback(() => {
    if (!shop) {
      return <>Select a community and shop to show orders!</>;
    }

    switch (ordersAsync.state) {
      case 'loading': return (<CircularProgress />);
      case 'errored': return <>An error occurred, please refresh the page and try again</>;
      case 'done': {
        if (ordersAsync.result.length === 0) {
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
              {ordersAsync.result.map((order, i) => (
                <OrderListItem
                  order={order}
                  key={i}
                  onSelect={() => {
                    setFieldValue('order', order);
                    setPopover('fulfillPopover', true);
                  }}
                />
              ))}
            </List>
          </>
        );
      }
      default: return null as never;
    }
  }, [ordersAsync, shop, setPopover, setFieldValue]);

  return (
    <form
      onBlur={handleBlur}
      onSubmit={handleSubmit}
    >
      <Stack direction="row" spacing={1}>
        <h2 style={{ color: '#47b16a' }}>Fulfill an Order!</h2>
        <TooltipButton
          style={{
            float: 'right',
          }}
          tooltip="Refresh orders"
          onClick={() => ordersAsync.call(shop!)}
          disabled={shop === null}
        >
          <RefreshIcon />
        </TooltipButton>
      </Stack>
      <LinkedClickAwayPopover
        name="fulfillPopover"
      >
        {(setPopoverOpen) => (
          <div
            style={{
              padding: '10px 10px 10px 10px',
            }}
          >
            <h3>Accept the following order?</h3>
            <ol>
              {order?.orders.map((entry, i) => <li key={i}>{entry}</li>)}
            </ol>
            <Button
              color="success"
              onClick={() => {
                if (!isSubmitting) {
                  setPopoverOpen(false);
                  submitForm();
                }
              }}
            >
              Accept order
            </Button>
            <Button
              color="error"
              onClick={() => setPopoverOpen(false)}
            >
              Cancel
            </Button>
          </div>
        )}
      </LinkedClickAwayPopover>
      {getForm()}
    </form>
  );
};

export default FulFillForm;
