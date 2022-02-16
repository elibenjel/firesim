import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

const ControlButton = (props) => {
    const { title='', onClick, icon, hidden, ...other } = props;
    return (
        <Box sx={{ visibility : hidden ? 'hidden' : 'visible' }}>
            <Tooltip title={title} >
                <span>
                    <IconButton id={`${title}-button`} onClick={onClick} {...other} >
                        {icon}
                    </IconButton>
                </span>
            </Tooltip>
        </Box>
    )
}

export default ControlButton;