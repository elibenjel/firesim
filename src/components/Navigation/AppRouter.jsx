import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route
} from 'react-router-dom';

import {
    TrendingUp,
    Home as HomeIcon,
    Analytics
} from '@mui/icons-material';

import Layout from './Layout.jsx';
import WelcomeScreen from '../../pages/WelcomeScreen.jsx';
import Home from '../../pages/Home.jsx';
import FastSim from '../../pages/FastSim.jsx';
import MainSim from '../../pages/MainSim.jsx';
import NotFound from '../../pages/NotFound.jsx';

const tabs = [
    {
        name: 'home',
        label: (t) => t('tab1'),
        to: '/home',
        icon: <HomeIcon />
    },
    {
        name: 'fastsim',
        label: (t) => t('tab2'),
        to: '/fastsim',
        icon: <TrendingUp />
    },
    {
        name: 'mainsim',
        label: (t) => t('tab3'),
        to: '/mainsim/',
        icon: <Analytics />
    }
];

const AppRouter = ({ token, setLanguage }) => {

    return (
        <Router>
            <Layout tabs={tabs} setLanguage={setLanguage} >
                <Routes>
                    <Route path='/' element={<WelcomeScreen setToken={(value) => (token.current = value)} />} />
                    {(!!token.current) ?
                    <>
                        <Route path='/home' element={<Home />} />
                        <Route path='/fastsim' element={<FastSim />} />
                        <Route path='/mainsim/*' element={<MainSim />} />
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