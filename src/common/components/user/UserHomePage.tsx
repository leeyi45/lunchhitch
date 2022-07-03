import React from 'react';
import { Button, Typography } from '@mui/material';
import { LunchHitchUser } from '../../../auth';
import SwipeableEdgeDrawer from '../SwipeableEdgeDrawer/SwipeableEdgeDrawer';

import styles from './UserHomePage.module.css';

export default function UserHomePage({ user }: { user: LunchHitchUser }) {
  return (
    <div className={styles.UserHomePage}>
      <Typography
        variant="h1"
        component="div"
      >
        Welcome back {user.username}!
      </Typography>
      <p style={{ fontSize: '30px' }}>What will it be today?</p>
      <Button variant="outlined" href="http://localhost:3000/orders" style={{ color: '#50C878', backgroundColor: 'white' }}>New Orders</Button>
      <SwipeableEdgeDrawer />

    </div>
  );
}
