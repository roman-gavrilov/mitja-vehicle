'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Box } from '@mui/material';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';

const Header = ({ fullname, toggleSidebar, isSidebarCollapsed }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const initials = fullname
    ? fullname.split(" ").map((name) => name[0]).join("")
    : '';

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        router.push('/login'); // Redirect to login page after successful logout
      } else {
        console.error('Logout failed');
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Logout error:', error);
      // You might want to show an error message to the user here
    }
    handleClose();
  };

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ zIndex: 50 }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton
          edge="start"
          color="inherit"
          aria-label="toggle sidebar"
          onClick={toggleSidebar}
        >
          {isSidebarCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
        <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={40}
            height={40}
            priority
          />
        </Box>
        <IconButton
          size="large"
          aria-label="account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <Avatar sx={{ bgcolor: 'primary.main' }}>{initials}</Avatar>
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
          <MenuItem onClick={handleLogout}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;