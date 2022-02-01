import React from 'react';
import { Box } from '@mui/material';
import CustomAppBar from './CustomAppBar.jsx';
import { useLocation } from 'react-router-dom';

const Layout = (props) => {
    const { setLanguage, children } = props;
    const location = useLocation();

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'row',
            // alignItems: 'center',
            width: '99%', height: '100%',
            m: 'auto'
        }}>
            {(location.pathname === '/') || <CustomAppBar setLanguage={setLanguage} />}
            {children}
        </Box>
    );
}

export default Layout;