import { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import MenuItem from "@material-ui/core/MenuItem";
import Menu from "@material-ui/core/Menu";
import { User } from 'firebase/auth';
import Link from "next/link";

export type NavbarProps = {
  user: User | null;
};

/**
 * Navigation Bar component
 */
export default function NavBar({user}: NavbarProps) {
    const [anchorEl, setAnchorEl] = useState(null);
    
    const handleLogout = () => {
        handleClose();
        // signOut();
  };

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

    return (
    <AppBar position="static" style = {{background: '#454B1B'}}>
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          style={{ flexGrow: 1, textAlign: "left" }}
        >
          Lunch Hitch
        </Typography>
        {(
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
              }}>{user !== null ? user.displayName : 'Login'}</text>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right"
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>Profile</MenuItem>
              <MenuItem onClick={handleClose}>My account</MenuItem>
              { user !== null 
                ? <MenuItem onClick={handleLogout}>Log out</MenuItem>
                : <MenuItem>
                  <Link href='/login' >Log In</Link>
                </MenuItem>
              }
            </Menu>
          </div>
        )}
      </Toolbar>
    </AppBar>
  );
}
