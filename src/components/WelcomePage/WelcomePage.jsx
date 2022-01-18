import React from 'react';
import { Box, Typography } from '@mui/material';
import Background from '../Background/Background.jsx'
import AuthForm from '../AuthForm/AuthForm.jsx';
import { useTheme } from '@mui/material/styles';

const WelcomePage = ({setToken}) => {
    const theme = useTheme();
    return (
        // <Background sx={{
        <Box container item sx= {{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems : 'center',
            margin: '0 auto'
        }}>
            <Box container item sx={{
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Typography variant='h4' color={theme.palette.text.primary} >Welcome to <Box sx={{
                    display: 'inline',
                    color: theme.palette.primary.main,
                    '@keyframes glow': {
                        'from': {
                            textShadow: '0 0 2rem #ff6b4b'
                        },
                        'to': {
                            textShadow: '0 0 3rem #f91616, 0 0 1rem #f91616'
                        }
                    },
                    animation: 'glow 2s ease-in-out infinite alternate'
                }}>FIRESim</Box>.</Typography>
                <Typography variant='h5' color={theme.palette.text.secondary}>To begin, login and start a simulation.</Typography>
                <a href='https://www.freepik.com/vectors/background'>Background vector created by Harryarts - www.freepik.com</a>
            </Box>
            <AuthForm item setToken={setToken}
            sx={{
                maxWidth : '40%',
                maxHeight : '80%',
                overflowY: 'auto',
                scrollbarColor: 'rebeccapurple green',
                scrollbarWidth: 'thin'
            }} />
        </Box>
    );
};

export default WelcomePage;