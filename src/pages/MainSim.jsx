import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { Box } from '@mui/material';

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
        </Box>
    );
}

export default MainSim;