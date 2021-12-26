import React from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";

import Welcome from './Welcome.jsx';

const App = () => {
    return (
        <Router>
            <div>
            <Routes>
          <Route path="/" element={<Welcome />}>
          </Route>
        </Routes>
            </div>
        </Router>
    );
};

export default App;