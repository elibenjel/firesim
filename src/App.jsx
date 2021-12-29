import React, {useState} from 'react';
import {
    BrowserRouter as Router,
    Routes,
    Route,
    Link
  } from "react-router-dom";
import Welcome from './Welcome/Welcome.jsx';
import LoginForm from './LoginForm/LoginForm.jsx';
import SignupForm from './SignupForm/SignupForm.jsx';
import Home from './Home/Home.jsx';


const App = () => {
    const [token, setToken] = useState();

    return (
        <Router>
            <div>
              <Routes>
                <Route path="/" element={<Welcome setToken={setToken} />} />
                <Route path="/signup" element={<SignupForm />} />
                <Route path="/users/:id" element={<Home />} />
              </Routes>
            </div>
        </Router>
    );
};

export default App;