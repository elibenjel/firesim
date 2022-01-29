import React, { useEffect, useState, useRef, useReducer } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useMutation } from 'react-query';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Button,
    FormControl,
    FormControlLabel,
    RadioGroup,
    Radio,
    MenuItem,
    TextField
} from '@mui/material';

import { loginUser, signupUser } from '../../services/user.js';
import ValidatorWrapper from '../InformationDisplay/ValidatorWrapper.jsx';
// import ValidatorField from '../Input/ValidatorField.jsx';

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

const FormField = (props) => {
    const {
        tradHook : t,
        id, value,
        setState = () => null, validateF = () => true,
        readOnly,
        externalValidityControl,
        label, placeholder, helperText, startAdornment, helpBubble,
        ...other
    } = props;

    const onFocus = ({ setChildrenIsValid, setHide }) => (event) => {
        setChildrenIsValid && setChildrenIsValid(validateF(event.target.value));
        setHide && setHide(false);
    }

    const onBlur = ({ setChildrenIsValid, setHide }) => (event) => setHide && setHide(true);

    const onChange = ({ setChildrenIsValid, setHide }) => (event) => {
        setState(event.target.value);
        onFocus({ setChildrenIsValid, setHide })(event);
    }

    const fieldProps = (args) => ({
        id, value, variant: 'filled', label, placeholder, helperText, readOnly,
        onFocus: onFocus(args), onBlur: onBlur(args), onChange: onChange(args)
    });

    return (
        <ValidatorWrapper externalValidityControl={externalValidityControl} {...other} >
            {
                (args) => (
                    <TextField
                        variant='outlined'
                        size='small'
                        {...fieldProps(args)}
                        {...other}
                    />
                )
            }
        </ValidatorWrapper>
    )
}

const AuthForm = ({setToken, sx}) => {
    const navigate = useNavigate();
    const mounted = useRef(true);
    const email = useRef('');
    const password = useRef('');
    const repassword = useRef('');
    const country = useRef('FR');
    const [userAction, setUserAction] = useState('login');
    // const enabler = useRef({});
    // const [enable, setEnable] = useState(false);
    const [errMsg, setErrMsg] = useState('');
    const setErr = (e) => {
        setErrMsg(e);
        setTimeout(() => setErrMsg(''), 5000);
    }

    const [formValidity, dispatchFormValidity] = useReducer((currentState, action) => {
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

    // const onCountryChange = (event) => {
    //     country.current = event.target.value;
    //     country.current.length() ? setIsCountrySelected(true) : setIsCountrySelected(false);
    // }

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

    const getFieldProps = (id, label, placeholder, helperText, required=true) => ({
        id,
        label,
        placeholder,
        helperText,
        color: 'secondary',
        required
    })
    
    return (
        <Box container
            component='form'
            noValidate
            autoComplete='off'
            onSubmit={handleSubmit}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                ...sx
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
            <FormField
                {...getFieldProps('emailInput', 'Email', '123@example.com', 'Enter a valid email')}
                value={email.current}
                validateF={validateEmail}
                // validators={{
                //     setIsValid : (value) => dispatchFormValidity({issuer : 'email', value}),
                //     validateContent : validateEmail
                // }}
            />
            <FormField
                type='password'
                {...getFieldProps(
                    'passwordInput',
                    'Password',
                    null,
                    `Enter a password of ${passwordMinimumLength} characters minimum`
                )}
                value={password.current}
                validateF={validatePassword}
                // validators={{
                //     setIsValid : (value) => dispatchFormValidity({ issuer : 'password', value }),
                //     validateContent : validatePassword
                // }}
            />
            {userAction === 'signup' ? 
            <>
                <FormField
                    type='password'
                    {...getFieldProps(
                        'repasswordInput',
                        'Repeat password',
                        null,
                        'Type your password again'
                    )}
                    value={repassword.current}
                    validateF={validateRepassword}
                    // validators={{
                    //     setIsValid : (value) => dispatchFormValidity({issuer : 'repassword', value}),
                    //     validateContent : (rpwd) => validateRepassword(rpwd, password)
                    // }}
                />
                <FormField
                    {...getFieldProps(
                        'countrySelect',
                        'Country',
                        null,
                        'Select the financial system you belong to among the following available countries'
                    )}
                    value={country.current}
                    // validators={{
                    //     setIsValid : (value) => dispatchFormValidity({issuer : 'country', value})
                    // }}
                    select
                    children={
                        countries.map((option) => (
                            <MenuItem
                                key={option.value}
                                value={option.value}
                                disabled={!option.value}
                            >
                                {(option.value) ? option.label : <em>{option.label}</em>}
                            </MenuItem>
                        )
                    )}
                />
            </>
            : null}
            <Button item type='Submit' {...disabledProp} variant='contained' color='secondary' sx={{m : 1}}>Submit</Button>
        </Box>
    );
}

AuthForm.propTypes = {
    setToken: PropTypes.func.isRequired
}

export default AuthForm;