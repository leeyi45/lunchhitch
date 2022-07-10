/* eslint-disable no-empty-pattern */
import React from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import {
  Button, Stack,
} from '@mui/material';
import { Shop } from '@prisma/client';
import { GetServerSideProps } from 'next';

import AuthSelector from '../../common/auth_selector';
import Box from '../../common/components/Box/Box';
import NavBar from '../../common/components/navbar';
import { LinkedPopover, PopoverContainer } from '../../common/components/popovers';
import { getSession } from '../../firebase/admin';
import prisma, { LunchHitchCommunity, LunchHitchOrder } from '../../prisma';

import FulFillForm from './fulfill_form';
import MadeDisplay from './made_display';
import MakeForm from './make_form';
import ShopSelector from './shop_selector';

type Props = {
  communities: LunchHitchCommunity[];
  userOrders: LunchHitchOrder[];
}

const OrdersPage = ({ communities, userOrders }: Props) => {
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
              makeFormClear: false,
              makeFormConfirm: false,
            }}
          >
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
                    <FulFillForm shop={shop} />
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
                    <MakeForm shop={shop} />
                  </div>
                </Box>
              </Stack>
              {/* <MadeDisplay user={user} /> */}
            </Stack>
          </PopoverContainer>
        </>
      )}
    </AuthSelector>
  );
};

export default OrdersPage;

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const user = await getSession(req.cookies.token);
  console.log('User is', user);

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
    const userOrders = await prisma.order.findMany({
      where: {
        fromId: user!,
      },
      include: {
        from: true,
        shop: true,
        fulfiller: true,
      },
    });

    const communities = await prisma.community.findMany({
      include: {
        shops: true,
      },
    });

    return {
      props: {
        communities,
        userOrders,
      },
    };
  } catch (error) {
    return {
      props: {
        communities: [],
        userOders: [],
      },
    };
  }
};
