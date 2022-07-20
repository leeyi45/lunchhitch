import React from 'react';
import SearchIcon from '@mui/icons-material/Search';
import { ListItem } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import Box from '../../common/components/Box';
import type { LunchHitchOrder } from '../../prisma/types';

export const OrderEnumerator = ({ order }: { order: LunchHitchOrder}) => (
  <ol>
    {order.orders.map((each, i) => (<li key={i}>{each}</li>))}
  </ol>
);

type OrderItemProps = {
  order: LunchHitchOrder;
  header: React.ReactElement | ((order: LunchHitchOrder) => React.ReactElement);
}

const OrderItemDisplay = ({ header, order }: OrderItemProps) => {
  const [hover, setHover] = React.useState(false);

  return (
    <Box
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      elevation={hover ? 8 : 3}
    >
      {typeof header === 'function' ? header(order) : header}
      <OrderEnumerator order={order} />
    </Box>
  );
};

type Props = {
  header: React.ReactElement;
  orders: LunchHitchOrder[];
  OrderHeader: React.ComponentType<any & { order: LunchHitchOrder }>;
}
export default function OrdersDisplay({ header, OrderHeader, orders }: Props) {
  const [searchField, setTextField] = React.useState('');
  const filteredOrders = searchField === '' ? orders : orders.filter((order) => (
    order.from.displayName.includes(searchField) // Search display name
    || order.orders.find((each) => each.includes(searchField)))); // Search each entry

  return (
    <Stack direction="column">
      {header}
      <TextField
        value={searchField}
        onChange={(event) => setTextField(event.target.value)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      {filteredOrders.map((order, i) => (
        <ListItem key={i}>
          <OrderItemDisplay order={order} header={(<OrderHeader order={order} />)} />
        </ListItem>
      ))}
    </Stack>
  );
}
