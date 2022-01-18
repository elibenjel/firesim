import React, { useState, useRef } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import WelcomePage from './components/WelcomePage/WelcomePage.jsx';
import HomePage from './components/HomePage/HomePage.jsx';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import myTheme from './theme.js';

const queryClient = new QueryClient();

// const theme = createTheme({
//   palette: {
//       primary: {
//           main: red['A700'],
//       },
//       secondary: {
//           main: blue[900],
//           // '&:hover': {
//           //   main: 'red'
//           // }
//       },
//       error: {
//         main: red['A700'],
//       },
//   },
//   components:{
//     MuiCssBaseline: {
//       styleOverrides: {
//         html: {
//           // colorScheme: 'dark'
//         },
//         body: {
//           // backgroundColor: '#000'
//           minWidth: '60rem',
//           backgroundImage: function() {return `linear-gradient(to top, white 70%, ${this.palette.primary.dark} 70%)`;} 
//         }
//       }
//     }
//   }
  
//   // overrides: {
//   //   MuiCssBaseline: {
//   //     "@global": {
//   //       "*::-webkit-scrollbar": {
//   //         width: "10px"
//   //       },
//   //       "*::-webkit-scrollbar-track": {
//   //         background: "#E4EFEF"
//   //       },
//   //       "*::-webkit-scrollbar-thumb": {
//   //         background: "#1D388F61",
//   //         borderRadius: "2px"
//   //       }
//   //     }
//   //   }
//   // }
// });

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
                  <Route path='/home/:id' element={<HomePage />} />
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