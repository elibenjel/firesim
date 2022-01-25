import React from 'react';
import { Box } from '@mui/material';
import CustomAppBar from './CustomAppBar.jsx';

const Layout = (props) => {
    const { children } = props;
    // const history = useHistory();

    return (
        <>
        <Box sx={{ display: 'flex', flexDirection : 'row', width : '100%', height : '100%' }} >
            <CustomAppBar />
            <Box id={'testid'} sx={{ maxWidth: '800px' }}>
                {children}
            </Box>
        </Box>
        </>
    );
}

export default Layout;