import React, { useRef } from "react";
import { useTranslation } from 'react-i18next';

import ValidatorField from '../Input/ValidatorField.jsx';
import { fieldInfo } from "./utils.js";


export const ParameterField = (props) => {
    const { tradHook : t, id, sref, state, setState, validity, dispatch, readOnly, ...other } = props;
    
    const didInit = useRef(null);
    
    // if (!didInit.current) {
    //     initTrads({ t, source : fieldInfo[id], getTradKeys });
    //     didInit.current = true;
    // }
    
    // get these prop values AFTER having set text with trad hook
    const { nameF, placeholder, helperTextF, validateF, startAdornmentF, infoF } = fieldInfo[id];
    const label = nameF(t), helperText = helperTextF(t), startAdornment = startAdornmentF(t), helpBubble = infoF(t);

    return (
        <ValidatorField
            id={id}
            fieldProps={{
                id,
                variant: 'filled',
                label,
                placeholder,
                helperText,
                required: false,
                readOnly
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
            {...other}
        />
    )
}

export default ParameterField;