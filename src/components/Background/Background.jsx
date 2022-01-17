import React from 'react';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Background = ({children, source = '', sx, ...other}) => {
  {
    const theme = useTheme();
    return (
      <Box container sx={{
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundAttachment: 'local',
        overflowY: 'auto',
        scrollbarColor: 'rebeccapurple green',
        scrollbarWidth: 'thin',
        minHeight: '100%',
        minWidth: '100%',
        height: '100%',
        width: '100%',
        position: 'fixed',
        top: 0,
        left: 0,
        backgroundImage: (source) ? `url(${source})` : `linear-gradient(to top, white 70%, ${theme.palette.primary.dark} 70%)`,
        ...sx
      }} {...other}>
          {children}
      </Box>
    )
  }
}

export default Background;