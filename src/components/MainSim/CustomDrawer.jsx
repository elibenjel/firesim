import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Box,
    Drawer,
    Tabs,
    Paper,
    IconButton
} from '@mui/material/';
import { ExpandLess, ExpandMore } from '@mui/icons-material';

import LinkTab from '../Navigation/LinkTab.jsx';


const DrawerHandle = (props) => {
    const { drawerState, setDrawerState } = props;

    const handleDrawerOpen = () => {
        setDrawerState(true);
    };

    const handleDrawerClose = () => {
        setDrawerState(false);
    };

    return (
        <Paper sx={{
            zIndex: (theme) => theme.zIndex.drawer + 1,
            mt: 3, mr: 1,
            position: 'fixed', right: 0,
            borderRadius: '50%',
            backgroundColor: drawerState ? (theme) => theme.palette.background.paper : 'rgb(250 250 250 / 50%)'
        }}>
            <IconButton
                onClick={drawerState ? handleDrawerClose : handleDrawerOpen}
                color='primary'
            >
                {drawerState ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
        </Paper>
    )
}

const CustomDrawer = (props) => {
    const { tradHook : t, tabs, selected } = props;

    // pass this state to DrawerHandle to open and close the drawer
    const [open, setOpen] = useState(true);

    // manage the selected tab, and sync it with the path location    
    const location = useLocation();
    const initialActiveIndex = tabs.findIndex(tab => (tab.to === location.pathname));
    const [activeIndex, setActiveIndex] = useState(initialActiveIndex || (selected in tabs ? selected : 0));

    const handleChange = (event, newValue) => {
        setActiveIndex(newValue);
    };

    const drawerHeight = 80;
    const rightGutter = 50;
    const heightTransitionOut = (theme) => theme.transitions.duration.leavingScreen - 50;
    const heightTransitionIn = (theme) => theme.transitions.duration.enteringScreen + 50;

    return (
        <>
            <Drawer
                variant='persistent'
                anchor='top'
                open={open}
                PaperProps={{
                    sx: { p : 1, border : 'none', backgroundColor : 'rgb(0 0 0 / 0%)' }
                }}
                sx={{
                    minHeight : open ? drawerHeight : 0,
                    transition: (theme) => `min-height ${(open ? heightTransitionOut(theme) : heightTransitionIn(theme))}ms`,
                }}
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
            <DrawerHandle drawerState={open} setDrawerState={setOpen} />
        </>
    )
}

export default CustomDrawer;