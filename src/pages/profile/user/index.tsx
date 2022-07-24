import React from 'react';
import { Stack, Typography } from '@mui/material';

import SwipeableEdgeDrawer from '../../../common/components/SwipeableEdgeDrawer';

import styles from './UserHomePage.module.css';

export default function UserHomePage() {
  // const { user } = useSession();
  return (
    <div className={styles.UserHomePage}>
      <Stack direction="column">
        <Typography
          variant="h1"
          style={{ fontSize: '100px', textShadow: '2px 8px 6px rgba(0,0,0,0.4), 0px -5px 35px rgba(255,255,255,1)', textAlign: 'center' }}
        >
          Welcome back!
        </Typography>
        <p style={{ fontSize: '30px' }}>What will it be today?

        </p>
        <SwipeableEdgeDrawer />
      </Stack>
    </div>
  );
}
