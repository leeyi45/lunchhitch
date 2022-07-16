import React from 'react';
import { Stack, Typography } from '@mui/material';

import Box from '../../../common/components/Box';
import SwipeableEdgeDrawer from '../../../common/components/SwipeableEdgeDrawer';

import styles from './UserHomePage.module.css';

export default function UserHomePage() {
  // const { user } = useSession();
  return (
    <div className={styles.UserHomePage}>
      <Stack direction="column">
        <Box style={{
          display: 'flex',
          flexDirection: 'column',
          width: '50%',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          left: '25%',
          top: '25%',
          textAlign: 'center',
          backgroundColor: 'rgba(152, 255, 152, 0.7)',
        }}
        >
          <Typography
            variant="h1"
            style={{ fontSize: '100px', textShadow: '2px 8px 6px rgba(0,0,0,0.2), 0px -5px 35px rgba(255,255,255,0.3)' }}
          >
            Welcome back!
          </Typography>
        </Box>
        <p style={{ fontSize: '30px' }}>What will it be today?

        </p>
        <SwipeableEdgeDrawer />
      </Stack>
    </div>
  );
}
