import React from 'react';
import { AsyncConstructor } from 'react-async';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import { Shop } from '@prisma/client';
import { useFormik } from 'formik';
import { DateTime } from 'luxon';

import { fetchApi } from '../../../api_helpers';
import type { LunchHitchOrder } from '../../../prisma/types';
import Box from '../Box';
// import { ConfirmPopover, usePopoverContext } from '../../common/components/popovers';
import TooltipButton from '../tooltip_button';

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

const FulfillForm = ({ Async, run, shop }: Props) => {
  // const { setPopover } = usePopoverContext();
  const [accept, setAccept] = React.useState(false);

  const handleUnaccept = () => {
    setAccept(false);
  };

  const {
    values: { order }, isSubmitting, submitForm, setFieldValue,
  } = useFormik<FulfillFormValues>({
    initialValues: {
      order: null,
    },
    onSubmit: async ({ order: selectedOrder }) => {
      try {
        await fetchApi('orders/fulfill', { id: selectedOrder!.id });
        // setPopover('fulfillSuccess', true);
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
    <Box style={{
      backgroundColor: 'rgba(255, 219, 184, 0.9)', height: '450px', overflow: 'hidden', overflowY: 'scroll',
    }}
    >
      <form>
        {/*
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
        */}
        <Dialog
          open={accept}
          onClose={handleUnaccept}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            Accept the following order?
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {order && <OrderEnumerator order={order} />}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleUnaccept} autoFocus style={{ color: '#faa7a7' }}>Cancel</Button>
            <Button
              onClick={() => {
                if (!isSubmitting) submitForm();
                setAccept(false);
              }}
              href="/payments/fulfiller"
              autoFocus
              style={{ color: '#50C878' }}
            >Confirm
            </Button>
          </DialogActions>
        </Dialog>
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
                  <h2 style={{ color: '#47b16a', textAlign: 'center' }}>Fulfill an Order!</h2>
                  <Stack direction="row" spacing={1}>
                    <p>Displaying orders from {shop?.name}</p>
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
                </Stack>
                  )}
              OrderHeader={OrderListItem}
              onSelect={(selected) => {
                setFieldValue('order', selected);
                // setPopover('fulfillPopover', true);
                setAccept(true);
              }}
            />
          )}
        </AsyncWrapper>
      </form>
    </Box>
  );
};

export default FulfillForm;
