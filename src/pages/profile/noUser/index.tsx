import React from 'react';
import DinnerDiningTwoToneIcon from '@mui/icons-material/DinnerDiningTwoTone';
import PeopleTwoToneIcon from '@mui/icons-material/PeopleTwoTone';
import { Typography } from '@mui/material';

import styles from './NoUserHomePage.module.css';

export default function NoUserHomePage() {
  return (
    <div className={styles.NoUserHomePage}>
      <Typography
        variant="h1"
      >
        <div style={{ fontFamily: 'raleway', fontSize: '90px', fontWeight: 'bold' }}>Welcome to Lunch Hitch</div>
      </Typography>
      <p style={{ fontSize: '30px' }}>
        <DinnerDiningTwoToneIcon />
        Where food meets community{' '}
        <PeopleTwoToneIcon />
      </p>
    </div>
  );
}
