import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import RemoveIcon from '@mui/icons-material/Remove';
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
import * as yup from 'yup';

import Box from '../../common/components/Box';
import { ConfirmPopover, LinkedClickAwayPopover, usePopoverContext } from '../../common/components/popovers';
import TooltipButton from '../../common/components/tooltip_button';

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
      onSubmit={async ({ orders, deliverBy }, { setFieldValue }) => {
        try {
          await fetch('/api/orders/create?force=', {
            method: 'POST',
            body: JSON.stringify({
              orders,
              shopId: shop!.id,
              deliverBy: deliverBy.toDate(),
            }),
          });
          setOrderField({
            value: '',
            error: false,
            helperText: 'Placed order!',
          });
          setFieldValue('orders', [], false);
          setPopover('makeSuccess', true);
        } catch (error) {
          // TODO submit error handling
        }
      }}
      validationSchema={yup.object({
        orders: yup.array().of(yup.string().required('Order cannot be empty!')),
      })}
    >
      {({
        values: { orders }, errors, isSubmitting, setFieldValue, submitForm,
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
                  <Stack direction="row" spacing={1}>
                    <TextField
                      {...orderField}
                      disabled={shop === null}
                      variant="standard"
                      placeholder="Enter your order here"
                      onKeyUp={(event) => {
                        if (event.key === 'Escape') {
                          if (orderField.value === '') {
                            (event.target as any).blur();
                          } else {
                            setOrderField({
                              value: '',
                              error: false,
                              helperText: '',
                            });
                          }

                          event.preventDefault();
                        } else if (event.key === 'Enter' && orderField.value !== '') {
                          addOrder(orderField.value);
                          event.preventDefault();
                        }
                      }}
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
                              disabled={!orderField.value || !shop}
                            >
                              <AddIcon />
                            </TooltipButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                    <LocalizationProvider dateAdapter={AdapterMoment}>
                      <Field
                        name="deliverBy"
                      >
                        {({ field, meta: { touched } }: FieldProps<MakeFormValues>) => (
                          <DateTimePicker
                            {...field}
                            minDateTime={moment()}
                            disabled={!shop}
                            renderInput={({ error, ...params }) => (
                              <TextField
                                placeholder="Deliver By Time"
                                variant="standard"
                                error={error && touched}
                                {...params}
                              />
                            )}
                          />
                        )}
                      </Field>
                    </LocalizationProvider>
                  </Stack>
                  <Box>
                    {orders.length === 0 ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <p style={{
                          color: '#c5c9c6',
                        }}
                        >Add some orders to begin!
                        </p>
                      </div>
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
                                  helperText={meta.error}
                                />
                              )}
                            </Field>
                          </Stack>
                        ))}
                      </Stack>
                    )}
                  </Box>
                  <div style={{
                    display: 'inline',
                  }}
                  >
                    <TooltipButton
                      style={{
                        paddingLeft: '10px',
                      }}
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
                        || Object.values(errors).length > 0
                      }
                      tooltip="Submit this order!"
                      onClick={() => setPopover('makeFormConfirm', true)}
                    >
                      Submit Orders
                    </TooltipButton>
                    <p style={{ float: 'right', paddingRight: '20px' }}>{orders.length}/{MAX_ORDERS} Orders</p>
                  </div>
                </Stack>
              );
            }}
          </FieldArray>
          <ConfirmPopover
            name="makeFormClear"
            confirmAction={() => {
              setFieldValue('orders', []);
              setOrderField({
                ...orderField,
                error: false,
                helperText: 'Orders cleared',
              });
            }}
          >
            <h3>Are you sure you want to clear all orders?</h3>
          </ConfirmPopover>
          <ConfirmPopover
            name="makeFormConfirm"
            confirmAction={submitForm}
          >
            <Stack direction="column">
              <h3>Confirm the following order from {shop?.name}</h3>
              <ol>
                {orders.map((order, i) => (<li key={i}>{order}</li>))}
              </ol>
            </Stack>
          </ConfirmPopover>
          <LinkedClickAwayPopover
            name="makeSuccess"
          >
            Successfully placed your order!
            <CheckCircleIcon />
          </LinkedClickAwayPopover>
        </Form>
      )}
    </Formik>
  );
}
