import React from 'react';
import { Button, Box, AppBar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
      background: 'linear-gradient(65deg, #FE6B8B 30%, #FF8E53 90%)',
      border: 0,
      borderRadius: '3rem',
      boxShadow: '0 0.3rem 0.5rem 0.2rem rgba(255, 105, 135, .3)',
      color: 'white',
      height: '20rem',
      width: '80rem',
      padding: '0 3rem',
      margin: 'auto',
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    },
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
      <Box className={classes.root}>
          <div className={classes.innerdiv}>
          <h1>Welcome to <span className={classes.apptitle}>FIRESim</span>.</h1>
          <h2>To begin, signup and run a simulation.</h2>
          </div>
      </Box>
  );
};

export default Welcome;