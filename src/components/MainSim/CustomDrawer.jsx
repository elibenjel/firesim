import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box,
    Drawer,
    Tabs,
    Paper,
    IconButton
} from '@mui/material/';
import { Help, Savings, BarChart, DisplaySettings, ExpandLess, ExpandMore } from '@mui/icons-material';

import LinkTab from '../Navigation/LinkTab.jsx';

const tabs = [
    {
        name: 'mainsim',
        label: (t) => t('sim'),
        to: '/mainsim',
        icon: <DisplaySettings />
    },
    {
        name: 'spendings',
        label: (t) => t('spendings'),
        to: '/mainsim/spendings',
        icon: <Savings />
    },
    {
        name: 'market',
        label: (t) => t('market'),
        to: '/mainsim/market',
        icon: <BarChart />
    },
    {
        name: 'howto',
        label: (t) => t('howto'),
        to: '/mainsim/howto',
        icon: <Help />
    },
];

const CustomDrawer = (props) => {
    const { selected, tradHook : t } = props;

    // open and close the drawer
    const [open, setOpen] = useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    // manage the selected tab, and sync it with the path location    
    const location = useLocation();
    const initialActiveIndex = tabs.findIndex(tab => (tab.to === location.pathname));
    const [activeIndex, setActiveIndex] = useState(initialActiveIndex || (selected in tabs ? selected : 0));

    const handleChange = (event, newValue) => {
        setActiveIndex(newValue);
    };

    const drawerHeight = 80;
    const rightGutter = 50;

    return (
        <>
            <Drawer
                variant='persistent'
                anchor='top'
                open={open}
                PaperProps={{
                    sx: { p : 1, border : 'none', backgroundColor : 'rgb(0 0 0 / 0%)' }
                }}
                sx={{ height : drawerHeight }}
            >
                <Box sx={{
                    pl: (theme) => `${theme.cssVariables.appBarWidth}px`, pr: `${rightGutter}px`,
                    display: 'flex'
                }}>
                    <Tabs value={activeIndex} variant='scrollable'
                        onChange={handleChange}
                        aria-label='mainsim tabs'
                        TabIndicatorProps={{ sx : { opacity : 0 }}}
                        sx={{
                            ml: 2, mr: 2,
                            borderRadius: 8,
                            boxShadow: (theme) => theme.shadows[4],
                            '& .Mui-selected': {
                                backgroundColor: (theme) => theme.palette.primary.main,
                                color: (theme) => theme.palette.primary.contrastText,
                                borderRadius: 0,
                                fontWeight: 'bold'
                            }
                        }}
                    >
                        {tabs.map(({ name, label, to, icon }, index) => (
                        <LinkTab
                            key={index} id={`${name}-tab`}
                            label={label(t)} aria-label={`tab labeled as ${label(t)}`}
                            aria-controls={`${to} page`}
                            icon={icon} iconPosition='start'
                            to={to}
                        />
                        ))}
                    </Tabs>
                </Box>
            </Drawer>
            <Paper sx={{
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                    mt: 3, mr: 1,
                    position: 'fixed', right: 0,
                    borderRadius: '50%',
                    backgroundColor: open ? (theme) => theme.palette.background.paper : 'rgb(250 250 250 / 50%)'
            }}>
            <IconButton
                onClick={open ? handleDrawerClose : handleDrawerOpen}
                color='primary'
            >
                {open ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
            </Paper>
        </>
    )
}

export default CustomDrawer;