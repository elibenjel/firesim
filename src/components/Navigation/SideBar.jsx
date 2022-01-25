import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import i18next from 'i18next';
import { Link } from 'react-router-dom';
import { AppBar, Tabs, Tab, IconButton } from '@mui/material';
import { Whatshot } from '@mui/icons-material';

const tabs = [
    {
        name: 'home',
        label: i18next.t('tab1', { ns : 'Navigation'}),
        to: '/home',
    },
    {
        name: 'fastsim',
        label: i18next.t('tab2', { ns : 'Navigation'}),
        to: '/fastsim'
    }
];

const LinkTab = (props) => {
    
    return (
        <>
        {/* <Divider  /> */}
        <Tab
            component={Link}
            {...props}
        />
        </>
    );
}

const SideBar = (props) => {
    const { selected } = props;
    const [activeIndex, setActiveIndex] = useState(selected in tabs ? selected : 0);
    const navigate = useNavigate();

    const handleChange = (event, newValue) => {
        setActiveIndex(newValue);
    };

    return (
        // <Box sx={{
        //     p : 0, m : 0,
        //     display: 'flex',
        //     flexDirection: 'row',
        //     justifyContent: 'flex-start',
        //     position: 'sticky',
        //     top: 0
        // }}>
        <AppBar position='static' sx={{
            display: 'flex',
            // flexDirection: 'row',
            alignItems: 'center',
            width: '250px'
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
            value={activeIndex}
            variant="scrollable"
            orientation="vertical"
            color='primary'
            aria-label="side bar"
            onChange={handleChange}
            sx={{ width : '100%' }}
        >
            {
                tabs.map((tabProps, index) => {
                    const { name, label, to } = tabProps;
                    return (
                            <LinkTab
                                key={index} id={`${name}-tab`}
                                label={label} aria-label={`tab labeled as ${label}`}
                                aria-controls={`${to} page`}
                                to={to}
                            />
                    );
                })
            }
        </Tabs>
        </AppBar>
        // </Box>
    );
}

export default SideBar;