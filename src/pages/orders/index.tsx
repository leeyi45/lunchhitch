/* eslint-disable no-empty-pattern */
import React from 'react';
import { createInstance } from 'react-async';
import RefreshIcon from '@mui/icons-material/Refresh';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { Shop } from '@prisma/client';
import { memoize } from 'lodash';
import { useRouter } from 'next/router';

import { APIResult, fetchApiThrowOnError, wrapApiResult } from '../../api_helpers';
import SSRAuthHandler from '../../api_helpers/server_props';
import { useNullableState } from '../../common';
import NavBar from '../../common/components/navbar';
import { LinkedPopover, PopoverContainer } from '../../common/components/popovers';
import Tabs from '../../common/components/tabs';
import prisma from '../../prisma';
import type { LunchHitchCommunity, LunchHitchOrder, SessionUser } from '../../prisma/types';

import FulFillForm from './fulfill_form';
import FulfilledDisplay from './fulfilled_display';
import MadeDisplay from './made_display';
import MakeForm from './make_form';
import ShopSelector from './shop_selector';

import styles from './orders.module.css';

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
    <div className={styles.orders}>
      <NavBar user={user} />
      <PopoverContainer
        popovers={{
          errorPopover: communities.result === 'error',
          fulfillPopover: false,
          fulfillSuccess: false,
          makeFormClear: false,
          makeFormConfirm: false,
          makeSuccess: false,
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
              <Stack direction="column">
                <div style={{
                  paddingLeft: '20px',
                  paddingRight: '20px',
                }}
                >
                  <ShopSelector
                    communities={communities.result === 'success' ? communities.value : []}
                    value={shop}
                    onChange={setShop}
                  />
                </div>
                <Stack direction="row">
                  <FulfillerAsync user={user}>
                    {({ run }) => (<FulFillForm run={run} Async={FulfillerAsync} shop={shop} />)}
                  </FulfillerAsync>
                  <MakeForm shop={shop} />
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
