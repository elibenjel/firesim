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
            justifyContent: 'center',
            alignItems : 'center',
            margin: '0 auto'
        }}>
            <Paper variant='rounded-primary' sx={{
                maxWidth : '40%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }} >
                <Typography variant='h4' fontWeight={'bold'} sx={{textAlign: 'center'}} >Welcome to <Box sx={{
                    display: 'inline',
                    '@keyframes glow': {
                        'from': {
                            textShadow: `0 0 1rem ${theme.palette.primary.main}`,
                            color: theme.palette.primary.light
                        },
                        'to': {
                            textShadow: `0 0 3rem ${theme.palette.primary.main}, 0 0 1rem ${theme.palette.primary.main}`,
                            color: theme.palette.primary.dark
                        }
                    },
                    animation: 'glow 2s ease-in-out infinite alternate'
                }}><br/>FIRESim</Box></Typography>
                <Typography variant='h8' color={theme.palette.text.secondary} sx={{textAlign: 'center'}} >To begin, please login or create an account.</Typography>
            </Paper>
            <Paper variant='side-primary' sx={{ maxWidth : '40%'}} >
                <AuthForm setToken={setToken}
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        scrollbarColor: 'rebeccapurple green',
                        scrollbarWidth: 'thin',
                        maxHeight: '70vh',
                    }} />
            </Paper>
        </Box>
    );
};

export default WelcomePage;