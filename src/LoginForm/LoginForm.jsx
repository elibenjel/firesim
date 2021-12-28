import React from 'react';
import { Button, AppBar } from '@material-ui/core';
import { Link, useNavigate } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Background from '../Background/Background.jsx'
import welcome_background from '../Background/welcome_background.jpg';

const useStyles = makeStyles({
    root: {
        display: 'grid',
        gridTemplateColumns: '100%',
        alignContent: 'center',
        justifyContent: 'space-around',
        textAlign: 'center',
        padding: '1rem'
    }
  });

const LoginForm = ({setToken}) => {
    const classes = useStyles();
    const navigate = useNavigate();

    function handleSubmit(event) {
        event.preventDefault();
        const username = event.target.elements.usernameInput.value;
        navigate(`/users/${username}`);
      }

    return (
        <form onSubmit={handleSubmit}>
        <div className={classes.root}>
            <label htmlFor="usernameInput">Username:</label>
            <input id="usernameInput" type="text" />
            <label htmlFor="passwordInput">Password:</label>
            <input id="passwordInput" type="password" />
        </div>
        <Button type="submit" variant='contained' color='primary'>Login</Button>
        </form>
    );
};

export default LoginForm;