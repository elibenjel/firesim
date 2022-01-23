import React, { useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';

import WelcomePage from './components/WelcomePage/WelcomePage.jsx';
import MainPage from './components/MainPage/MainPage.jsx';
import myTheme from './theme.js';


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
        <Router>
              <Routes>
                <Route path='/' element={<WelcomePage setToken={(value) => (token.current = value)} />} />
                {(!!token.current) ?
                  <>
                    <Route path='/home' element={<MainPage tab={0} />} />
                    <Route path='/fastsim' element={<MainPage tab={1} />} />
                  </>
                  : <Route path='*' element={<Navigate replace to="/" />} />
                }
              </Routes>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} position='bottom-right' />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;