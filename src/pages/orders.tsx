/* eslint-disable no-empty-pattern */
import React from 'react';
import { createInstance } from 'react-async';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import type { Shop } from '@prisma/client';
import memoize from 'lodash/memoize';
import Head from 'next/head';
import { useRouter } from 'next/router';

import { APIResult, fetchApiThrowOnError, wrapApiResult } from '../api_helpers';
import SSRAuthHandler from '../api_helpers/server_props';
import { useNullableState } from '../common';
import NavBar from '../common/components/navbar';
import { FulfilledDisplay, MadeDisplay, MakeForm } from '../common/components/orders';
import FulFillForm from '../common/components/orders/fulfill_form';
import ShopSelector from '../common/components/orders/shop_selector';
import { LinkedPopover, PopoverContainer } from '../common/components/popovers';
import Tabs from '../common/components/tabs';
import prisma from '../prisma';
import type { LunchHitchCommunity, LunchHitchOrder, SessionUser } from '../prisma/types';

import styles from '../common/components/orders/orders.module.css';

type Props = {
  communities: APIResult<LunchHitchCommunity[]>;
  user: SessionUser;
}

const FulfillerAsync = createInstance<LunchHitchOrder[]>({
  deferFn: memoize(([shop], { user }) => fetchApiThrowOnError<LunchHitchOrder[]>('orders', {
    where: {
      AND: [{ NOT: { fromId: user.username } },
        // TODO fix this filter
        // { fulfillerId: null } ,
        { shopId: shop.id },
      ],
    },
  })),
});

const MadeAsync = createInstance<LunchHitchOrder[]>({
  promiseFn: memoize(({ user }) => fetchApiThrowOnError<LunchHitchOrder[]>('orders', {
    where: {
      fromId: user.username,
    },
  })),
});

const FulfilledAsync = createInstance<LunchHitchOrder[]>({
  promiseFn: memoize(({ user }) => fetchApiThrowOnError<LunchHitchOrder[]>('orders', {
    where: {
      fulfillerId: user.username,
    },
  })),
});

const OrdersPage = ({ communities, user }: Props) => {
  const router = useRouter();
  const [shop, setShop] = useNullableState<Shop>();

  return (
    <>
      <Head>
        <title>Orders</title>
      </Head>
      <div className={styles.orders}>
        <NavBar user={user} />
        <PopoverContainer
          popovers={{
            errorPopover: communities.result === 'error',
            fulfillPopover: false,
            fulfillSuccess: false,
            makeFormClear: false,
            makeFormConfirm: false,
            makeFormSuccess: false,
            madeRemove: false,
          }}
        >
          <LinkedPopover
            name="errorPopover"
          >
            <Stack direction="column">
              <p style={{
                textAlign: 'center',
              }}
              >
                An error occurred<br />
                Reload the page to try again<br />
                {communities.result === 'error' && communities.value}<br />
              </p>
              <Button onClick={() => router.replace(router.pathname)}>
                <RefreshIcon />
              </Button>
            </Stack>
          </LinkedPopover>
          <Tabs
            tabs={{
              'Make New Orders': (
                <Stack direction="column" sx={{ paddingBottom: '16vh' }}>
                  <h1 style={{ color: '#50C878', textAlign: 'center', paddingTop: '8%' }}>Choose your community and shop to start!</h1>
                  <div style={{
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    marginBlock: '50px',
                    height: '50vh',
                  }}
                  >
                    <ShopSelector
                      communities={communities.result === 'success' ? communities.value : []}
                      value={shop}
                      onChange={setShop}
                    />
                    <Collapse in={!!shop} sx={{ width: '11%', paddingTop: '20px', marginInline: '44.5%' }}>
                      <Alert icon={<CheckIcon fontSize="inherit" />} severity="success">
                        Scroll down!
                      </Alert>
                    </Collapse>
                  </div>
                  <Stack direction="row">
                    <div style={{ width: '50%', marginLeft: '20px' }}>
                      <FulfillerAsync user={user}>
                        {({ run }) => (<FulFillForm run={run} Async={FulfillerAsync} shop={shop} />)}
                      </FulfillerAsync>
                    </div>
                    <div style={{ width: '50%', paddingRight: '40px' }}>
                      <MakeForm shop={shop} />
                    </div>
                  </Stack>
                </Stack>
              ),
              'My Orders': (
                <Stack key={1} direction="row">
                  <MadeAsync user={user}>
                    <MadeDisplay Async={MadeAsync} />
                  </MadeAsync>
                  <FulfilledAsync user={user}>
                    <FulfilledDisplay Async={FulfilledAsync} />
                  </FulfilledAsync>
                </Stack>
              ),
            }}
          />
        </PopoverContainer>
      </div>
    </>
  );
};

export default OrdersPage;

export const getServerSideProps = SSRAuthHandler()(async ({ username }) => {
  const communities = await wrapApiResult(() => prisma.community.findMany({
    include: {
      shops: true,
    },
  }));

  const user = await prisma.userInfo.findUnique({
    where: {
      username,
    },
    select: {
      username: true,
      displayName: true,
    },
  });
  return ({
    communities,
    user,
  });
});
