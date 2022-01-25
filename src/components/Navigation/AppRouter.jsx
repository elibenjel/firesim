import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import Layout from './Layout.jsx';
import WelcomeScreen from '../../pages/WelcomeScreen.jsx';
import Home from '../../pages/Home.jsx';
import FastSim from '../../pages/FastSim.jsx';
import NotFound from '../../pages/NotFound.jsx';

const AppRouter = ({ token, setLanguage }) => {

    return (
        <Router>
            <Layout setLanguage={setLanguage} >
                <Routes>
                    <Route path='/' element={<WelcomeScreen setToken={(value) => (token.current = value)} />} />
                    {(!!token.current) ?
                    <>
                        <Route path='/home' element={<Home />} />
                        <Route path='/fastsim' element={<FastSim />} />
                        {/* <Route path='/mainsim' element={<NotFound />} /> */}
                        <Route path='*' element={<NotFound />} />
                    </>
                    : <Route path='*' element={<Navigate replace to="/" />} />
                    }
                </Routes>
            </Layout>
        </Router>
    );
}

export default AppRouter;