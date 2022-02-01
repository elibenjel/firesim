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
    const { children, externalValidityControl, iconMargins, sx } = props;
    const [hide, setHide] = useState(true);
    const [childrenIsValid, setChildrenIsValid] = useState(true);

    return (
        <Box container
            sx={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'center', alignItems: 'flex-start',
                p: 1, m: 1,
                width: '85%',
                ...sx
            }}
        >
            <ValidityIndicator childrenIsValid={externalValidityControl != null ? externalValidityControl : childrenIsValid}
                hide={hide} margins={iconMargins} />
            {children({ setChildrenIsValid, setHide })}
        </Box>
    )
}

export default ValidatorWrapper;