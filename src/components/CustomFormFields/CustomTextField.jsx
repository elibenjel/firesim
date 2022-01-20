import React from 'react';
import { useState } from 'react';
import { Box, TextField, InputAdornment, IconButton, MenuItem } from '@mui/material';
import { Error, CheckCircle } from '@mui/icons-material';

const CustomTextField = ({
    id,
    variant = 'standard',
    name = null,
    state,
    setState,
    stateRef,
    select = false,
    selectOptions = null,
    type = 'text',
    validators,
    setTargetID,
    required=true,
    placeholder='',
    helperText='',
    startAdornment=null,
    endAdornment=null,
    disabled=false,
    sx = {},
    ...other}) => {

    const { isValid, setIsValid, validateContent = ((value) => !!value)} = validators;

    const [isFocused, setIsFocused] = useState(false);

    const setStateUtility = stateRef ?
    (value) => (stateRef.current = value)
    : (value) => (setState(value));

    const getStateUtility = stateRef ?
    () => stateRef.current
    : () => state;

    const onDiff = (event) => {
        setStateUtility(event.target.value);
        onFocus(event);
    }

    const onFocus = (event) => {
        const currentVal = (event.target.value) ? event.target.value : getStateUtility();
        setTargetID(id);
        setIsFocused(true);
        if (validateContent(currentVal)) {
            setIsValid(true);
        } else {
            setIsValid(false);
        }
    }

    const onBlur = (event) => {
        setTargetID(null);
        setIsFocused(false);
    }

    const onMouseOver = (event) => {
        setTargetID(id);
    }

    const onMouseOut = (event) => {
        if (!isFocused) setTargetID(null);
    } 

    const eventHandlerProps = select ?
    { select, onChange : onDiff, onFocus, onMouseOver, onMouseOut }
    : { type, onInput : onDiff, onFocus, onMouseOver, onMouseOut };

    const valueProp = stateRef ? { value : stateRef.current } : { value : state };

    return (
        <Box container
            sx={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'flex-start',
                p: 1,
                m: 1,
                width: '85%',
                ...sx
            }}
        >
            <TextField item
                variant={variant}
                id={id}
                label={name}
                size='small'
                {...valueProp}
                {...eventHandlerProps}
                onBlur={onBlur}
                required={required}
                color='secondary'
                InputLabelProps={{
                    color: (isValid()) ? 'success' : 'error',
                }}
                placeholder={placeholder}
                helperText={helperText}
                sx={{
                    width: '100%',
                    '& .MuiFormHelperText-root' : {},
                }}
                InputProps={{
                    startAdornment: startAdornment &&
                    <InputAdornment position='start'>
                        {startAdornment}
                    </InputAdornment>,
                    endAdornment: endAdornment &&
                    <InputAdornment position='end'>
                        {endAdornment}
                    </InputAdornment>
                }}
                disabled={disabled}
            >
                {select ?
                selectOptions.map((option) => {
                    return <MenuItem
                        key={option.value}
                        value={option.value}
                        disabled={!option.value}
                    >
                        {(option.value) ? option.label : <em>{option.label}</em>}
                    </MenuItem>;
                  })
                : name}
            </TextField>
            {isValid() ?
                <CheckCircle item color='success' sx={{ m : 1, visibility : isFocused ? 'visible' : 'hidden' }}/>
                : <Error item color='error' sx={{ m : 1, visibility : disabled || isFocused ? 'visible' : 'hidden' }}/>
            }
        </Box>
    );
}

export default CustomTextField;