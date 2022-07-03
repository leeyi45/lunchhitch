import React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { LunchHitchUser, signOut } from '../../auth';

export type NavbarProps = {
  user?: LunchHitchUser | null;
};

/**
 * Navigation Bar component
 */
export default function NavBar({ user }: NavbarProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [usernameText, setUsernameText] = React.useState('Login');
  const router = useRouter();

  React.useEffect(() => {
    setUsernameText(user ? user.displayName : 'Login');
  }, [user]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="static" style={{ background: '#50C878' }}>
      <Toolbar>
        { user
          ? (
            <Link href="/">
              <Typography
                variant="h6"
                component="div"
                style={{ flexGrow: 1, textAlign: 'left' }}
              >
                Lunch Hitch
              </Typography>
            </Link>
          ) : (
            <Link href="/">
              <Typography
                variant="h6"
                component="div"
                style={{ flexGrow: 1, textAlign: 'left' }}
              >
                Lunch Hitch
              </Typography>
            </Link>
          )}
        <div>
          <IconButton
            size="medium"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
            <text style={{
              paddingLeft: '5px',
            }}
            >
              {usernameText}
            </text>
          </IconButton>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            { user
              ? (
                <>
                  <MenuItem onClick={handleClose}>
                    <Button href="./profile">Profile</Button>
                  </MenuItem>
                  <MenuItem onClick={() => {
                    signOut();
                    router.push('/');
                  }}
                  >
                    Log out
                  </MenuItem>
                </>
              )
              : (
                <>
                  <MenuItem>
                    <Link href="./auth/login">Log In</Link>
                  </MenuItem>
                  <MenuItem>
                    <Link href="./auth/signup">Sign Up</Link>
                  </MenuItem>
                </>
              )}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

NavBar.defaultProps = {
  user: undefined,
};
