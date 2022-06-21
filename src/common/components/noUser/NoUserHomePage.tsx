import React from 'react';
import { Typography } from '@mui/material';

import styles from './NoUserHomePage.module.css';

export default function NoUserHomePage() {
  return (
    <div className={styles.NoUserHomePage}>
      <Typography
        variant="h1"
        component="div"
      >
        Welcome to LunchHitch
      </Typography>
      <p>
        Where food meets community
      </p>
    </div>
  );
}
