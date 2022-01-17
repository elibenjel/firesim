import React from 'react';
import { Button, } from '@mui/material';
import { Link, useParams } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
import Background from '../Background/Background.jsx'
import user_background from '../Background/test.jpg';
import CustomAppBar from '../CustomAppBar/CustomAppBar.jsx';

const HomePage = () => {

    let { id } = useParams();
    console.log(id);
    
    return (
        // <Background source={user_background}>
        //     <h1>Hello, you !</h1>
        // </Background>
        <CustomAppBar />
    );
};

export default HomePage;