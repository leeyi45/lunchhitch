import React from 'react';
import { Typography } from '@mui/material';
import DinnerDiningTwoToneIcon from '@mui/icons-material/DinnerDiningTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';

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
      <p style={{ fontSize: '30px' }}>
        <DinnerDiningTwoToneIcon />
        <b>Where food meets community{' '}</b>
        <PeopleTwoToneIcon />
      </p>
    </div>
  );
}
