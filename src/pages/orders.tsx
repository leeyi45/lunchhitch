import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Community } from '@prisma/client';
import { ErrorMessage, FieldArray, Form, Formik } from 'formik';
import React from 'react';
import { Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import prisma from '../prisma';

type Props = {
  communities: Community[];
}

type MakeFormValues = {
  community: Community | null;
  orders: string[];
};

function MakeForm(props: Props) {
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

  const validateCallback = ({ community, order }: MakeFormValues) => {

  };

  const [orderField, setOrderField] = React.useState('');

  return (
    <Formik<MakeFormValues>
      initialValues={{
        community: null,
        orders: [],
      }}
      onSubmit={submitCallback}
      validate={validateCallback}
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
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={values.community}
                getOptionLabel={(option) => option.name}
                renderInput={(params) => (<TextField {...params} label="Location" />)}
                renderOption={(liProps, option) => (
                  <li {...liProps}>
                    <div>
                      <h1>{option.name}</h1>
                      {option.address}
                    </div>
                  </li>
                )}
              />
              <FieldArray name="orders">
                {(arrayHelpers) => (
                  <div>
                    <div>
                      <input
                        placeholder="Order"
                        onChange={(event) => setOrderField(event.target.value)}
                        value={orderField}
                        type="text"
                        disabled={formik.isSubmitting}
                      />
                      <Tooltip title={`Add ${orderField} to list`}>
                        <Button
                          onClick={() => {
                            arrayHelpers.push(orderField);
                            setOrderField('');
                          }}
                          disabled={orderField === '' || formik.isSubmitting}
                        >
                          <AddIcon />
                        </Button>
                      </Tooltip>
                    </div>
                    <List>
                      {values.orders.map((order, i) => (
                        <ListItem key={`${i}order`}>
                          <div>
                            <Tooltip title={`Remove ${order} from list`}>
                              <Button onClick={() => arrayHelpers.remove(i)}>
                                <RemoveIcon />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Duplicate Order">
                              <Button onClick={() => arrayHelpers.insert(i, order)}>
                                <ContentCopyIcon />
                              </Button>
                            </Tooltip>
                            {i + 1}:{' '}
                            <input
                              type="text"
                              value={order}
                              onChange={(event) => arrayHelpers.replace(i, event.target.value)}
                            />
                            <ErrorMessage name={`orders[${i}]`} />
                          </div>
                        </ListItem>
                      ))}
                    </List>
                  </div>
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
      }}
    </Formik>
  );
}

function FulfilOrder() {
  return (<p>yeet</p>);
}

export default function OrdersPage(props: Props) {
  const [makingOrder, setMakingOrder] = React.useState(false);
  const [fulfillingOrder, setFulfillingOrder] = React.useState(false);

  return (
    <div>
      <div>
        <Button onClick={() => {
          setMakingOrder(true);
          setFulfillingOrder(false);
        }}
        >Make Order
        </Button>
        {makingOrder ? (
          <MakeForm communities={props.communities} />
        ) : undefined}
      </div>
      <Button onClick={() => {
        setMakingOrder(false);
        setFulfillingOrder(true);
      }}
      >Fulfil Order
      </Button>
      {fulfillingOrder ? (<FulfilOrder />) : undefined}
    </div>
  );
}

export async function getServerSideProps() {
  // Fetch communities from the server side
  const communities = await prisma.community.findMany({});

  return {
    props: {
      communities,
    },
  };
}
