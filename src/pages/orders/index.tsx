/* eslint-disable no-empty-pattern */
import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import RefreshIcon from '@mui/icons-material/Refresh';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import Stack from '@mui/material/Stack';
import { Shop } from '@prisma/client';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';

import { APIResult, wrapApiResult } from '../../api_helpers';
import AuthSelector from '../../common/auth_selector';
import Box from '../../common/components/Box';
import NavBar from '../../common/components/navbar';
import { LinkedPopover, PopoverContainer } from '../../common/components/popovers';
import prisma from '../../prisma';
import type { LunchHitchCommunity } from '../../prisma/types';

import FulFillForm from './fulfill_form';
import FulfilledDisplay from './fulfilled_display';
import MadeDisplay from './made_display';
import MakeForm from './make_form';
import ShopSelector from './shop_selector';

import styles from './orders.module.css';

type Props = {
  communities: APIResult<LunchHitchCommunity[]>;
}

const OrdersPage = ({ communities }: Props) => {
  const [shop, setShop] = React.useState<Shop | null>(null);
  const router = useRouter();
  const [selected, setSelected] = React.useState(false);

  const handleSelected = () => {
    setSelected(true);
  };

  return (
    <div className={styles.orders}>
      <AuthSelector>
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
              <Stack direction="column">
                <h1 style={{ color: '#50C878', textAlign: 'center', paddingTop: '10%' }}>Choose your community and shop to start!</h1>
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
                  <Box style={{ backgroundColor: 'rgba(255, 219, 184, 0.9)' }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      paddingRight: '10px',
                    }}
                    >
                      <FulFillForm shop={shop} user={user} />
                    </div>
                  </Box>
                  <Box style={{ backgroundColor: 'rgba(255, 217, 217, 0.9)' }}>
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
                <Stack direction="row">
                  <MadeDisplay user={user} />
                  <FulfilledDisplay user={user} />
                </Stack>
              </Stack>
            </PopoverContainer>
          </>
        )}
      </AuthSelector>
    </div>
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
