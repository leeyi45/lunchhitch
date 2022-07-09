import React from 'react';
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import ErrorIcon from '@mui/icons-material/Error';
import RemoveIcon from '@mui/icons-material/Remove';
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Order, Shop } from '@prisma/client';
import moment, { Moment } from 'moment';

import Box from '../../common/components/Box/Box';
import TooltipButton from '../../common/components/tooltip_button';
import { Field, FieldArray, FieldProps, Form, Formik, FormikBag, useFormik, useFormikContext, withFormik } from 'formik';

const MAX_ORDERS = 10;

type OrderListItemProps = {
  order: string;
  onRemove: () => void;
  onChange: (newValue: string) => void;
  onDuplicate: () => void;
}

const OrderListItem = ({
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
  shop: Shop | null;
  onSubmit: (order: Order) => (any | Promise<any>);
};

type MakeFormValues = {
  orders: string[];
  deliverBy: Moment;
}

const MakeForm2 = withFormik<MakeFormProps, MakeFormValues>({
  mapPropsToValues: () => ({
    orders: [],
    deliverBy: moment(),
  }),
  handleSubmit: (values) => {},
  displayName: 'MakeForm',
})(({ props }: FormikBag<MakeFormProps, MakeFormValues>) => {
  const [orderField, setOrderField] = React.useState({
    value: '',
    helper: '',
    error: false,
  });

  const { values: { orders }, isSubmitting } = useFormikContext<MakeFormValues>();

  return (<Form>
    <FieldArray
      name="order"
    >
      {(field) => (
        <>
        <TextField
          variant="standard"
          error={orderField.error}
          disabled={isSubmitting}
          placeholder="Order"
          onChange={(event) => setOrderField({
            value: event.target.value,
            helper: '',
            error: false,
          })}
          value={orderField.value}
          type="text"
          onSubmit={() => field.handlePush(orderField.value)}
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
                  disabled={orderField.value === '' || isSubmitting}
                  onClick={() => field.handlePush(orderField.value)}
                >
                  <AddIcon />
                </TooltipButton>
              </InputAdornment>
            ),
          }}
        />
      <Box>
        {orders.length === 0 ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <p>Add Some Orders to begin!</p>
          </div>
        ) : (
          <List>
            {orders.map((order, i) => (
              <OrderListItem
                key={i}
                onChange={(newValue) => field.handleReplace(i, newValue)}
                onRemove={() => {
                  field.handleRemove(i);
                  setOrderField({
                    ...orderField,
                    error: false,
                    helper: `Removed ${order}`,
                  });
                }}
                onDuplicate={() => field.handleInsert(i, order)}
                order={order}
              />
            ))}
          </List>
        )}
      </Box>
</>
      )}
    </FieldArray>
    <Field name="deliverBy">
      {({ field, form }: FieldProps<Moment>) => (
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label="Deliver By"
            value={field.value}
            onChange={(value) => {
              if (value) form.setFieldValue('deliverBy', value);
            }}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            renderInput={({ error, variant, ...params }) => (<TextField variant="standard" {...params} />)}
            minDateTime={moment()}
          />
        </LocalizationProvider>
      )}
    </Field>
  </Form>)
});

