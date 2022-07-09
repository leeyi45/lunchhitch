import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Shop } from '@prisma/client';
import {
  Field, FieldArray, FieldProps, Form, Formik,
} from 'formik';
import moment, { Moment } from 'moment';

import Box from '../../common/components/Box/Box';
import TooltipButton from '../../common/components/tooltip_button';
import { LinkedClickAwayPopover } from '../../common/popovers';
import { usePopoverContext } from '../../common/popovers/linked_popovers';

type MakeFormValues = {
  orders: string[];
  deliverBy: Moment;
}

const MAX_ORDERS = 10;

export default function MakeForm({ shop }: { shop: Shop | null }) {
  const { setPopover } = usePopoverContext();

  const [orderField, setOrderField] = React.useState({
    value: '',
    error: false,
    helperText: '',
  });

  return (
    <Formik<MakeFormValues>
      initialValues={{
        orders: [],
        deliverBy: moment(),
      }}
      onSubmit={({ orders, deliverBy }) => fetch('/api/orders/create?force=', {
        method: 'POST',
        body: JSON.stringify({
          orders,
          shopId: shop!.id,
          deliverBy: deliverBy.toDate(),
        }),
      })}
    >
      {({
        values: { orders }, isSubmitting, setFieldValue, submitForm,
      }) => (
        <Form>
          <FieldArray name="orders">
            {(ordersHelpers) => {
              const addOrder = (order: string, index?: number) => {
                if (orders.length >= MAX_ORDERS) {
                  setOrderField({
                    ...orderField,
                    helperText: 'Maximum number of orders reached!',
                    error: true,
                  });
                  return;
                }

                if (index) {
                  ordersHelpers.insert(index, order);
                } else {
                  ordersHelpers.push(order);
                }
                setOrderField({
                  ...orderField,
                  helperText: `Added ${order}`,
                  error: false,
                });
              };

              return (
                <Stack direction="column">
                  <Stack direction="row">
                    <TextField
                      {...orderField}
                      onChange={(event) => setOrderField({
                        ...orderField,
                        value: event.target.value,
                      })}
                      onSubmit={() => {
                        if (orderField.value) addOrder(orderField.value);
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <TooltipButton
                              onClick={() => {
                                if (orderField.value) addOrder(orderField.value);
                              }}
                              tooltip={`Add ${orderField.value}`}
                            >
                              <AddIcon />
                            </TooltipButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <Field name="deliverBy">
                        {({ field }: FieldProps<MakeFormValues>) => (
                          <DateTimePicker
                            {...field}
                            minDateTime={moment()}
                            renderInput={(params) => <TextField {...params} />}
                          />
                        )}
                      </Field>
                    </LocalizationProvider>
                  </Stack>
                  <Box>
                    {orders.length === 0 ? (
                      <p>Add some orders to begin!</p>
                    ) : (
                      <Stack>
                        {orders.map((order, i) => (
                          <Stack direction="row" key={i}>
                            <TooltipButton
                              tooltip={`Remove ${order}`}
                              onClick={() => {
                                ordersHelpers.remove(i);
                                setOrderField({
                                  ...orderField,
                                  error: false,
                                  helperText: `Removed ${order}`,
                                });
                              }}
                            >
                              <RemoveIcon />
                            </TooltipButton>
                            <TooltipButton
                              tooltip={`Duplicate ${order}`}
                              onClick={() => addOrder(order, i)}
                            >
                              <ContentCopyIcon />
                            </TooltipButton>
                            <Field name={`orders.${i}`}>
                              {({ field, meta }: FieldProps<MakeFormValues>) => (
                                <TextField
                                  variant="standard"
                                  {...field}
                                  error={meta.touched && !!meta.error}
                                />
                              )}
                            </Field>
                          </Stack>
                        ))}
                      </Stack>
                    )}
                  </Box>
                  <Stack direction="row">
                    <TooltipButton
                      disabled={orders.length === 0}
                      tooltip="Remove all orders"
                      onClick={() => setPopover('makeFormClear', true)}
                    >
                      Clear Orders
                    </TooltipButton>
                    <TooltipButton
                      disabled={
                        orders.length === 0
                        || isSubmitting
                        || !shop
                      }
                      tooltip="Submit this order!"
                      onClick={() => setPopover('makeFormConfirm', true)}
                    >
                      Submit Orders
                    </TooltipButton>
                    <p style={{ float: 'right' }}>{orders.length}/{MAX_ORDERS} Orders</p>
                  </Stack>
                </Stack>
              );
            }}
          </FieldArray>
          <LinkedClickAwayPopover
            anchorReference="none"
            name="makeFormClear"
          >
            {(setOpen) => (
              <Stack direction="column">
                <h3>Are you sure you want to clear all orders?</h3>
                <Stack direction="row">
                  <Button
                    color="success"
                    onClick={() => {
                      setFieldValue('orders', []);
                      setOrderField({
                        ...orderField,
                        error: false,
                        helperText: 'Orders cleared',
                      });
                      setOpen(false);
                    }}
                  >
                    Yes
                  </Button>
                  <Button
                    color="error"
                    onClick={() => setOpen(false)}
                  >
                    No
                  </Button>
                </Stack>
              </Stack>
            )}
          </LinkedClickAwayPopover>
          <LinkedClickAwayPopover name="makeFormConfirm">
            {(setOpen) => (
              <Stack direction="column">
                <h3>Confirm the following order from {shop?.name}</h3>
                <ol>
                  {orders.map((order, i) => (<li key={i}>{order}</li>))}
                </ol>
                <Stack direction="row">
                  <Button
                    color="success"
                    type="submit"
                    onClick={() => {
                      setOpen(false);
                      submitForm();
                    }}
                  >
                    Confirm
                  </Button>
                  <Button
                    color="error"
                    onClick={() => setOpen(false)}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            )}
          </LinkedClickAwayPopover>
        </Form>
      )}
    </Formik>
  );
}
