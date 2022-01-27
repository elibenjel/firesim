import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Tabs,
    AppBar,
    Menu,
    MenuItem,
    IconButton
} from '@mui/material';
import {
    Language,
    Whatshot,
    TrendingUp,
    Home,
    Analytics
} from '@mui/icons-material';

import LinkTab from './LinkTab.jsx';

const tabs = [
    {
        name: 'home',
        label: (t) => t('tab1'),
        to: '/home',
        icon: <Home />
    },
    {
        name: 'fastsim',
        label: (t) => t('tab2'),
        to: '/fastsim',
        icon: <TrendingUp />
    },
    {
        name: 'mainsim',
        label: (t) => t('tab3'),
        to: '/mainsim',
        icon: <Analytics />
    }
];

const CustomAppBar = (props) => {
    const { selected, setLanguage } = props;
    const { t } = useTranslation('Navigation');
    const [anchorEl, setAnchorEl] = useState(null);
    const location = useLocation();

    const initialActiveIndex = tabs.findIndex(tab => (location.pathname.match(new RegExp(`^${tab.to}`))));

    const [activeIndex, setActiveIndex] = useState(initialActiveIndex || (selected in tabs ? selected : 0));

    const handleChange = (event, newValue) => {
        setActiveIndex(newValue);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (lng) => {
        setLanguage(lng);
        setAnchorEl(null);
    };

    return (
        <Box sx={{
            position: 'sticky',
            top: 0,
            width: (theme) => theme.cssVariables.appBarWidth,
            height: '100vh',
            zIndex: (theme) => theme.zIndex.drawer + 1
        }}>
        <AppBar position="static" sx={{
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
                aria-label='navigation tabs'
                sx={{ width : '100%'}}
            >
                {tabs.map(({ name, label, to, icon }, index) => {
                    return (
                        <LinkTab
                            key={index} id={`${name}-tab`}
                            label={label(t)} aria-label={`tab labeled as ${label(t)}`}
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
                    <Language />
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
                    <MenuItem onClick={() => handleClose('fr')}>Français</MenuItem>
                    <MenuItem onClick={() => handleClose('en')}>English</MenuItem>
                </Menu>
            </Box>
        </AppBar>
        </Box>
    );
}

export default CustomAppBar;