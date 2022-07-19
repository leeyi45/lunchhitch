import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartCheckoutIcon from '@mui/icons-material/ShoppingCartCheckout';
import Badge from '@mui/material/Badge';
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

import { fetchApiThrowOnError } from '../../api_helpers';
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
      onSubmit={async ({ orders, deliverBy }, { resetForm }) => {
        try {
          await fetchApiThrowOnError('orders/create', {
            orders,
            shopId: shop!.id,
            deliverBy: deliverBy.toDate(),
          });

          setOrderField({
            value: '',
            error: false,
            helperText: 'Placed order!',
          });
          resetForm({
            values: {
              deliverBy: moment(),
              orders: [],
            },
          });
          setPopover('makeSuccess', true);
        } catch (error: any) {
          // TODO submit error handling
          setOrderField({
            value: orderField.value,
            error: true,
            helperText: error.toString(),
          });
        }
      }}
      validationSchema={yup.object({
        orders: yup.array().of(yup.string().required('Order cannot be empty!')),
        deliverBy: yup.date().min(moment(), 'Invalid deliver by time!'),
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
                        if (orderField.value) {
                          addOrder(orderField.value);
                          setOrderField({
                            value: '',
                            error: false,
                            helperText: '',
                          });
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <TooltipButton
                              onClick={() => {
                                if (orderField.value) {
                                  addOrder(orderField.value);
                                  setOrderField({
                                    value: '',
                                    error: false,
                                    helperText: '',
                                  });
                                }
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
                        {({ field: { value, ...field }, meta }: FieldProps<MakeFormValues>) => (
                          <DateTimePicker
                            {...field}
                            value={value}
                            onChange={(v) => {
                              setOrderField({
                                value: orderField.value,
                                error: false,
                                helperText: '',
                              });
                              setFieldValue('deliverBy', v, true);
                            }}
                            disabled={!shop}
                            // eslint-disable-next-line @typescript-eslint/no-unused-vars
                            renderInput={({ error, ...params }) => (
                              <TextField
                                placeholder="Deliver By Time"
                                variant="standard"
                                error={!!meta.error && meta.touched}
                                helperText={meta.error}
                                {...params}
                              />
                            )}
                          />
                        )}
                      </Field>
                    </LocalizationProvider>
                  </Stack>
                  <Box style={{ backgroundColor: 'rgba(255, 217, 217, 0.9)' }}>
                    {orders.length === 0 ? (
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                      >
                        <p style={{
                          color: '#7c807d',
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
                      startIcon={<DeleteIcon />}
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
                      endIcon={(
                        <Badge color="primary" badgeContent={orders.length}>
                          <ShoppingCartCheckoutIcon />
                        </Badge>
                      )}
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
            <h3 style={{ fontFamily: 'Raleway', padding: '20px' }}>Are you sure you want to clear all orders?</h3>
          </ConfirmPopover>
          <ConfirmPopover
            name="makeFormConfirm"
            confirmAction={() => {
              submitForm();
              setOrderField({
                value: '',
                error: false,
                helperText: '',
              });
            }}
          >
            <Stack direction="column">
              <h3 style={{ fontFamily: 'Raleway', padding: '20px' }}>Confirm the following order from {shop?.name}</h3>
              <ol>
                {orders.map((order, i) => (<li key={i}>{order}</li>))}
              </ol>
            </Stack>
          </ConfirmPopover>
          <LinkedClickAwayPopover name="makeSuccess">
            <Stack direction="column">
              <CheckCircleIcon />
              Successfully placed your order!
            </Stack>
          </LinkedClickAwayPopover>
        </Form>
      )}
    </Formik>
  );
}
