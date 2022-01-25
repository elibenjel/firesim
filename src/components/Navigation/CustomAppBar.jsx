import React, { useState } from 'react';
import i18next from 'i18next';
import {
    Box,
    Tabs,
    AppBar,
    Menu,
    MenuItem,
    IconButton
} from '@mui/material';
import {
    AccountCircle,
    Whatshot,
    TrendingUp,
    Help
} from '@mui/icons-material';

import LinkTab from './LinkTab.jsx';

const tabs = [
    {
        name: 'home',
        label: i18next.t('tab1', { ns : 'Navigation'}),
        to: '/home',
        icon: <Help />
    },
    {
        name: 'fastsim',
        label: i18next.t('tab2', { ns : 'Navigation'}),
        to: '/fastsim',
        icon: <TrendingUp />
    }
];


const CustomAppBar = (props) => {
    const { selected } = props;
    const [anchorEl, setAnchorEl] = useState(null);

    const lastActiveIndex = Number(localStorage.getItem('lastActiveIndex-CustomAppBar'));
    console.log(lastActiveIndex)
    const [activeIndex, setActiveIndex] = useState(lastActiveIndex || (selected in tabs ? selected : 0));

    const handleChange = (event, newValue) => {
        localStorage.setItem('lastActiveIndex-CustomAppBar', newValue);
        setActiveIndex(newValue);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{
            position: 'sticky',
            top: 0,
            width: '150px',
            height: '100vh'
        }}>
        <AppBar position="sticky" sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            height: '100%'
        }}>
            <IconButton
                edge="start"
                color="inherit"
                aria-label="logo"
                sx={{ m: '0 1rem 0' }}
            >
                <Whatshot fontSize='large' />
            </IconButton>
            <Tabs
                orientation='vertical'
                variant='scrollable'
                value={activeIndex}
                onChange={handleChange}
                aria-label="basic tabs example"
                sx={{ width : '100%'}}
            >
                {tabs.map(({ name, label, to, icon }, index) => {
                    return (
                        <LinkTab
                            key={index} id={`${name}-tab`}
                            label={label} aria-label={`tab labeled as ${label}`}
                            aria-controls={`${to} page`}
                            icon={icon} iconPosition='start'
                            to={to}
                        />
                    );
                })}
            </Tabs>
            <Box>
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
            </Box>
        </AppBar>
        </Box>
    );
}

export default CustomAppBar;