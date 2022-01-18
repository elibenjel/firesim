import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, FormControl, FormControlLabel, RadioGroup, Radio, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { loginUser, signupUser } from '../../services/user.js';
import { useEffect, useState, useRef, useReducer } from 'react';
import { useMutation } from 'react-query';
import CustomTextField from '../CustomFormFields/CustomTextField.jsx';

const countries = [
    {
        value : 'FR', 
        label : 'France'
    },
    {
        value : '',
        label : 'Coming soon'
    }
]

const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
        /^(([^<>()[\]\\.,;:\s@']+(\.[^<>()[\]\\.,;:\s@']+)*)|('.+'))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}

const passwordMinimumLength = 10;
const validatePassword = (password) => {
    return String(password).length >= passwordMinimumLength;
}

const validateRepassword = (repassword, refToPassword) => {
    const rpwdLength = String(repassword).length;
    return rpwdLength >= 10 && rpwdLength === refToPassword.current.length;
}

// const useLogin = (args) => {
//     return useMutation(loginUser, args);
// }

const AuthForm = ({setToken, sx}) => {
    const navigate = useNavigate();
    const mounted = useRef(true);
    const email = useRef('');
    const password = useRef('');
    const repassword = useRef('');
    const country = useRef('FR');
    const [userAction, setUserAction] = useState('login');
    const enabler = useRef({});
    const [enable, setEnable] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const setErr = (e) => {
        setErrMsg(e);
        setTimeout(() => setErrMsg(''), 5000);
    }
    console.log(errMsg);

    const [formValidity, dispatchFieldValidity] = useReducer((currentState, action) => {
        let newState = {...currentState};
        newState[action.issuer] = action.value;
        return newState;
    }, {
        'email' : false,
        'password' : false,
        'repassword' : false,
        'country' : false
    });

    const theme = useTheme();
    
    useEffect(() => {
        mounted.current = true;
        return (() => mounted.current = false);
    });

    const onError = (err) => {
        console.log('An error happened during the login attempt:\n', err);
        setErr(err.toString());
    }

    const onSuccess = (data) => {
        const errors = data.errors;
        if (errors) {
            const msg = errors.reduce((payload, curr) => `${payload}\n${curr.message}`, '');
            setErr(msg);
            return;
        }

        const {token, _id : myID} = (data.data.login?.token) ? data.data.login : data.data.signup;
        if (!token) {
            setErr('No token received from server : authentication failed');
            return;
        }

        setToken(token);
        window.localStorage.setItem('token', token); // don't ever do that
        navigate(`/home/${myID}`);
    }

    const {mutate : login, isError : loginIsErr, error : loginErr} = useMutation(loginUser, {onSuccess, onError});
    const {mutate : signup, isError : signupIsErr, error : signupErr} = useMutation(signupUser, {onSuccess, onError});

    const onRadioGroupChange = (event) => {
        setUserAction(event.target.value);
        password.current = '';
        repassword.current = '';
    }

    const onCountryChange = (event) => {
        country.current = event.target.value;
        country.current.length() ? setIsCountrySelected(true) : setIsCountrySelected(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!mounted.current) return;

        const pwd = password.current;
        
        if (userAction === 'login') login({ username : email.current, password : pwd });
        else {
            const rpwd = repassword.current;
            if(pwd != rpwd) {
                setErr('You typed different passwords. Try again.');
                return;
            }
            signup({ username : email.current, password : pwd });
        }
    }

    const validFields = (userAction === 'login') ? ['email', 'password'] : Object.keys(formValidity);
    
    const disabled = !Object.entries(formValidity).reduce((prev, current) => {
        return (validFields.includes(current[0])) ? current[1] && prev : prev;
    }, true);

    const disabledProp = { disabled };
    
    return (
        <Paper
            sx={sx}
            elevation={2}
        >
            <Box container
                component='form'
                noValidate
                autoComplete='off'
                onSubmit={handleSubmit}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <FormControl item
                    component='fieldset'
                    sx={{ p : 0.5, m : 0.5}}
                >
                    <RadioGroup
                        row
                        aria-label='userAction'
                        name='userAction'
                        value={userAction}
                        onChange={onRadioGroupChange}
                    >
                        <FormControlLabel value={'login'} control={<Radio color='secondary' />} label='Login' />
                        <FormControlLabel value={'signup'} control={<Radio color='secondary' />} label='Signup' />
                    </RadioGroup>
                </FormControl>
                <CustomTextField item
                    id='emailInput'
                    variant='outlined'
                    name='Email'
                    stateRef={email}
                    type='text'
                    validators={{
                        isValid : () => formValidity.email,
                        setIsValid : (value) => dispatchFieldValidity({issuer : 'email', value}),
                        validateContent : validateEmail
                    }}
                    placeholder='123@example.com'
                    helperText='Enter a valid email'
                />
                <CustomTextField item
                    id='passwordInput'
                    variant='outlined'
                    name='Password'
                    stateRef={password}
                    type='password'
                    validators={{
                        isValid : () => formValidity.password,
                        setIsValid : (value) => dispatchFieldValidity({issuer : 'password', value}),
                        validateContent : validatePassword
                    }}
                    helperText={`Enter a password of ${passwordMinimumLength} characters minimum`}
                />
                {userAction === 'signup' ? 
                <>
                    <CustomTextField item
                        id='repasswordInput'
                        variant='outlined'
                        name='Repeat password'
                        stateRef={repassword}
                        type='password'
                        validators={{
                            isValid : () => formValidity.repassword,
                            setIsValid : (value) => dispatchFieldValidity({issuer : 'repassword', value}),
                            validateContent : (rpwd) => validateRepassword(rpwd, password)
                        }}
                        helperText='Type your password again'
                    />
                    <CustomTextField item
                        id='countrySelect'
                        variant='outlined'
                        name='Country'
                        stateRef={country}
                        select
                        validators={{
                            isValid : () => formValidity.country,
                            setIsValid : (value) => dispatchFieldValidity({issuer : 'country', value})
                        }}
                        selectOptions={countries}
                        helperText='Select the financial system you belong to among the following available countries'
                    />
                </>
                : null}
                <Button item type='Submit' {...disabledProp} variant='contained' color='secondary' sx={{m : 1}}>Submit</Button>
            </Box>
        </Paper>
    );
}

AuthForm.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default AuthForm;