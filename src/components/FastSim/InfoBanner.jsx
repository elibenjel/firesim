import React from 'react';
import {
    Typography,
    Paper,
} from '@mui/material';

const InfoBanner = (props) => {
    const { tradHook : t } = props;

    return (
        <Paper
            variant='simple'
            sx={{
                textAlign : 'center'
            }}
        >
            <Typography variant='h6' fontWeight={'bold'} >{t('base-info1')}</Typography>
            <Typography variant='body1' >{t('base-info2')}</Typography>
        </Paper>
    );
}

export default InfoBanner;