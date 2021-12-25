import React from 'react';
import { Button, Container, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Background from './Background.jsx'
import welcome_background from '../assets/welcome_background.jpg';

const useStyles = makeStyles({
    innerdiv: {
        margin: 'auto',
        position: 'absolute',
        top: '50%',
        left: '50%',
        msTransform: 'translate(-50%, -50%)',
        transform: 'translate(-50%, -50%)',
        justifyContent: 'center'
    },
    apptitle: {
        color:'red'
    }
  });

const Welcome = () => {
    const classes = useStyles();
  return (
      <Background source={welcome_background}>
          <div className={classes.innerdiv}>
          <h1>Welcome to <span className={classes.apptitle}>FIRESim</span>.</h1>
          <h2>To begin, signup and run a simulation.</h2>
          <a href="https://www.freepik.com/vectors/background">Background vector created by Harryarts - www.freepik.com</a>
          </div>
      </Background>
  );
};

export default Welcome;