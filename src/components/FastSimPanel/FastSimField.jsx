import React, { useEffect, useRef, useState } from "react";
import { useTheme } from '@mui/material/styles';
import { ValidatorField } from '../CustomFormFields/CustomTextField.jsx';
import { useTranslation } from 'react-i18next';
import { Box } from "@mui/material";
import { fieldInfo, initTrads, tradKeys } from "./utils.js";

export const FastSimField = (props) => {
    const { id, sref, state, setState, validity, dispatch, disabled, ...other } = props;
    
    const { t } = useTranslation('translation', { keyPrefix: 'FastSimPanel' });
    const didInit = useRef(null);
    
    if (!didInit.current) {
        initTrads({t, id});
        didInit.current = true;
    }
    
    // get these prop values AFTER having set text with trad hook
    const { name : label, placeholder, helperText, validateF, startAdornment, info : helpBubble } = fieldInfo[id];

    return (
        <ValidatorField
            fieldProps={{
                id,
                variant: 'filled',
                label,
                placeholder,
                helperText,
                required: false,
                disabled
            }}
            adornments={{
                startAdornment,
                helpBubble
            }}
            stateRef={sref}
            state={state}
            setState={setState}
            validators={{
                checkValidity: () => validity[id],
                setIsValid: (value) => dispatch({ target : id, value }),
                validateContent: validateF
            }}
            // setTargetID={setTargetID}
            {...other}
        />
    )
}

export default FastSimField;