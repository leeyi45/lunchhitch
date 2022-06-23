import { LunchHitchUser } from '../../../auth';
import SwipeableEdgeDrawer from "../SwipeableEdgeDrawer/SwipeableEdgeDrawer";
import { Button } from '@mui/material';

export default function UserHomePage({ user }: { user: LunchHitchUser }) {
    return (
      <>
        <h1>
          Welcome back,
          {user.displayName}
          !
        </h1>
        <p>What will it be today?</p>
        <Button variant="outlined" href="../../../pages/orders/index" style={{color: "50C878"}}>New Orders</Button>
        <SwipeableEdgeDrawer />

      </>
    );
  }