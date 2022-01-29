import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useMatch } from 'react-router-dom';
import { Box, Paper } from '@mui/material';

import CustomDrawer from '../components/MainSim/CustomDrawer.jsx';
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

const MainSim = (props) => {
    const { t : tradHook } = useTranslation('MainSim');

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%', height: '100%'
        }}>
            <CustomDrawer tradHook={tradHook} />
            <Box>
            <Routes>
                <Route path='' element={<Test />} />
                <Route path='spendings' element={'spendings'} />
                <Route path='market' element={'market'} />
                <Route path='howto' element={'howto'} />
            </Routes>
            </Box>
        </Box>
    );
}

export default MainSim;