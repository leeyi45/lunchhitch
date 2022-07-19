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

import { signOut } from '../../../auth';
import { SessionUser } from '../..';
import Logo from '../../media/logo.png';
import LunchHitch from '../../media/lunchhitch2.png';

export type NavbarProps = {
  user?: SessionUser | null;
};

/**
 * Navigation Bar component
 */
export default function NavBar({ user }: NavbarProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const router = useRouter();

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
            <Typography
              variant="h5"
              component="div"
              style={{
                flexGrow: 1, textAlign: 'left', paddingLeft: '10px',
              }}
            >
              <Image
                src={Logo}
                alt="logo"
                width="50px"
                height="30px"
              />
              {'   '}
              <Image
                src={LunchHitch}
                alt="Lunch Hitch"
                height="30px"
                width="225px"
                style={{ paddingRight: '20px' }}
              />
              <Button style={{ color: 'white', paddingInline: '20px' }}><Link href="/">Home</Link></Button>
              <Button style={{ color: 'white', paddingInline: '20px' }}><Link href="/orders">New Orders</Link></Button>
              <Button style={{ color: 'white', paddingInline: '20px' }}><Link href="/suggestions">Suggestions</Link></Button>
            </Typography>
          ) : (
            <Typography
              variant="h5"
              component="div"
              style={{ flexGrow: 1, justifyContent: 'left', paddingLeft: '10px' }}
            >
              <Image
                src={Logo}
                alt="logo"
                width="50px"
                height="30px"
              />
              {'   '}
              <Image
                src={LunchHitch}
                alt="Lunch Hitch"
                height="30px"
                width="225px"
                style={{ paddingRight: '20px' }}
              />
            </Typography>
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
              fontFamily: 'raleway',
            }}
            >
              {user?.displayName ?? 'Login'}
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
              ? [(
                <MenuItem key={0} onClick={handleClose}>
                  <Link href="/profile"><Button>Profile</Button></Link>
                </MenuItem>),
              (
                <MenuItem key={1}>
                  <Button onClick={() => {
                    signOut();
                    router.push('/');
                  }}
                  >Log out
                  </Button>
                </MenuItem>
              )]
              : [(
                <MenuItem key={0}>
                  <Link href={`/auth/login?callback=${encodeURIComponent(router.pathname)}`}><Button>Log In</Button></Link>
                </MenuItem>
              ), (
                <MenuItem key={1}>
                  <Link href="/auth/signup"><Button>Sign Up</Button></Link>
                </MenuItem>
              )]}
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
}

NavBar.defaultProps = {
  user: undefined,
};
