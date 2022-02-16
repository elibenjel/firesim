import React, { useState, useRef } from 'react';

import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import AppRouter from './Navigation/AppRouter.jsx';
import QueryManager from './Feedback/QueryManager.jsx';
import i18next from 'i18next';
import myTheme from '../utils/theme.js';

const queryClient = new QueryClient({});

const App = () => {
    const [language, setLanguage] = useState('fr');
    const setLanguageUtility = (lng) => {
        i18next.changeLanguage(lng);
        setLanguage(lng);
    }

    const token = useRef(null);
    if (!token.current) {
        token.current = window.localStorage.getItem('token');
        console.log(token.current);
    }

    return (
        <QueryClientProvider client={queryClient} >
            <ThemeProvider theme={myTheme}>
            <CssBaseline enableColorScheme />
            <QueryManager queryClient={queryClient} />
            <AppRouter token={token} setLanguage={setLanguageUtility} />
            <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App;