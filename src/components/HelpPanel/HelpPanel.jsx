import React from 'react';
import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    AccountCircle,
    TrendingUpIcon,
    WhatshotIcon,
    HelpIcon,
    AnalyticsIcon
} from '@mui/icons-material';

const HelpPanel = () => {
    const theme = useTheme();

    return (
        <>
            <Paper variant='left' >
                <Typography variant='h4' fontWeight={'bold'}>What is FI/RE ?</Typography>
                <Typography variant='body1' >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia orci quis quam vestibulum vulputate. Sed volutpat lobortis massa, nec tristique sapien dictum eu. Nullam mollis tempor dui eu volutpat. Aliquam facilisis enim id magna sagittis, nec lobortis mi cursus. Sed pretium tempor tortor eget commodo. Etiam ullamcorper venenatis porttitor. Sed rutrum commodo erat vitae porttitor. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nullam eget varius augue. Curabitur congue sem vitae ligula lacinia euismod. Vivamus tristique tellus sit amet porta egestas. Morbi rhoncus nulla metus. Phasellus vehicula ex pretium ultrices congue. Proin at erat sagittis, pulvinar elit nec, porttitor libero.
                </Typography>
            </Paper>
            <Paper variant='right' >
                <Typography variant='h4' fontWeight={'bold'}>How to use the app ?</Typography>
                <ul>
                    <li><Typography variant='body1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia orci</Typography></li>
                    <li><Typography variant='body1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia orci</Typography></li>
                    <li><Typography variant='body1'>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean lacinia orci</Typography></li>
                </ul>
            </Paper>
        </>
    )
}

export default HelpPanel;