const MakeForm = ({
  onSubmit, shop,
}: MakeFormProps) => {
  const [orderField, setOrderField] = React.useState({
    value: '',
    helper: '',
    error: false,
  });

  const {
    values: { orders, deliverBy },
  } = useFormik({
    initialValues: {
      orders: [] as string[],
      deliverBy: moment(),
    },
    onSubmit,
  });

  const addOrder = (order: string, index?: number) => {
    if (orders.length >= MAX_ORDERS) {
      setOrderField({
        ...orderField,
        helper: 'Maximum number of orders reached!',
        error: true,
      });
      return;
    }

    if (index) {
      
      const before = orders.slice(0, index);
      const after = orders.slice(index + 1);

      setOrders([...before, order, ...after]);
    } else {
      setOrders([...orders, order]);
    }
  };

  const removeOrder = (index: number) => {
    const before = orders.slice(0, index);
    const after = orders.slice(index + 1);

    setOrders(before.concat(after));
  };

  const changeOrder = (order: string, index: number) => {
    const before = orders.slice(0, index);
    const after = orders.slice(index + 1);

    setOrders([...before, order, ...after]);
  };

  return (<Formik
    initialValues={{
      orders: [] as string[],
      deliverBy: moment(),
    }}
    onSubmit={onSubmit}
  >
  {(formik) => (

  )}
  </Formik>)

  const [clearPopover, setClearOpen] = React.useState(false);
  const [confirmPopover, setConfirmOpen] = React.useState(false);
  const [orders, setOrdersValue] = React.useState<string[]>([]);
  const [deliverDate, setDeliverDate] = React.useState<Moment>(moment());

  React.useEffect(() => { onPopoverChange(clearPopover || confirmPopover); }, [clearPopover, confirmPopover, onPopoverChange]);
  React.useEffect(() => { onDateChange(deliverDate!.toDate()); }, [onDateChange, deliverDate]);

  const setOrders = (value: string[]) => {
    setOrdersValue(value);
    onChange(value);
  };

  const addOrder = (order: string, index?: number) => {
    if (orders.length >= MAX_ORDERS) {
      setOrderField({
        ...orderField,
        helper: 'Maximum number of orders reached!',
        error: true,
      });
      return;
    }

    if (index) {
      const before = orders.slice(0, index);
      const after = orders.slice(index + 1);

      setOrders([...before, order, ...after]);
    } else {
      setOrders([...orders, order]);
    }
  };

  const removeOrder = (index: number) => {
    const before = orders.slice(0, index);
    const after = orders.slice(index + 1);

    setOrders(before.concat(after));
  };

  const changeOrder = (order: string, index: number) => {
    const before = orders.slice(0, index);
    const after = orders.slice(index + 1);

    setOrders([...before, order, ...after]);
  };

  return (
    <>
      <Popover
        open={clearPopover}
        anchorReference="none"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ClickAwayListener
          onClickAway={() => setClearOpen(false)}
        >
          <div>
            <h3>Are you sure you want to clear all orders?</h3>
            <Button
              color="success"
              onClick={() => {
                setClearOpen(false);
                setOrders([]);
                setOrderField({
                  ...orderField,
                  error: false,
                  helper: 'Orders cleared',
                });
              }}
            >
              Confirm
            </Button>
            <Button
              color="error"
              onClick={() => setClearOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </ClickAwayListener>
      </Popover>
      <Popover
        open={confirmPopover}
        anchorReference="none"
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ClickAwayListener
          onClickAway={() => setConfirmOpen(false)}
        >
          <div>
            <p>Confirm your order from {shop?.name}:</p>
            <ol>
              {orders.map((order, i) => (<li key={i}>{order}</li>))}
            </ol>
            <Button
              color="success"
              onClick={() => {
                setConfirmOpen(false);
                onSubmit(orders, deliverDate!.toDate());
              }}
            >
              Confirm
            </Button>
            <Button
              color="error"
              onClick={() => setConfirmOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </ClickAwayListener>
      </Popover>
      <Stack
        direction="row"
        spacing={1}
      >
        <TextField
          variant="standard"
          error={orderField.error}
          disabled={isSubmitting}
          placeholder="Order"
          onChange={(event) => setOrderField({
            value: event.target.value,
            helper: '',
            error: false,
          })}
          value={orderField.value}
          type="text"
          onSubmit={() => addOrder(orderField.value)}
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
                  disabled={orderField.value === '' || isSubmitting}
                  onClick={() => addOrder(orderField.value)}
                >
                  <AddIcon />
                </TooltipButton>
              </InputAdornment>
            ),
          }}
        />
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DateTimePicker
            label="Deliver By"
            value={deliverDate}
            onChange={(value) => {
              if (value) setDeliverDate(value);
            }}
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            renderInput={({ error, variant, ...params }) => (<TextField variant="standard" {...params} />)}
            minDateTime={moment()}
          />
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
            <p>Add Some Orders to begin!</p>
          </div>
        ) : (
          <List>
            {orders.map((order, i) => (
              <OrderListItem
                key={i}
                onChange={(newValue) => changeOrder(newValue, i)}
                onRemove={() => {
                  removeOrder(i);
                  setOrderField({
                    ...orderField,
                    error: false,
                    helper: `Removed ${order}`,
                  });
                }}
                onDuplicate={() => addOrder(order, i)}
                order={order}
              />
            ))}
          </List>
        )}
      </Box>
      <div>
        <Button
          disabled={orders.length === 0}
          onClick={() => setClearOpen(true)}
        >Clear Orders
        </Button>
        <TooltipButton
          disabled={orders.length === 0
                  || orders.find((order) => order === '') !== undefined
                  || isSubmitting}
          tooltip={orders.length === 0 ? 'Add some orders first' : 'Place these orders!'}
          tooltipOnDisabled
          onClick={() => setConfirmOpen(true)}
        >
          Place Orders
        </TooltipButton>
        <p style={{ float: 'right' }}>{orders.length}/{MAX_ORDERS} Orders</p>
      </div>
    </>
  );
};

export default MakeForm;
