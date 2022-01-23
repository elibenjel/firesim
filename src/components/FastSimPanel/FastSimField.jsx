import React, { useRef } from "react";
import { useTranslation } from 'react-i18next';

import ValidatorField from '../ValidatorField/ValidatorField.jsx';
import { fieldInfo, getTradKeys } from "./utils.js";
import { initTrads } from "../../utils/translations";


export const FastSimField = (props) => {
    const { id, sref, state, setState, validity, dispatch, readOnly, ...other } = props;
    
    const { t } = useTranslation('translation', { keyPrefix: 'FastSimPanel' });
    const didInit = useRef(null);
    
    if (!didInit.current) {
        initTrads({ t, source : fieldInfo[id], getTradKeys });
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
            // setTargetID={setTargetID}
            {...other}
        />
    )
}

export default FastSimField;