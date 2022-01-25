import React, { useState, useRef } from 'react';

import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';


import AppRouter from './Navigation/AppRouter.jsx';
import myTheme from '../utils/theme.js';
import i18next from 'i18next';


const queryClient = new QueryClient();

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
      <AppRouter token={token} setLanguage={setLanguageUtility} />
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;