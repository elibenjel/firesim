import React from 'react';
import { useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import HelpIcon from '@mui/icons-material/Help';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { BorderColor } from '@mui/icons-material';
import { maxWidth } from '@mui/system';


const CustomAppBar = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [tab, setTab] = useState(0);

    const theme = useTheme();
    console.log(theme.palette);

    const handleChange = (event, newTab) => {
      setTab(newTab);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{
            flexGrow: 1
        }}>
        <AppBar position="static">
            <Toolbar disableGutters >
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ m: '0 1rem 0' }}
            >
                <MenuIcon />
            </IconButton>
            <Tabs
                value={tab}
                // variant='scrollable'
                onChange={handleChange}
                aria-label="basic tabs example"
                textColor='primary'
                sx={{
                    // flex: 1,
                    // m: 2,
                    // '& .Mui-selected' : {
                    //     backgroundColor: theme.palette.grey[50],
                    //     borderRadius: 2,
                    //     fontWeight: 'bold',
                    //     m: 1
                    // },
                    // '& .MuiTab-root' : {
                    //     color: theme.palette.primary.contrastText,
                    // },
                    // '& .MuiTabs-indicator' : {
                    //     backgroundColor: theme.palette.grey[50],
                    // },
                    // '& .MuiTabScrollButton' : {
                    //     color:theme.palette.grey[50],
                    //     backgroundColor: theme.palette.grey[50],
                    // }
                }}
                // TabScrollButtonProps={{
                //     style: {
                //         color:theme.palette.grey[50],
                //         // backgroundColor: theme.palette.grey[50]
                //     }
                // }}
            >
                {['Item One', 'Item Two', 'Item Three'].map((label, index) => {
                    return (
                        <Tab
                            key={index} id={String(index)}
                            label={label} aria-label={`tab of ${label}`}
                            icon={<HelpIcon />} iconPosition='start'
                        />
                    );
                })}
            </Tabs>
            <div>
                <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ m : '0 1rem 0' }}
                >
                <AccountCircle />
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
                open={!!anchorEl}
                onClose={handleClose}
                >
                <MenuItem onClick={handleClose}>Profile</MenuItem>
                <MenuItem onClick={handleClose}>My account</MenuItem>
                </Menu>
            </div>
            </Toolbar>
        </AppBar>
        </Box>
    );
}

export default CustomAppBar