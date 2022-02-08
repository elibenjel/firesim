import React, { useState } from 'react';
import { Box } from '@mui/material';
import { Error, CheckCircle } from '@mui/icons-material';


const ValidityIndicator = (props) => {
    const { childrenIsValid, hide, margins } = props;
    return (
        <>
        {
            childrenIsValid ?
            <CheckCircle color='success' sx={{ visibility : hide ? 'hidden' : 'visible', m : 1, ...margins }}/>
            : <Error color='error' sx={{ m : 1, ...margins }}/>
        }
        </>
    )
}

const ValidatorWrapper = (props) => {
    const { children, externalValidityControl, iconMargins, exposeIndicator, sx } = props;
    const [hide, setHide] = useState(false);
    const [childrenIsValid, setChildrenIsValid] = useState(true);

    const getIndicator = () => <ValidityIndicator childrenIsValid={externalValidityControl != null ? externalValidityControl : childrenIsValid}
    hide={hide} margins={iconMargins} />;
    const getChildrenIsValid = () => externalValidityControl || childrenIsValid;
    return (
        exposeIndicator ?
        children({ getChildrenIsValid, setChildrenIsValid, setHide, getIndicator })
        :
        (<Box container
            sx={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'center', alignItems: 'flex-start',
                p: 1, m: 1,
                // width: '85%',
                ...sx
            }}
        >
            {getIndicator()}
            {children({ getChildrenIsValid, setChildrenIsValid, setHide })}
        </Box>)
    )
}

export default ValidatorWrapper;