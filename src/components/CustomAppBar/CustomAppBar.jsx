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
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { BorderColor } from '@mui/icons-material';


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
        <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
            <Toolbar>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
            >
                <MenuIcon />
            </IconButton>
            <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example" sx={{
                '& .Mui-selected' : {
                    color: theme.palette.convert3HexTo6Hex(theme.palette.primary.contrastText),
                    // borderBottomColor: 'white',
                    // borderBottomWidth: 1
                }
            }}>
                {['Item One', 'Item Two', 'Item Three'].map((label, index) => {
                    return <Tab key={index} id={String(index)} label={label} aria-label={`tab of ${label}`}
                    sx = {{
                        color: 'white',
                        '& .Mui-selected' : {
                            color: 'white'
                        }
                    }} />;
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