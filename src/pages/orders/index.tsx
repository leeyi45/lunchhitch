/* eslint-disable no-empty-pattern */
import React from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import {
  Button, Stack,
} from '@mui/material';
import { Shop } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { APIResult, wrapApiResult } from '../../api_helpers';
import AuthSelector from '../../common/auth_selector';
import Box from '../../common/components/Box';
import NavBar from '../../common/components/navbar';
import { LinkedPopover, PopoverContainer } from '../../common/components/popovers';
import prisma, { LunchHitchCommunity } from '../../prisma';

import FulFillForm from './fulfill_form';
import MadeDisplay from './made_display';
import MakeForm from './make_form';
import ShopSelector from './shop_selector';

type Props = {
  communities: APIResult<LunchHitchCommunity[]>;
}

const OrdersPage = ({ communities }: Props) => {
  const [shop, setShop] = React.useState<Shop | null>(null);
  const router = useRouter();

  return (
    <AuthSelector force>
      {(user) => (
        <>
          <NavBar user={user} />
          <PopoverContainer
            popovers={{
              errorPopover: communities.result === 'error',
              fulfillPopover: false,
              fulfillSuccess: false,
              makeFormClear: false,
              makeFormConfirm: false,
              makeSuccess: false,
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
              <MadeDisplay user={user} />
            </Stack>
          </PopoverContainer>
        </>
      )}
    </AuthSelector>
  );
};

export default OrdersPage;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  // TODO:
  // Honestly not sure if we should fetch ALL communities server side
  // or load communities as the user types
  const communities = await wrapApiResult(() => prisma.community.findMany({
    include: {
      shops: true,
    },
  }));

  return {
    props: {
      communities,
    },
  };
};
