import React from 'react';
import { Community, Order, Shop } from '@prisma/client';
import { Formik } from 'formik';
import { CircularProgress, List, ListItem } from '@mui/material';
import { LunchHitchUser } from '../../auth';
import ShopSelector from './shop_selector';
import useAsync from '../../common/async';

type Props = {
  communities: Community[];
  user: LunchHitchUser;
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

export default function FulFillForm(props: Props) {
  const [shop, setShop] = React.useState<Shop | null>(null);
  const orders = useAsync(getOrders);

  React.useEffect(() => {
    if (shop) orders.call(shop);
  }, [shop]);

  React.useEffect(() => console.log(orders), [orders]);

  const submitCallback = () => {};

  return (
    <Formik
      initialValues={{
        order: null,
      }}
      onSubmit={submitCallback}
    >
      {(formik) => {
        let selectorElement;

        if (orders.state === 'loading') {
          selectorElement = (
            <div>
              <CircularProgress />
            </div>
          );
        } else if (orders.state === 'errored') {
          selectorElement = (
            <div>
              An unknown error occurred, please refresh the page and try again
            </div>
          );
        } else if (orders.result.length === 0) {
          selectorElement = (
            <>
              No Orders
            </>
          );
        } else {
          selectorElement = (
            <List>

              {orders.result.map((order, i) => (
                <ListItem
                  key={i}
                  onClick={() => formik.setFieldValue('order', order)}
                >
                  <h3>From {order.from}</h3>
                  <ol>
                    {order.orders.map((each, j) => <li key={j}>{each}</li>)}
                  </ol>
                </ListItem>
              ))}
            </List>
          );
        }

        return (
          <div>
            <ShopSelector
              communities={props.communities}
              onChange={setShop}
              value={shop}
            />
            {selectorElement}
          </div>
        );
      }}
    </Formik>
  );
}
