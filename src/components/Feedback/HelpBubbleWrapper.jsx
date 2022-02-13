import React from 'react';
import { Box, Popper, Fade, Paper, Typography } from '@mui/material';


const BubbleInfo = (props) => {
    const { content, ...popperProps } = props;

    return (
        <Popper placement='right-end' transition {...popperProps} >
        {({ TransitionProps }) => (
          <Fade {...TransitionProps} timeout={300} >
            <Paper variant='simple' sx={{ p : '4px 24px 4px', maxWidth : '20rem' }}>
                <Typography variant='body2' sx={{ textAlign : 'justify' }}>
                    {content}
                </Typography>
            </Paper>
          </Fade>
        )}
      </Popper>
    )
}

const HelpBubbleWrapper = (props) => {
    const { id, helpBubble, children, ...popperProps } = props;
    const [open, setOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleHover = (event) => {
        setAnchorEl(event.currentTarget);
        setOpen(true);
    };

    const handleLeave = (event) => {
        setOpen(false)
    };

    const canBeOpen = open && Boolean(anchorEl);
    const bubbleID = canBeOpen ? id : undefined;

    return (
        <>
            <Box
                sx={{
                    p: 0,
                    m: 0
                }}
                onMouseOver={handleHover}
                onMouseOut={handleLeave}
            >
            {children}
            </Box>
            <BubbleInfo content={helpBubble} id={bubbleID} open={open} anchorEl={anchorEl} {...popperProps} />
        </>
    )
}

export default HelpBubbleWrapper;