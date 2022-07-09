/* eslint-disable no-empty-pattern */
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Button, ClickAwayListener, Popover, Stack,
} from '@mui/material';
import { Order, Shop } from '@prisma/client';
import { Form, Formik } from 'formik';
import moment from 'moment';
import { GetServerSideProps } from 'next';

import { useSession } from '../../auth/auth_provider';
import AuthSelector from '../../common/auth_selector';
import Box from '../../common/components/Box/Box';
import NavBar from '../../common/components/navbar';
import { LinkedPopover, PopoverContainer } from '../../common/popovers';
import { getSession } from '../../firebase/admin';
import prisma, { LunchHitchCommunity } from '../../prisma';

import FulFillForm from './fulfill_form';
import MadeDisplay from './made_display';
import MakeForm from './make_form';
import ShopSelector from './shop_selector';

type Props = {
  communities: LunchHitchCommunity[];
}

const OrdersPage = ({ communities }: Props) => {
  const [shop, setShop] = React.useState<Shop | null>(null);

  return (
    <AuthSelector force>
      {(user) => (
        <>
          <NavBar user={user} />
          <PopoverContainer
            popovers={{
              successPopover: (
                <LinkedPopover
                  name="successPopover"
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                  anchorReference="none"
                >
                  {(setOpen) => (
                    <div
                      style={{
                        padding: '10px, 10px, 10px, 10px',
                      }}
                    >
                      <CheckCircleIcon />
                      <p>Successfully placed your order!</p>
                      <Button
                        onClick={() => setOpen(false)}
                      >
                        Done
                      </Button>
                    </div>
                  )}
                </LinkedPopover>
              ),
              fulfillPopover: false,
            }}
          >
            {(values, setPopover) => (
              <Stack direction="column">
                <ShopSelector
                  communities={communities}
                  value={shop}
                  onChange={setShop}
                />
                <Stack direction="row">
                  <Box>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingRight: '10px',
                    }}
                    >
                      <FulFillForm
                        onSubmit={(order) => {
                          // TODO figure out how to accept orders
                        }}
                        shop={shop}
                      />
                    </div>
                  </Box>
                  <Box>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignContent: 'center',
                      }}
                    >
                      <h2 style={{ color: '#47b16a' }}>Place an Order!</h2>
                      <Formik
                        initialValues={{
                          orders: [],
                          deliverBy: moment(),
                        }}
                        onSubmit={async ({ orders, deliverBy }) => {
                          await fetch('/api/orders/create', {
                            method: 'POST',
                            body: JSON.stringify({
                              orders,
                              shopId: shop!.id,
                              deliverBy,
                            }),
                          });
                          setPopover('successPopover', true);
                        }}
                      >
                        {({ isSubmitting, ...formik }) => (
                          <Form>
                            <MakeForm
                              isSubmitting={isSubmitting}
                              onSubmit={() => formik.handleSubmit()}
                              onDateChange={(newDate) => formik.setFieldValue('deliverby', newDate)}
                              onChange={(newValue) => formik.setFieldValue('orders', newValue)}
                              shop={shop}
                            />
                          </Form>
                        )}
                      </Formik>
                    </div>
                  </Box>
                </Stack>
                <MadeDisplay user={user} />
              </Stack>
            )}
          </PopoverContainer>
        </>
      )}
    </AuthSelector>
  );
};

export default OrdersPage;

export function OrdersPage2({ communities }: Props) {
  const [shop, setShop] = React.useState<Shop | null>(null);
  const [popoverOpened, setPopoverOpened] = React.useState(false);
  const [successPopover, setSuccessPopover] = React.useState<string | null>(null);

  const { user } = useSession();

  return (
    <div
      style={{
        filter: popoverOpened || !!successPopover ? 'blur(3px)' : '',
      }}
    >
      <NavBar user={user} />
      <ShopSelector
        communities={communities}
        value={shop}
        onChange={setShop}
      />
      <Popover
        open={successPopover !== null}
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        anchorReference="none"
      >
        <ClickAwayListener
          onClickAway={() => setSuccessPopover(null)}
        >
          <div
            style={{
              padding: '10px, 10px, 10px, 10px',
            }}
          >
            <CheckCircleIcon />
            <p>{successPopover}</p>
            <Button
              onClick={() => setSuccessPopover(null)}
            >
              Done
            </Button>
          </div>
        </ClickAwayListener>
      </Popover>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
          }}
        >
          <Box>
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              paddingRight: '10px',
            }}
            >
              <Formik<{ order: Order | null }>
                initialValues={{
                  order: null,
                }}
                onSubmit={async () => {
                  // TODO need to figure out how to accept orders
                }}
              >
                {({ isSubmitting, ...formik }) => (
                  <Form>
                    <FulFillForm
                      shop={shop}
                      isSubmitting={isSubmitting}
                      onSelect={(order) => formik.setFieldValue('order', order)}
                      onSubmit={formik.submitForm}
                      onPopoverChanged={setPopoverOpened}
                    />
                  </Form>
                )}
              </Formik>
            </div>
          </Box>
          <Box>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignContent: 'center',
              }}
            >
              <h2 style={{ color: '#47b16a' }}>Place an Order!</h2>
              <Formik
                initialValues={{
                  orders: [],
                  deliverBy: moment(),
                }}
                onSubmit={async ({ orders, deliverBy }) => {
                  setSuccessPopover('Successfully placed your order!');
                  await fetch('/api/orders/create', {
                    method: 'POST',
                    body: JSON.stringify({
                      orders,
                      shopId: shop!.id,
                      deliverBy,
                    }),
                  });
                }}
              >
                {({ isSubmitting, ...formik }) => (
                  <Form>
                    <MakeForm
                      isSubmitting={isSubmitting}
                      onSubmit={() => formik.handleSubmit()}
                      onDateChange={(newDate) => formik.setFieldValue('deliverby', newDate)}
                      onChange={(newValue) => formik.setFieldValue('orders', newValue)}
                      onPopoverChange={setPopoverOpened}
                      shop={shop}
                    />
                  </Form>
                )}
              </Formik>
            </div>
          </Box>
        </div>
        <Box>
          <MadeDisplay user={user!} />
        </Box>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getSession(req.cookies.token);
  console.log('User is ', user);

  // if (!user) {
  //   return {
  //     redirect: {
  //       permanent: false,
  //       destination: '/auth/login?callback=orders',
  //     },
  //     props: {},
  //   };
  // }

  // TODO:
  // Honestly not sure if we should fetch ALL communities server side
  // or load communities as the user types
  try {
    const communities = await prisma.community.findMany({
      include: {
        shops: true,
      },
    });

    return {
      props: {
        communities,
      },
    };
  } catch (error) {
    return {
      props: {
        communities: [],
      },
    };
  }
};
