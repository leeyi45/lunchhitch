import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { User } from 'firebase/auth';
import AuthenticationUI from './auth_ui';
import FIREBASE_AUTH from '../firebase/auth';

export type NavbarProps = {
  user: User | null;
};

/**
 * Navigation Bar component
 */
export default function NavBar({ user }: NavbarProps) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [displayLogIn, setDisplayLogIn] = React.useState(false);
  const [usernameText, setUsernameText] = React.useState('Login');

  React.useEffect(() => {
    setUsernameText(user ? user.displayName! : 'Login');
    setDisplayLogIn(user === undefined);
  }, [user]);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    FIREBASE_AUTH.signOut();
  };

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <AppBar position="static" style={{ background: '#454B1B' }}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          style={{ flexGrow: 1, textAlign: 'left' }}
        >
          Lunch Hitch
        </Typography>
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
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>My account</MenuItem>
            { user !== null
              ? <MenuItem onClick={handleLogout}>Log out</MenuItem>
              : <MenuItem onClick={() => setDisplayLogIn(true)}>Log In</MenuItem>}
          </Menu>
        </div>
        {displayLogIn ? <AuthenticationUI onSignIn={() => setDisplayLogIn(false)} /> : undefined}
      </Toolbar>
    </AppBar>
  );
}
