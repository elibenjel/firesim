import React from 'react';
import { useTranslation } from 'react-i18next';
import { Route, Routes, useMatch } from 'react-router-dom';
import { Box, Paper } from '@mui/material';

import CustomDrawer from '../components/MainSim/CustomDrawer.jsx';

const MainSim = (props) => {
    const { t : tradHook } = useTranslation('MainSim');

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column',
            alignItems: 'flex-start',
            width: '100%', height: '100%'
        }}>
            <CustomDrawer tradHook={tradHook} />
            <Box sx>
            <Routes>
                <Route path='' element={<Paper>'Mainpage'</Paper>} />
                <Route path='spendings' element={'spendings'} />
                <Route path='market' element={'market'} />
                <Route path='howto' element={'howto'} />
            </Routes>
            </Box>
        </Box>
    );
}

export default MainSim;