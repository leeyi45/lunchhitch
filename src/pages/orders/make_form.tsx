import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Popover from '@mui/material/Popover';
import TextField from '@mui/material/TextField';
import {
  Formik, Form, FieldArray,
} from 'formik';
import { Community, Order, Shop } from '@prisma/client';
import ShopSelector from './shop_selector';
import TooltipButton from '../../common/tooltip_button';
import { LunchHitchUser } from '../../auth/auth';

const MAX_ORDERS = 10;

type OrderListItemProps = {
  order: string;
  onRemove: () => void;
  onChange: (newValue: string) => void;
  onDuplicate: () => void;
}

export const OrderListItem = ({
  order, onRemove, onChange, onDuplicate,
}: OrderListItemProps) => {
  const [inputField, setInputField] = React.useState(order);

  return (
    <ListItem>
      <div>
        <TooltipButton
          tooltip={`Remove ${order} from list`}
          onClick={onRemove}
        >
          <RemoveIcon />
        </TooltipButton>
        <TooltipButton
          tooltip="Duplicate Order"
          onClick={onDuplicate}
        >
          <ContentCopyIcon />
        </TooltipButton>
        <TextField
          value={inputField}
          onChange={(event) => {
            setInputField(event.target.value);
            onChange(event.target.value);
          }}
          type="text"
        />
        {inputField !== '' ? undefined : (
          <span>
            <ErrorIcon />
            Order cannot be empty!
          </span>
        )}
      </div>
    </ListItem>
  );
};

type MakeFormProps = {
  communities: Community[]
  user: LunchHitchUser;
};

type MakeFormValues = {
  shop: Shop | null;
  orders: string[];
}

export const MakeForm = (props: MakeFormProps) => {
  const [orderField, setOrderField] = React.useState({
    value: '',
    helper: '',
    error: false,
  });

  const [popoverAnchor, setPopoverAnchor] = React.useState<HTMLElement | null>(null);
  const formDivRef = React.useRef<HTMLDivElement | null>(null);

  const submitCallback = async ({ shop, orders }: MakeFormValues) => {
    if (!shop) return;

    setOrderField({
      ...orderField,
      error: false,
      helper: '',
    });

    const orderObj = {
      shop: shop.id,
      orders,
      from: props.user.username,
    } as Omit<Order, 'id'>;

    await fetch('api/prisma?collection=orders&method=create', {
      method: 'POST',
      body: JSON.stringify({
        data: orderObj,
      }),
    });
  };

  return (
    <Formik<MakeFormValues>
      initialValues={{
        shop: null,
        orders: [],
      }}
      onSubmit={submitCallback}
    >
      {({ values, ...formik }) => {
        let submitMessage: string;

        if (values.orders.length === 0) {
          submitMessage = 'Add some orders first!';
        } else if (values.shop === null) {
          submitMessage = 'Select a community and store!';
        } else {
          submitMessage = 'Place this order';
        }

        return (
          <div
            ref={formDivRef}
          >
            <Popover
              open={Boolean(popoverAnchor)}
              anchorOrigin={{
                horizontal: 'center',
                vertical: 'center',
              }}
              transformOrigin={{
                horizontal: 'center',
                vertical: 'center',
              }}
            >
              <h3>Confirm Your Order from {values.shop?.name}</h3>
              <ol>
                {values.orders.map((order, i) => <li key={i}>{order}</li>)}
              </ol>
              <div>
                <Button
                  type="submit"
                  variant="contained"
                  color="success"
                >Confirm
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => setPopoverAnchor(null)}
                >Go Back
                </Button>
              </div>
            </Popover>
            <Form>
              <ShopSelector
                communities={props.communities}
                onChange={(newValue) => formik.setFieldValue('shop', newValue)}
                value={values.shop}
              />
              {values.shop ? (<h3>Ordering from {values.shop.name}</h3>) : undefined}
              <FieldArray name="orders">
                {(arrayHelpers) => {
                  const addItem = (value: string) => {
                    if (values.orders.length < MAX_ORDERS) {
                      arrayHelpers.push(value);
                      setOrderField({
                        value,
                        helper: `Added ${value}`,
                        error: false,
                      });
                    } else {
                      setOrderField({
                        ...orderField,
                        error: true,
                        helper: 'Maximum number of orders reached!',
                      });
                    }
                  };

                  return (
                    <>
                      <div>
                        <TextField
                          error={orderField.error}
                          disabled={formik.isSubmitting}
                          placeholder="Order"
                          onChange={(event) => setOrderField({
                            value: event.target.value,
                            helper: '',
                            error: false,
                          })}
                          value={orderField.value}
                          type="text"
                          onSubmit={() => addItem(orderField.value)}
                          onFocus={() => setOrderField({
                            ...orderField,
                            helper: '',
                            error: false,
                          })}
                          helperText={orderField.helper}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <TooltipButton
                                  tooltip={`Add ${orderField.value} to list`}
                                  disabled={orderField.value === '' || formik.isSubmitting}
                                  onClick={() => addItem(orderField.value)}
                                >
                                  <AddIcon />
                                </TooltipButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        {values.orders.length}/{MAX_ORDERS} Orders
                      </div>
                      <List>
                        {values.orders.map((order, i) => (
                          <OrderListItem
                            order={order}
                            key={i}
                            onRemove={() => {
                              arrayHelpers.remove(i);
                              setOrderField({
                                ...orderField,
                                error: false,
                                helper: `Removed ${order}`,
                              });
                            }}
                            onDuplicate={() => addItem(order)}
                            onChange={(newValue) => {
                              arrayHelpers.replace(i, newValue);
                              setOrderField({
                                ...orderField,
                                error: false,
                                helper: '',
                              });
                            }}
                          />
                        ))}
                      </List>
                    </>
                  );
                } }
              </FieldArray>
            </Form>
            <div>
              <Button
                disabled={values.orders.length === 0}
                onClick={() => {
                  formik.setFieldValue('orders', [], false);
                  setOrderField({
                    ...orderField,
                    error: false,
                    helper: '',
                  });
                }}
              >Clear Orders
              </Button>
              <TooltipButton
                disabled={values.orders.length === 0
                  || values.orders.find((order) => order === '') !== undefined
                  || values.shop === null
                  || formik.isSubmitting}
                tooltip={submitMessage}
                tooltipOnDisabled
                onClick={() => setPopoverAnchor(formDivRef.current)}
              >
                Place Orders
              </TooltipButton>
            </div>
          </div>
        );
      } }
    </Formik>
  );
};
