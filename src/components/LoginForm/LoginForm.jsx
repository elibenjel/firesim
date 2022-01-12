import React from 'react';
import PropTypes from 'prop-types';
import { Button, AppBar } from '@material-ui/core';
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Background from '../Background/Background.jsx'
import welcome_background from '../Background/welcome_background.jpg';
import { loginUser } from '../../services/login.js';
import { useEffect, useState, useRef } from 'react';
import { useMutation } from 'react-query';

// fetch(apiURL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(postData),
//   })
//       .then(response => response.json())
//       .then(jsonResponse => console.log('Success: ', jsonResponse))
//       .catch(error => console.log('Error: ', error));

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: '100%',
        alignContent: 'center',
        justifyContent: 'space-around',
        textAlign: 'center',
        padding: '1rem'
    },
    errdiv: {
        height: '2rem',
        paddingTop: '1rem',
        fontSize : "small",
        color:"red"
    }
});

const useLogin = (args) => {
    return useMutation(loginUser, args);
}

const LoginForm = ({setToken}) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const mounted = useRef(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');

    const onError = (err) => {
        console.log('An error happened during the login attempt:\n', err);
        setErrMsg(err);
    }

    const onSuccess = (data) => {
        const errors = data.errors;
        if (errors) {
            const msg = errors.reduce((payload, curr) => `${payload}\n${curr.message}`, '');
            setErrMsg(msg);
            setTimeout(() => setErrMsg(''), 5000);
        }
        else {
            const token = data.data.login.token;
            setToken(token);
            console.log('Your token is: ', data);
            navigate(`/users/${username}`);
        }
    }

    const {mutate : login, isError, error} = useMutation(loginUser, {onSuccess, onError});

    useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mounted.current) return;
        login({username, password});
    }

    return (
        <form onSubmit={handleSubmit}>
        <div className={classes.root}>
            <label htmlFor="usernameInput">Username:</label>
            <input id="usernameInput" type="text" onChange={(event) => setUsername(event.target.value)} />
            <label htmlFor="passwordInput">Password:</label>
            <input id="passwordInput" type="password" onChange={(event) => setPassword(event.target.value)} />
            <div className={classes.errdiv}>{errMsg}</div>
        </div>
        <Button type="submit" variant='contained' color='primary'>Login</Button>
        </form>
    );
};

LoginForm.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default LoginForm;