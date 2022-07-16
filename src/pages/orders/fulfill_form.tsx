/* eslint-disable no-shadow */
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import SearchIcon from '@mui/icons-material/Search';
import { InputAdornment, TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import { Order, Shop } from '@prisma/client';
import { useFormik } from 'formik';

import { fetchApi } from '../../api_helpers';
import { SessionUser } from '../../common';
import useAsync from '../../common/async';
import Box from '../../common/components/Box';
import { ConfirmPopover, usePopoverContext } from '../../common/components/popovers';
import TooltipButton from '../../common/components/tooltip_button';
import { LunchHitchOrder } from '../../prisma';

type Props = {
  shop: Shop | null;
  user: SessionUser;
};

async function getOrders(shop: Shop, user: SessionUser): Promise<LunchHitchOrder[]> {
  const res = await fetchApi<LunchHitchOrder[]>('orders', {
    where: {
      AND: [{ NOT: { fromId: user.username } },
        // TODO fix this filter
        // { fulfillerId: null } ,
        { shopId: shop.id },
      ],
    },
  });

  if (res.result === 'success') return res.value;
  else throw new Error(res.value);
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
    <ListItem>
      <Box
        onClick={onSelect}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        elevation={hover ? 7 : 3}
      >
        <div>
          <h3>From {order.from.displayName}</h3>
          {// TODO Figure out date display format
          }
          <p>Delivery by {order.deliverBy.toString()}</p>
          <ol>
            {order.orders.map((x, j) => (<li key={j}>{x}</li>))}
          </ol>
        </div>
      </Box>
    </ListItem>
  );
};

const FulFillForm = ({ shop, user }: Props) => {
  const { setPopover } = usePopoverContext();
  const ordersAsync = useAsync(getOrders);
  const {
    values: { order }, submitForm, setFieldValue, isSubmitting,
  } = useFormik<{ order: null | Order}>({
    initialValues: {
      order: null,
    },
    onSubmit: async ({ order }) => {
      try {
        await fetchApi('orders/fulfill', { id: order!.id });
        setPopover('fulfillSuccess', true);
      } catch (error) {
        // TODO fulfill error handling
      }
    }
    ,
  });

  const [searchField, setSearchField] = React.useState('');

  React.useEffect(() => {
    if (shop) ordersAsync.call(shop, user);
    setFieldValue('order', null);
    return ordersAsync.cancel;
  }, [shop]);

  const getForm = React.useCallback(() => {
    if (!shop) {
      return <>Select a community and shop to show orders!</>;
    }

    switch (ordersAsync.state) {
      case 'loading': return (<CircularProgress />);
      case 'errored': return (
        <div>
          An error occurred, please refresh the page and try again.<br />
          {ordersAsync.result.toString()}
        </div>
      );
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
          <Stack direction="column" spacing={1}>
            Displaying orders from {shop.name}
            <TextField
              value={searchField}
              placeholder="Search"
              variant="standard"
              onChange={(e) => setSearchField(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <List style={{ maxHeight: '100%', overflow: 'auto' }}>
              {(searchField === '' ? ordersAsync.result : ordersAsync.result.filter((order) => (
                order.from.displayName.includes(searchField) // Search display name
                || order.orders.find((each) => each.includes(searchField)) // Search each entry
              ))).map((order, i) => (
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
          </Stack>
        );
      }
      default: return null as never;
    }
  }, [ordersAsync, shop]);

  return (
    <form>
      <Stack direction="row" spacing={1}>
        <h2 style={{ color: '#47b16a' }}>Fulfill an Order!</h2>
        <TooltipButton
          style={{
            float: 'right',
          }}
          tooltip="Refresh orders"
          onClick={() => {
            ordersAsync.call(shop!, user);
            setFieldValue('order', null);
          }}
          disabled={shop === null}
        >
          <RefreshIcon />
        </TooltipButton>
      </Stack>
      <ConfirmPopover
        name="fulfillPopover"
        confirmButton="Accept Order"
        confirmAction={() => {
          if (!isSubmitting) submitForm();
        }}
      >
        <h3>Accept the following order?</h3>
        <ol>
          {order?.orders.map((entry, i) => <li key={i}>{entry}</li>)}
        </ol>
      </ConfirmPopover>
      <ConfirmPopover
        confirmButton="Close"
        cancelButton={false}
        name="fulfillSuccess"
      >
        Accepted the order!
      </ConfirmPopover>
      {getForm()}
    </form>
  );
};

export default FulFillForm;
