import React from 'react';
import { Link } from 'react-router-dom';
import { Tab } from '@mui/material';

const LinkTab = (props) => {
    
    return (
        <>
            <Tab
                component={Link}
                {...props}
            />
        </>
    );
}

export default LinkTab;