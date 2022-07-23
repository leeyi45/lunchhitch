import React from 'react';
import { AsyncConstructor } from 'react-async';
import RefreshIcon from '@mui/icons-material/Refresh';
import Stack from '@mui/material/Stack';
import { Shop } from '@prisma/client';
import { useFormik } from 'formik';
import { DateTime } from 'luxon';

import { fetchApi } from '../../api_helpers';
import Box from '../../common/components/Box';
import { ConfirmPopover, usePopoverContext } from '../../common/components/popovers';
import TooltipButton from '../../common/components/tooltip_button';
import type { LunchHitchOrder } from '../../prisma/types';

import OrdersDisplay, { AsyncWrapper, OrderEnumerator } from './orders_display';

type Props = {
  shop: Shop | null;
  Async: AsyncConstructor<LunchHitchOrder[]>;
  run: (shop: Shop) => void;
};

type OrderItemProps = {
  order: LunchHitchOrder;
};

/**
 * Component to display a single order
 */
const OrderListItem = ({ order }: OrderItemProps) => (
  <div>
    <h3>From {order.from.displayName}</h3>
    {// There's some issue here where prisma seems to think this field is a Date object
    }
    <p>Delivery by {DateTime.fromISO(order.deliverBy as unknown as string).toLocaleString({
      ...DateTime.DATETIME_SHORT,
      weekday: 'short',
    })}
    </p>
  </div>
);

type FulfillFormValues = {
  order: null | LunchHitchOrder;
}

const FulFillForm = ({ Async, run, shop }: Props) => {
  const { setPopover } = usePopoverContext();

  const {
    values: { order }, isSubmitting, submitForm, setFieldValue,
  } = useFormik<FulfillFormValues>({
    initialValues: {
      order: null,
    },
    onSubmit: async ({ order: selectedOrder }) => {
      try {
        await fetchApi('orders/fulfill', { id: selectedOrder!.id });
        setPopover('fulfillSuccess', true);
      } catch (error) {
        // TODO fulfill error handling
      }
    },
  });

  React.useEffect(() => {
    if (shop) {
      run(shop);
      setFieldValue('order', null);
    }
  }, [run, shop]);

  return (
    <Box style={{ backgroundColor: 'rgba(255, 219, 184, 0.9)' }}>
      <form>
        <ConfirmPopover
          name="fulfillPopover"
          confirmButton="Accept Order"
          confirmAction={() => {
            if (!isSubmitting) submitForm();
          }}
        >
          <h3>Accept the following order?</h3>
          {order && <OrderEnumerator order={order} />}
        </ConfirmPopover>
        <ConfirmPopover
          confirmButton="Close"
          cancelButton={false}
          name="fulfillSuccess"
        >
          Accepted the order!
        </ConfirmPopover>
        <AsyncWrapper<LunchHitchOrder[]>
          initial={<p>Select a community and shop to view orders</p>}
          Async={Async}
        >
          {(orders) => (
            <OrdersDisplay
              orders={orders}
              empty={(<p>No Orders</p>)}
              header={(
                <Stack direction="column">
                  <Stack direction="row" spacing={1}>
                    <h2 style={{ color: '#47b16a' }}>Fulfill an Order!</h2>
                    <TooltipButton
                      style={{
                        float: 'right',
                      }}
                      tooltip="Refresh orders"
                      onClick={() => {
                        run(shop!);
                        setFieldValue('order', null);
                      }}
                      disabled={shop === null}
                    >
                      <RefreshIcon />
                    </TooltipButton>
                  </Stack>
                  <p>Displaying orders from {shop?.name}</p>
                </Stack>
                  )}
              OrderHeader={OrderListItem}
              onSelect={(selected) => {
                setFieldValue('order', selected);
                setPopover('fulfillPopover', true);
              }}
            />
          )}
        </AsyncWrapper>
      </form>
    </Box>
  );
};

export default FulFillForm;
