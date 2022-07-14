import React from 'react';
import { Typography } from '@mui/material';

import SwipeableEdgeDrawer from '../../../common/components/SwipeableEdgeDrawer';

import styles from './UserHomePage.module.css';

export default function UserHomePage() {
  // const { user } = useSession();
  return (
    <div className={styles.UserHomePage}>
      <Typography
        variant="h1"
        component="div"
      >
        Welcome back!
      </Typography>
      <p style={{ fontSize: '30px' }}>What will it be today?

      </p>
      <SwipeableEdgeDrawer />

    </div>
  );
}
