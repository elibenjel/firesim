import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import Background from '../Background/Background.jsx'
import AuthForm from '../AuthForm/AuthForm.jsx';
import { useTheme } from '@mui/material/styles';

const WelcomePage = ({setToken}) => {
    const theme = useTheme();
    return (
        // <Background sx={{
        <Box container sx= {{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems : 'center',
            margin: '0 auto'
        }}>
            <Paper variant='left' sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }} >
                <Typography variant='h4' sx={{textAlign: 'center'}} >Welcome to <Box sx={{
                    display: 'inline',
                    color: theme.palette.grey[50],
                    '@keyframes glow': {
                        'from': {
                            textShadow: '0 0 2rem #fff'
                        },
                        'to': {
                            textShadow: '0 0 3rem #fff, 0 0 1rem #fff'
                        }
                    },
                    animation: 'glow 2s ease-in-out infinite alternate'
                }}>FIRESim</Box></Typography>
                <Typography variant='h8' color={theme.palette.text.secondary} sx={{textAlign: 'center'}} >To begin, login and start a simulation.</Typography>
            </Paper>
            <Paper variant='right' >
                <AuthForm setToken={setToken}
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        scrollbarColor: 'rebeccapurple green',
                        scrollbarWidth: 'thin',
                        maxHeight: '70vh'
                    }} />
            </Paper>
        </Box>
    );
};

export default WelcomePage;