import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Background = ({children, source, sx, ...other}) => {
  {
    const theme = useTheme();
    return (
      <Box container sx={{
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'local',
        minHeight: '100%',
        minWidth: '100%',
        height: '100%',
        width: '100%',
        position: 'fixed',
        backgroundImage: `url(${source})`,
        ...sx
      }} {...other}>
          {children}
      </Box>
    )
  }
}

export default Background;