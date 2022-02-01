import React, { useRef } from "react";
import { useTranslation } from 'react-i18next';
import { TextField, InputAdornment } from "@mui/material";
import { Help } from '@mui/icons-material';

import ValidatorWrapper from '../InformationDisplay/ValidatorWrapper.jsx';
import HelpBubbleWrapper from '../InformationDisplay/HelpBubbleWrapper.jsx';


export const ParameterField = (props) => {
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
        <ValidatorWrapper externalValidityControl={externalValidityControl} iconMargins={{ mt : 2 }} {...other} >
            {
                (args) => (
                    <TextField
                        variant='filled'
                        size='small'
                        {...fieldProps(args)}
                        InputProps={{
                            startAdornment: startAdornment &&
                            <InputAdornment position='start'>
                                {startAdornment}
                            </InputAdornment>,
                            endAdornment: helpBubble &&
                            <HelpBubbleWrapper helpBubble={helpBubble}><Help /></HelpBubbleWrapper>
                        }}
                        {...other}
                    />
                )
            }
        </ValidatorWrapper>
    )
}

export default ParameterField;