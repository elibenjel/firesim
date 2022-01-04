import React from 'react';
import PropTypes from 'prop-types';
import { Button, AppBar } from '@material-ui/core';
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Background from '../Background/Background.jsx'
import welcome_background from '../Background/welcome_background.jpg';
import { loginUser } from '../services/login.js';
import { useEffect, useState, useRef } from 'react';

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

const LoginForm = ({setToken}) => {
    const classes = useStyles();
    const navigate = useNavigate();
    const mounted = useRef(true);
    const [err, setErr] = useState('');

    useEffect(() => {
        mounted.current = true;
        return () => mounted.current = false;
    });

    useEffect(() => {
        if (err.length) {
            setTimeout(() => {
                setErr('');
            }, 5000);
        }
    }, [err])

    const handleSubmit = async (e) => {
        e.preventDefault();
        const username = e.target.elements.usernameInput.value;
        const password = e.target.elements.passwordInput.value;
        loginUser({username, password})
        .then((res) => {
            if (!mounted.current) return;

            if (res.status == 200) {
                console.log('Your token is ', res.data.token);
                setToken(res.data.token);
                navigate(`/users/${username}`);
            }
            else {
                setErr(res.message);
                console.log(`${res.message} (code: ${res.status})`);
            }
        });
    }

    return (
        <form onSubmit={handleSubmit}>
        <div className={classes.root}>
            <label htmlFor="usernameInput">Username:</label>
            <input id="usernameInput" type="text" />
            <label htmlFor="passwordInput">Password:</label>
            <input id="passwordInput" type="password" />
            <div className={classes.errdiv}>{err}</div>
        </div>
        <Button type="submit" variant='contained' color='primary'>Login</Button>
        </form>
    );
};

LoginForm.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default LoginForm;