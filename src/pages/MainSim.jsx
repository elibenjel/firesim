import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useMatch } from 'react-router-dom';
import { Box, Paper } from '@mui/material';
import { Help, Savings, BarChart, DisplaySettings, Paid } from '@mui/icons-material';

import CustomDrawer from '../components/MainSim/CustomDrawer.jsx';
import Spendings from '../components/MainSim/Spendings.jsx';
import Income from '../components/MainSim/Income.jsx';
import ParameterField from '../components/FastSim/ParameterField.jsx';


const Test = (props) => {
    const [v1, setV1] = useState(0);
    const v2 = useRef('a');
    const setV1Util = (val) => {
        setV1(val);
        v2.current = (val);
    }

    return (
        <Box>
            <ParameterField value={v1} setState={setV1Util} />
            <ParameterField value={v2.current} readOnly />
        </Box>
    )
}

const tabs = [
    {
        name: 'mainsim',
        label: (t) => t('sim-tab'),
        to: '/mainsim/',
        icon: <DisplaySettings />,
        element: <Test />
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
        icon: <BarChart />
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