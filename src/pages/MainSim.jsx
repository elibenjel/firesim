import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useMatch } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import { Help, Savings, BarChart, DisplaySettings, Paid } from '@mui/icons-material';

import CustomDrawer from '../components/MainSim/CustomDrawer.jsx';
import Spendings from './MainSim/Spendings.jsx';
import Income from './MainSim/Income.jsx';
import Market from './MainSim/Market.jsx';
import Simulation from './MainSim/Simulation.jsx';
import ParameterField from '../components/FastSim/ParameterField.jsx';


const tabs = [
    {
        name: 'mainsim',
        label: (t) => t('sim-tab'),
        to: '/mainsim/',
        icon: <DisplaySettings />,
        element: <Simulation />
    },
    {
        name: 'spendings',
        label: (t) => t('spendings-tab'),
        to: '/mainsim/spendings',
        icon: <Savings />,
        element: <Spendings />
    },
    {
        name: 'income',
        label: (t) => t('income-tab'),
        to: '/mainsim/income',
        icon: <Paid />,
        element: <Income />
    },
    {
        name: 'market',
        label: (t) => t('market-tab'),
        to: '/mainsim/market',
        icon: <BarChart />,
        element: <Market />
    },
    {
        name: 'howto',
        label: (t) => t('howto-tab'),
        to: '/mainsim/howto',
        icon: <Help />
    },
];

const MainSim = (props) => {
    const { t : tradHook } = useTranslation('MainSim');

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%', height: '100%'
        }}>
            <CustomDrawer tradHook={tradHook} tabs={tabs} />
            <Routes>
                {
                    tabs.map(tab => {
                        const relPath = tab.to.split('/').at(-1);
                        return <Route key={relPath} path={relPath} element={tab.element || relPath} />
                    })
                }
            </Routes>
        </Box>
    );
}

export default MainSim;