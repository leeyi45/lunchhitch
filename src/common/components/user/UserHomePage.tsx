import { LunchHitchUser } from '../../../auth';
import SwipeableEdgeDrawer from "../SwipeableEdgeDrawer/SwipeableEdgeDrawer";
import { Button, Typography } from '@mui/material';

import styles from './UserHomePage.module.css';

export default function UserHomePage({ user }: { user: LunchHitchUser }) {
    return (
      <div className={styles.UserHomePage}>
        <Typography
        variant="h1"
        component="div"
        >
          Welcome back!
        </Typography>
        <p style={{fontSize: '30px'}}>What will it be today?
          
        </p>
        <Button variant="outlined" href="http://localhost:3000/orders" style={{color: "#50C878", backgroundColor: 'white'}}>New Orders</Button>
        <p>


        </p>
        <SwipeableEdgeDrawer />

      </div>
    );
  }