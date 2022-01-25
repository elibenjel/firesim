import React from "react";
import { useTranslation } from "react-i18next";
import { MoodBadOutlined } from '@mui/icons-material';
import { Box, Typography } from "@mui/material";

const NotFound = (props) => {
    const { t } = useTranslation('translation', { keyPrefix : 'NotFound' });
    return (
        <Box sx={{
            display: 'flex', flex: 1,
            alignItems: 'center', justifyContent: 'center'
        }}>
            <MoodBadOutlined size='large' sx={{ m : 2 }} />
            <Typography variant='h5' sx={{textAlign : 'center'}} >{t('notfound')}</Typography>
            <MoodBadOutlined size='large' sx={{ m : 2 }} />
        </Box>
    )
}

export default NotFound;