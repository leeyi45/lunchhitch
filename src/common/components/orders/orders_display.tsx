/**
 * orders_display.tsx
 * Components used to display orders
 */
import React from 'react';
import type { AsyncConstructor, FulfilledChildren } from 'react-async';
import SearchIcon from '@mui/icons-material/Search';
import { CircularProgress, List, ListItem } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import type { LunchHitchOrder } from '../../../prisma/types';
import ErrorScreen from '../../auth_selector/error_screen';
import Box from '../Box';

export const OrderEnumerator = ({ order }: { order: LunchHitchOrder}) => (
  <ol>
    {order.orders.map((each, i) => (<li key={i}>{each}</li>))}
  </ol>
);

type OrderItemProps = {
  order: LunchHitchOrder;
  header: React.ReactElement | ((order: LunchHitchOrder) => React.ReactElement);
  onSelect?: (order: LunchHitchOrder) => void;
}

/**
 * Component to display a LunchHitch order
 */
export const OrderItemDisplay = ({ header, onSelect, order }: OrderItemProps) => {
  const [hover, setHover] = React.useState(false);

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        if (onSelect) onSelect(order);
      }}
      elevation={hover ? 8 : 3}
    >
      {typeof header === 'function' ? header(order) : header}
      <OrderEnumerator order={order} />
    </Box>
  );
};

OrderItemDisplay.defaultProps = {
  onSelect: undefined,
};

type Props = {
  header: React.ReactElement;
  orders: LunchHitchOrder[];
  OrderHeader: React.ComponentType<any & { order: LunchHitchOrder }>;
  onSelect?: (order: LunchHitchOrder) => void;
  empty: React.ReactElement;
}
export default function OrdersDisplay({
  empty, header, onSelect, OrderHeader, orders,
}: Props) {
  const [searchField, setTextField] = React.useState('');
  const filteredOrders = searchField === '' ? orders : orders.filter((order) => (
    order.from.displayName.includes(searchField) // Search display name
    || order.orders.find((each) => each.includes(searchField)))); // Search each entry

  return (
    <Stack
      direction="column"
      style={{
        alignItems: 'center',
      }}
    >
      {header}
      <TextField
        style={{
          width: '100%',
        }}
        value={searchField}
        variant="standard"
        placeholder="Search"
        onChange={(event) => setTextField(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        disabled={orders.length === 0}
      />
      {orders.length === 0 ? empty
        : (
          <List style={{ width: '100%' }}>
            {filteredOrders.map((order, i) => (
              <ListItem key={i}>
                <OrderItemDisplay onSelect={onSelect} order={order} header={(<OrderHeader order={order} />)} />
              </ListItem>
            ))}
          </List>
        )}
    </Stack>
  );
}

OrdersDisplay.defaultProps = {
  onSelect: undefined,
};

export type AsyncWrapperProps<T extends {}> = {
  children: FulfilledChildren<T>;
  initial?: React.ReactElement;
  Async: AsyncConstructor<T>
}

export const AsyncWrapper = <T extends {}>({ Async, initial, children }: AsyncWrapperProps<T>) => (
  <>
    <Async.Initial>
      {initial}
    </Async.Initial>
    <Async.Pending>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
      }}
      >
        <CircularProgress />
      </div>
    </Async.Pending>
    <Async.Rejected>
      {(error: any) => <ErrorScreen error={error.toString()} />}
    </Async.Rejected>
    <Async.Fulfilled>
      {(data, state) => (typeof children === 'function' ? children(data, state) : children)}
    </Async.Fulfilled>
  </>
);
// if (state.isInitial) return <>{initial}</>;
// else if (state.isPending) return (<CircularProgress />);
// else if (state.isRejected) return <ErrorScreen error={state.error.toString()} />;
// else return typeof children === 'function' ? children(state.data as T, state as AsyncFulfilled<T>) : children;

AsyncWrapper.defaultProps = {
  initial: null,
};
