import React, { useState, useRef } from 'react';
import {
    Box,
    TextField,
    InputAdornment
} from '@mui/material';
import { Error, CheckCircle, Help } from '@mui/icons-material';

import HelpBubbleWrapper from '../HelpBubbleWrapper/HelpBubbleWrapper.jsx';


const ValidityIndicator = (props) => {
    const { checkValidity, isFocused, readOnly } = props;
    return (
        <>
        {
            checkValidity() ?
            <CheckCircle color='success' sx={{ m : 1, visibility : isFocused ? 'visible' : 'hidden' }}/>
            : <Error color='error' sx={{ m : 1, visibility : readOnly || isFocused ? 'visible' : 'hidden' }}/>
        }
        </>
    )
}

export const ValidatorField = (props) => {
    const { fieldProps, select, stateRef, state, setState, adornments, validators, callbacks, sx, children, ...other } = props;
    const [isFocused, setIsFocused] = useState(false);
    const isValid = useRef(null);
    
    const { readOnly } = fieldProps || {};
    const { startAdornment, endAdornment, helpBubble } = adornments || {};
 
    // Parent specifies how to validate content, and can provide a setter callback to track the field validity
    const { checkValidity = () => isValid.current, setIsValid = () => null, validateContent = () => true} = validators || {};

    const setIsValidUtility = (value) => {
        const valid = validateContent(value);
        setIsValid(valid);
        isValid.current = valid;
    }
    
    // Parent can give additional actions to perform for each event, e.g. track if field is focused
    const { handleFocus, handleBlur, handleMouseOver, handleMouseOut, handleDiff } = callbacks || {};   

    const setStateUtility = stateRef ?
    (value) => (stateRef.current = value)
    : (value) => (setState(value));

    const getStateUtility = stateRef ?
    () => stateRef.current
    : () => state;

    const MyField = CustomTextFieldBis;

    // validate content when field get focused or change its value
    const onDiff = (event) => {
        setStateUtility(event.target.value);
        onFocus(event);
        handleDiff && handleDiff();
    }

    const onFocus = (event) => {
        const currentVal = event.target.value;
        setIsFocused(true);
        setIsValidUtility(currentVal);
        handleFocus && handleFocus();
    }

    const onBlur = (event) => {
        setIsFocused(false);
        handleBlur && handleBlur();
    }

    const onMouseOver = (event) => {
        handleMouseOver && handleMouseOver();
    }

    const onMouseOut = (event) => {
        handleMouseOut && handleMouseOut();
    }

    const commonProps = { onFocus, onMouseOver, onMouseOut, onBlur };
    const otherProps = select ?
    { select, onChange : onDiff }
    : { type : 'text', onInput : onDiff };

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
            {...other}
        >
            <TextField
                variant='outlined'
                size='small'
                value={getStateUtility()}
                children={children}
                InputLabelProps={{
                    color: (checkValidity()) ? 'success' : 'error',
                }}
                InputProps={{
                    startAdornment: startAdornment &&
                    <InputAdornment position='start'>
                        {startAdornment}
                    </InputAdornment>,
                    endAdornment: (endAdornment || helpBubble) &&
                    <InputAdornment position='end'>
                        {
                            helpBubble ?
                            <HelpBubbleWrapper
                                helpBubble={helpBubble}
                                id={`${fieldProps.id}-bubble-info`}
                            >
                                <Help size='small' />
                            </HelpBubbleWrapper>
                            :
                            endAdornment
                        }
                    </InputAdornment>,
                    readOnly
                }}
                sx={{ width : '100%' }}
                {...commonProps}
                {...otherProps}
                {...fieldProps}
            />
            <ValidityIndicator checkValidity={checkValidity} isFocused={isFocused} readOnly={readOnly} />
        </Box>
    )
}

const CustomTextFieldBis = (props) => {
    const { getState, setState, select, ...rest } = props

    return (
        <TextField {...fieldProps} />
    )
}

export default ValidatorField;