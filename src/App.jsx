import React, { useState } from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
import { QueryClientProvider, QueryClient } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Welcome from './components/Welcome/Welcome.jsx';
import LoginForm from './components/LoginForm/LoginForm.jsx';
import SignupForm from './components/SignupForm/SignupForm.jsx';
import Home from './components/Home/Home.jsx';

const queryClient = new QueryClient();

const App = () => {
    const [token, setToken] = useState();

    return (
      <QueryClientProvider client={queryClient} >
        <Router>
            <div>
              <Routes>
                <Route path="/" element={<Welcome setToken={setToken} />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/users/:id" element={<Home />} />
              </Routes>
            </div>
        </Router>
        <ReactQueryDevtools initialIsOpen={false} position="bottom-right" />
      </QueryClientProvider>
    );
};

export default App;