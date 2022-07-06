/* eslint-disable no-empty-pattern */
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Button, ClickAwayListener, Popover } from '@mui/material';
import { Order, Shop } from '@prisma/client';
import { Form, Formik } from 'formik';

import { LunchHitchUser } from '../../auth';
// import { GetServerSideProps } from 'next';
import { useSession } from '../../auth/auth_provider';
import Box from '../../common/components/Box/Box';
import NavBar from '../../common/navbar';
// import { getSession } from '../../firebase/admin';
import prisma, { LunchHitchCommunity } from '../../prisma';

import FulFillForm from './fulfill_form';
import MadeDisplay from './made_display';
import MakeForm from './make_form';
import ShopSelector from './shop_selector';
import { GetServerSideProps } from 'next';
import { getSession } from '../../firebase/admin';

type Props = {
  communities: LunchHitchCommunity[];
}

export default function OrdersPage({ communities }: Props) {
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
      <NavBar user={user as LunchHitchUser} />
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
                }}
                onSubmit={async (values) => {
                  setSuccessPopover('Successfully placed your order!');
                  await fetch('/api/prisma?collection=orders&method=create', {
                    method: 'POST',
                    body: JSON.stringify({
                      where: {
                        from: user!.username,
                        orders: values.orders,
                        shop: shop!.id,
                      },
                    }),
                  });
                }}
              >
                {({ isSubmitting, ...formik }) => (
                  <Form>
                    <MakeForm
                      isSubmitting={isSubmitting}
                      onSubmit={() => formik.handleSubmit()}
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
  console.log('User in api route is ', user);

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
};
