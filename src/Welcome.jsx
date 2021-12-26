import React from 'react';
import { Button, Container, AppBar } from '@material-ui/core';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Background from './Background.jsx'
import welcome_background from '../assets/welcome_background.jpg';

const useStyles = makeStyles({
    inner: {
        margin: 'auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        msTransform: 'translate(-50%, -50%)',
        transform: 'translate(-50%, -50%)',
        justifyContent: 'space-between',
        display: 'flex',
        alignContent: 'flex-center',
        height: '20rem',
        width: '50rem',
    },
    innerLeft: {
        width: '40%',
        display: 'grid',
        gridTemplateColumns: '100%',
        textAlign: 'center'
    },
    innerRight: {
        width: '40%',
        display: 'grid',
        gridTemplateColumns: '100%',
        alignContent: 'center',
        justifyContent: 'space-around',
        textAlign: 'center'
    },
    apptitle: {
        color:'red'
    }
  });

const Welcome = () => {
    const classes = useStyles();
    return (
        <Background source={welcome_background}>
            <div className={classes.inner}>
                <div className={classes.innerLeft}>
                    <h1>Welcome to <span className={classes.apptitle}>FIRESim</span>.</h1>
                    <h2>To begin, sign in and run a simulation.</h2>
                    <a href="https://www.freepik.com/vectors/background">Background vector created by Harryarts - www.freepik.com</a>
                </div>
                <div className={classes.innerRight}>
                    <Button variant='contained' color='primary' fullWidth={false}>Sign in</Button>
                    <p>No account yet ? <Link to="/signup">Sign up</Link></p>
                </div>
            </div>
        </Background>
    );
};

export default Welcome;