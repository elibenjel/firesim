import React from 'react';
import { Button, AppBar } from '@material-ui/core';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Background from '../Background/Background.jsx'
import welcome_background from '../Background/welcome_background.jpg';
import LoginForm from '../LoginForm/LoginForm.jsx';

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
        width: '30%',
        display: 'grid',
        gridTemplateColumns: '100%',
        alignContent: 'center',
        justifyContent: 'space-around',
        textAlign: 'center'
    },
    "@keyframes glow": {
        "from": {
            textShadow: '0 0 2rem #ff6b4b'
        },
        "to": {
            textShadow: '0 0 3rem #f91616, 0 0 1rem #f91616'
        }
    },
    apptitle: {
        color: '#e02800',
        animation: '$glow 2s ease-in-out infinite alternate'
    }
  });

const Welcome = ({setToken}) => {
    const classes = useStyles();
    return (
        <Background source={welcome_background}>
            <div className={classes.inner}>
                <div className={classes.innerLeft}>
                    <h1>Welcome to <span className={classes.apptitle}>FIRESim</span>.</h1>
                    <h2>To begin, login and start a simulation.</h2>
                    <a href='https://www.freepik.com/vectors/background'>Background vector created by Harryarts - www.freepik.com</a>
                </div>
                <div className={classes.innerRight}>
                    <LoginForm setToken={setToken} />
                    <p>No account yet ? <Link to='/signup'>Sign up</Link></p>
                </div>
            </div>
        </Background>
    );
};

export default Welcome;