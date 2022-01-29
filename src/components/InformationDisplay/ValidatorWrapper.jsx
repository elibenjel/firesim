import React, { useState, useRef } from 'react';
import { Box } from '@mui/material';
import { Error, CheckCircle } from '@mui/icons-material';


const ValidityIndicator = (props) => {
    const { childrenIsValid, hide } = props;
    return (
        <>
        {
            childrenIsValid ?
            <CheckCircle color='success' sx={{ m : 1, mt : 2, visibility : hide ? 'hidden' : 'visible' }}/>
            : <Error color='error' sx={{ m : 1, mt : 2 }}/>
        }
        </>
    )
}

const ValidatorWrapper = (props) => {
    const { children, externalValidityControl } = props;
    const [hide, setHide] = useState(true);
    const [childrenIsValid, setChildrenIsValid] = useState(true);

    return (
        <Box container
            sx={{
                display: 'flex', flexDirection: 'row',
                justifyContent: 'center', alignItems: 'flex-start',
                p: 1, m: 1,
                width: '85%'
            }}
        >
            <ValidityIndicator childrenIsValid={externalValidityControl != null ? externalValidityControl : childrenIsValid} hide={hide} />
            {children({ setChildrenIsValid, setHide })}
        </Box>
    )
}

export default ValidatorWrapper;