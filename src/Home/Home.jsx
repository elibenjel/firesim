import React from 'react';
import { Button, AppBar } from '@material-ui/core';
import { Link, useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Background from '../Background/Background.jsx'
import user_background from '../Background/test.jpg';

const useStyles = makeStyles({
    root: {

    }
  });

const Home = () => {
    const classes = useStyles();

    let { id } = useParams();

    return (
        <Background source={user_background}>
            <h1>Hello, {id} !</h1>
        </Background>
    );
};

export default Home;