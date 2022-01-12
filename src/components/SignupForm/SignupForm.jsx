import React from 'react';
import { Button, AppBar } from '@material-ui/core';
import { Link } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import Background from '../Background/Background.jsx'
import welcome_background from '../Background/welcome_background.jpg';

const useStyles = makeStyles({
    root: {

    }
  });

const SignupForm = () => {
    const classes = useStyles();

    function handleSubmit(event) {
        event.preventDefault();
        const username = event.target.elements.usernameInput.value;
        const password = event.target.elements.passwordInput.value;
        const repassword = event.target.elements.repasswordInput.value;
        if(password != repassword) {
            alert('You typed different passwords. Try again.');
        }
        alert(`Your username is ${username} and your password is ${password}`);
      }

    return (
        <Background source={welcome_background}>
            <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="usernameInput">Choose a valid username:</label>
                <input id="usernameInput" type="text" />
                <label htmlFor="passwordInput">Choose your password:</label>
                <input id="passwordInput" type="password" />
                <label htmlFor="repasswordInput">Type your password again:</label>
                <input id="repasswordInput" type="password" />
            </div>
            <Button type="submit" variant='contained' color='primary'>Submit</Button>
            </form>
        </Background>
    );
};

export default SignupForm;