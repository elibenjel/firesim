import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Navigate
  } from 'react-router-dom';

import Layout from './Layout.jsx';

const AppRouter = ({ token }) => {

    return (
        <Router>
            <Layout>
                {/* <Routes>
                    <Route path='/' element={<WelcomePage setToken={(value) => (token.current = value)} />} />
                    {(!!token.current) ?
                    <>
                        <Route path='/home' element={<Home />} />
                        <Route path='/fastsim' element={<FastSim />} />
                        <Route path='/mainsim' element={<NotFound />} />
                    </>
                    : <Route path='*' element={<Navigate replace to="/" />} />
                    }
                </Routes> */}
                <div style={{ height : '150vh' }}>YES</div>
            </Layout>
        </Router>
    );
}

export default AppRouter;