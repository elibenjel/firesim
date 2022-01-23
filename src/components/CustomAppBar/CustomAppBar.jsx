import React from 'react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import {
    Tabs,
    Tab,
    Box,
    AppBar,
    Menu,
    MenuItem,
    IconButton
} from '@mui/material';
import {
    AccountCircle,
    Whatshot,
} from '@mui/icons-material';


function LinkTab(props) {
    return (
        <Tab
            component={Link}
            // onClick={(event) => {
            //    event.preventDefault();
            // }}
            {...props}
        />
    );
}

const CustomAppBar = ({ panels, tab, setTab }) => {
    const [anchorEl, setAnchorEl] = useState(null);

    const theme = useTheme();

    const handleChange = (event, newTab) => {
    //   setTab(newTab);
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{
        }}>
        <AppBar position="static" sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
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
                value={tab}
                onChange={handleChange}
                aria-label="basic tabs example"
            >
                {panels.map(({ tabLabel, to, panelID, icon }, index) => {
                    return (
                        <LinkTab
                            key={index} id={`${panelID}-tab`}
                            label={tabLabel} aria-label={`tab labeled as ${tabLabel}`}
                            aria-controls={panelID}
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