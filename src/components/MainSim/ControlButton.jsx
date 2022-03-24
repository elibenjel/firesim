import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';

const createTooltip = (title, children) => title ? <Tooltip title={title} >{children}</Tooltip> : children;

const ControlButton = (props) => {
    const { title, onClick, icon, hidden, ...other } = props;
    return (
        <Box sx={{ visibility : hidden ? 'hidden' : 'visible', ...other.sx }}>
            {
                createTooltip(
                    title,
                    <span>
                        <IconButton id={`${title}-button`} onClick={onClick} {...other} >
                            {icon}
                        </IconButton>
                    </span>
                )    
            }
        </Box>
    )
}

export default ControlButton;