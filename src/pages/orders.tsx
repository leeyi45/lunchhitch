import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Community } from '@prisma/client';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import { Tooltip } from '@mui/material';
import prisma from '../prisma';

type Props = {
  communities: Community[];
}

function MakeForm(props: Props) {
  const submitCallback = async ({ community, orders }: { community: Community | null, orders: string[] }) => {
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

  const [orderField, setOrderField] = React.useState('');

  return (
    <Formik<{ community: Community | null, orders: string[] }>
      initialValues={{
        community: null,
        orders: [],
      }}
      onSubmit={submitCallback}
    >
      {(formik) => (
        <>
          <Form>
            <Autocomplete
              options={props.communities}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.community}
              getOptionLabel={(option) => option.name}
              renderInput={(params) => (<TextField {...params} label="Location" />)}
              renderOption={(_props, option) => (
                <>
                  <h6>{option.name}</h6>
                  {option.address}
                </>
              )}
            />
            <FieldArray name="orders">
              {(arrayHelpers) => (
                <div>
                  <div>
                    <input
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
                    {formik.values.orders.map((order, i) => (
                      <ListItem key={`${i}order`}>
                        <div>
                          <Tooltip title={`Remove ${order} from list`}>
                            <Button onClick={() => arrayHelpers.remove(i)}>
                              <RemoveIcon />
                            </Button>
                          </Tooltip>
                          {i + 1}: {order}
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
              disabled={formik.values.orders.length > 0}
              onClick={() => formik.setFieldValue('orders', [], false)}
            >Clear Orders
            </Button>
            <Button
              disabled={formik.values.orders.length > 0 && formik.values.community !== null && !formik.isSubmitting}
              type="submit"
            >Place Orders
            </Button>
          </div>
        </>
      )}
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
