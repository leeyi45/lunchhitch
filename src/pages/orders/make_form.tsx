import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ErrorIcon from '@mui/icons-material/Error';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import {
  Autocomplete, TextField, Tooltip, Button, List, ListItem,
} from '@mui/material';
import {
  Formik, Form, FieldArray,
} from 'formik';
import { Community } from '@prisma/client';
import IconButton from '../../common/icon_button';

type OrderListItemProps = {
  order: string;
  orderIndex: number;
  onRemove: () => void;
  onChange: (newValue: string) => void;
  onDuplicate: () => void;
}

export const OrderListItem = ({
  order, orderIndex, onRemove, onChange, onDuplicate,
}: OrderListItemProps) => {
  const [inputField, setInputField] = React.useState(order);

  return (
    <ListItem>
      <div>
        <IconButton
          title={`Remove ${order} from list`}
          buttonContent={<RemoveIcon />}
          onClick={onRemove}
        />
        <IconButton
          title="Duplicate Order"
          buttonContent={<ContentCopyIcon />}
          onClick={onDuplicate}
        />
        {orderIndex + 1}:{' '}
        <input
          type="text"
          value={inputField}
          onChange={(event) => {
            setInputField(event.target.value);
            onChange(event.target.value);
          }}
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
  communities: Community[];
};

type MakeFormValues = {
  community: Community | null;
  orders: string[];
}

export const MakeForm = (props: MakeFormProps) => {
  const submitCallback = async ({ community, orders }: MakeFormValues) => {
    if (!community) return;

    await fetch('api/prisma?collection=orders&method=create', {
      body: JSON.stringify({
        data: {
          community,
          orders,
        },
      }),
    });
  };

  const validateCallback = ({ orders }: MakeFormValues) => orders.reduce((res, order) => {
    res.orders.push(order ? undefined : 'Order cannot be empty');
    return res;
  }, { orders: [] as (undefined | string)[] });

  const [orderField, setOrderField] = React.useState('');

  return (
    <Formik<MakeFormValues>
      initialValues={{
        community: null,
        orders: [],
      }}
      onSubmit={submitCallback}
      validate={validateCallback}
      validateOnChange={false}
    >
      {({ values, ...formik }) => {
        let submitMessage: string;

        if (values.orders.length === 0) {
          submitMessage = 'Add some orders first!';
        } else if (values.community === null) {
          submitMessage = 'Select a community and store!';
        } else {
          submitMessage = 'Place this order';
        }

        return (
          <>
            <Form>
              <Autocomplete
                options={props.communities}
                onChange={(_event, value) => formik.setFieldValue('community', value)}
                onBlur={formik.handleBlur}
                value={values.community}
                isOptionEqualToValue={(option, value) => option.id === value.id}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (<TextField {...params} label="Location" />)}
                renderOption={(liProps, option) => (
                  <ListItem {...liProps}>
                    <div>
                      <h1>{option.name}</h1>
                      {option.address}
                    </div>
                  </ListItem>
                )}
              />
              {values.community ? (<h3>Ordering from {values.community.name}</h3>) : undefined}
              <FieldArray name="orders">
                {(arrayHelpers) => (
                  <>
                    <div>
                      <input
                        placeholder="Order"
                        onChange={(event) => setOrderField(event.target.value)}
                        value={orderField}
                        type="text"
                        disabled={formik.isSubmitting}
                      />
                      <IconButton
                        title={`Add ${orderField} to list`}
                        onClick={() => {
                          arrayHelpers.push(orderField);
                          setOrderField('');
                        }}
                        disabled={orderField === '' || formik.isSubmitting}
                        buttonContent={<AddIcon />}
                      />
                    </div>
                    <List>
                      {values.orders.map((order, i) => (
                        <OrderListItem
                          order={order}
                          orderIndex={i}
                          key={`${i}${order}`}
                          onRemove={() => arrayHelpers.remove(i)}
                          onDuplicate={() => arrayHelpers.insert(i, order)}
                          onChange={(newValue) => arrayHelpers.replace(i, newValue)}
                        />
                      ))}
                    </List>
                  </>
                )}
              </FieldArray>
            </Form>
            <div>
              <Button
                disabled={values.orders.length === 0}
                onClick={() => formik.setFieldValue('orders', [], false)}
              >Clear Orders
              </Button>
              <Tooltip title={submitMessage}>
                <span>
                  <Button
                    disabled={values.orders.length === 0 || values.community === null || formik.isSubmitting}
                    type="submit"
                  >Place Orders
                  </Button>
                </span>
              </Tooltip>
            </div>
          </>
        );
      } }
    </Formik>
  );
};
