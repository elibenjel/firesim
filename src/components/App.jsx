import React, { useRef } from 'react';

import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';


import AppRouter from './Navigation/AppRouter.jsx';
import myTheme from '../utils/theme.js';


const queryClient = new QueryClient();

const App = () => {
  const token = useRef(null);
  if (!token.current) {
    token.current = window.localStorage.getItem('token');
    console.log(token.current);
  }

  return (
    <QueryClientProvider client={queryClient} >
      <ThemeProvider theme={myTheme}>
      <CssBaseline enableColorScheme />
      <AppRouter token={token} />
      <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;