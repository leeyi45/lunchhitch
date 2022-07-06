import React from 'react';
import AccountCircle from '@mui/icons-material/AccountCircle';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';

import { LunchHitchUser, signOut } from '../../auth';
import Logo from '../media/logo.png';

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
            <>
              <Image
                src={Logo}
                alt="logo"
                width={60}
                height={50}
              />
              <Typography
                variant="h5"
                component="div"
                style={{
                  flexGrow: 1, textAlign: 'left', paddingLeft: '10px', paddingRight: '20px',
                }}
              >
                Lunch Hitch
                <Button style={{ color: 'white', paddingInline: '30px' }}><Link href="/">Home</Link></Button>
                <Button style={{ color: 'white' }}><Link href="/orders">New Orders</Link></Button>
              </Typography>
            </>
          ) : (
            <>
              <Image
                src={Logo}
                alt="logo"
                width={60}
                height={50}
              />
              <Typography
                variant="h5"
                component="div"
                style={{ flexGrow: 1, textAlign: 'left', paddingLeft: '10px' }}
              >
                Lunch Hitch
              </Typography>
            </>
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
                    <Button><Link href="/profile">Profile</Link></Button>
                  </MenuItem>
                  <MenuItem>
                    <Button onClick={() => {
                      signOut();
                      router.push('/');
                    }}
                    >Log out
                    </Button>
                  </MenuItem>
                </>
              )
              : (
                <>
                  <MenuItem>
                    <Button href="/auth/login">Log In</Button>
                  </MenuItem>
                  <MenuItem>
                    <Button href="/auth/signup">Sign Up</Button>
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
