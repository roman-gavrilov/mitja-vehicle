'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { AppBar, Toolbar, IconButton, Typography, Avatar, Menu, MenuItem, Box, Divider } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const router = useRouter();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    router.push('/dashboard/profile');
    handleClose();
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
    <AppBar position="static" elevation={1} sx={{ zIndex: 50, backgroundColor: 'transparent', boxShadow: 'none', padding: '20px 10px' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box sx={{ ml: '10px' }}>
          <Image
            src="/images/logo.png"
            alt="Logo"
            width={30}
            height={30}
            priority
          />
        </Box>
        <Box display="flex" alignItems="center" onClick={handleMenu} sx={{ cursor: 'pointer', ml: 'auto' }}>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            color="inherit"
            sx={{ padding: 0 }}
          >
            {
              user.companyDetails?.logo ? 
                <Avatar
                  alt={user.firstName}
                  src={user.companyDetails.logo}
                  sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                />
                :
                  <Avatar sx={{ bgcolor: 'primary.main' }} />
            }
          </IconButton>

          {/* <div className="ml-2 flex flex-col">
            <h2 className="text-base font-bold tracking-tight leading-none capitalize">
              {user.firstName} {user.lastName}
            </h2>
            {user.companyDetails?.companyName && (
              <p className="text-gray-600 text-xs tracking-tight leading-none capitalize">
                {user.companyDetails?.companyName}
              </p>
            )}
          </div> */}
        </Box>
  
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
          <MenuItem disabled>
            <EmailIcon sx={{ mr: 1 }} />
            <Typography variant="body2" color="textSecondary">
              {user.email}
            </Typography>
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleProfile}>
            <AccountCircleIcon sx={{ mr: 1 }} />
            My Profile
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;