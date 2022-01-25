import React from 'react';
import {
    Typography,
    Paper,
} from '@mui/material';

import CustomChart from '../DataDisplay/CustomChart.jsx';

const ResultPanel = (props) => {
    const { tradHook : t, fortuneGrowth, simulationFirstRun, chartSeries } = props;

    return (
        <>
            {fortuneGrowth ?
            <>
                <Typography variant='h4' fontWeight='bold' sx={{ textAlign : 'center'}} >{t('title2')}</Typography>
                <Typography variant='h6' sx={{ textAlign : 'center'}} >
                    {t('r1')}{
                    fortuneGrowth.yearsToRetire === 1 ? t('r2') :
                    (fortuneGrowth.yearsToRetire === 1 ?
                        t('r3') :
                        `${t('r4')}${fortuneGrowth.yearsToRetire}${t('r5')}`)
                }</Typography>
                <Paper
                    variant='solid-primary'
                    sx={{
                        m: 2, p: 2,
                        display: 'flex', flexDirection: 'column',
                        justifyContent: 'center',
                        visibility: simulationFirstRun.current ? 'hidden' : 'visible'
                    }}
                >
                    <Typography variant='caption' fontWeight={'bold'} sx={{ textAlign : 'center' }} >{t('caption')}</Typography>
                    <CustomChart
                        series={chartSeries}
                        width={'100%'} height={'70%'}
                        layerWidth={950} layerHeight={600}
                        viewBox='0 0 900 600'
                        minY={0} maxY={Math.max(...fortuneGrowth.endFortunes)}
                        ticks={fortuneGrowth.yearsToRetire}
                    />
                </Paper>
            </>
            : null}
        </>
    )
}

export default ResultPanel;