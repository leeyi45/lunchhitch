import { Popover } from '@mui/material';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { Community, Order, Shop } from '@prisma/client';
import { Form, Formik } from 'formik';
import { useSession } from 'next-auth/react';
import React from 'react';
import { LunchHitchUser } from '../../auth';
import NavBar from '../../common/navbar';
import prisma from '../../prisma';
import FulFillForm from './fulfill_form';
import MakeForm from './make_form';
import ShopSelector from './shop_selector';

type Props = {
  communities: Community[];
}

export default function OrdersPage(props: Props) {
  const [shop, setShop] = React.useState<Shop | null>(null);
  const divRef = React.useRef<HTMLDivElement | null>(null);

  const [makePopover, setMakePopover] = React.useState(false);

  const { data: session } = useSession({
    required: true,
  });

  if (!session) {
    return (<CircularProgress />);
  }

  const user = session!.user as LunchHitchUser;

  return (
    <div
      ref={divRef}
    >
      <NavBar user={user} />
      <ShopSelector
        communities={props.communities}
        value={shop}
        onChange={setShop}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}
      >
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          paddingRight: '10px',
        }}
        >
          <h2>Fulfill an Order!</h2>
          <Formik<{ order: Order | null}>
            initialValues={{
              order: null,
            }}
            onSubmit={async (values) => {

            }}
          >
            {({ isSubmitting, ...formik }) => (
              <Form>
                <FulFillForm
                  shop={shop}
                  isSubmitting={isSubmitting}
                  onSelect={(order) => formik.setFieldValue('order', order)}
                  onSubmit={formik.submitForm}
                  popoverElement={divRef.current}
                />
              </Form>
            )}
          </Formik>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'center',
          }}
        >
          <h2>Place an Order!</h2>
          <Formik
            initialValues={{
              orders: [],
            }}
            onSubmit={async (values) => {
              await fetch('/api/prisma?collection=orders&method=create', {
                method: 'POST',
                body: JSON.stringify({
                  where: {
                    from: user.username,
                    orders: values.orders,
                    shop: shop!.id,
                  },
                }),
              });
            }}
          >
            {({ isSubmitting, ...formik }) => (
              <Form>
                <Popover
                  open={Boolean(makePopover)}
                  anchorEl={divRef.current}
                >
                  Confirm your order from {shop?.name}:
                  <ol>
                    {formik.values.orders.map((order, i) => (<li key={i}>{order}</li>))}
                  </ol>
                  <Button
                    color="success"
                    onClick={formik.submitForm}
                  >
                    Confirm
                  </Button>
                  <Button
                    color="error"
                    onClick={() => setMakePopover(false)}
                  >
                    Cancel
                  </Button>
                </Popover>
                <MakeForm
                  popoverElement={divRef.current!}
                  isSubmitting={isSubmitting}
                  onSubmit={() => setMakePopover(true)}
                  onChange={(newValue) => formik.setFieldValue('orders', newValue)}
                />
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  // TODO:
  // Honestly not sure if we should fetch ALL communities server side
  // or load communities as the user types
  const communities = await prisma.community.findMany();

  return {
    props: {
      communities,
    },
  };
}
