import React from 'react';
import {
    Paper,
    FormGroup,
    FormControlLabel,
    IconButton,
    Switch
} from '@mui/material';
import { PlayCircleFilledOutlined } from '@mui/icons-material';

import HelpBubbleWrapper from '../InformationDisplay/HelpBubbleWrapper.jsx';
import { fieldInfo } from './utils.js';


const DividendsSwitch = (props) => {
    const { tradHook : t, id, onChange } = props;
    // initTrads({ t, source : fieldInfo[id], getTradKeys })
        
    const label = fieldInfo[id].nameF(t);
    const info = fieldInfo[id].infoF(t);

    return (
        <HelpBubbleWrapper
            id={'reinvestDividensSwitch-bubble-info'}
            helpBubble={info}
            placement={'left-end'}
        >
            <FormGroup>
                <FormControlLabel
                    control={
                        <Switch
                            id='reinvestDividendsSwitch'
                            size='small'
                            color='primary'
                            onChange={onChange}
                        />
                    }
                    label={label}
                />
            </FormGroup>
        </HelpBubbleWrapper>
    )
}

console.log('NO')
const ControlBar = (props) => {
    const { tradHook : t, reinvestDividends, setFortuneGrowthUtility, simulationFirstRun, ...disabledProp } = props;

    return (
        <Paper variant='solid-primary' sx={{
            mt : 0, mb : 4, p : '0 24px 0',
            display : 'flex',
            justifyContent : 'space-between', alignItems : 'center'
        }}>
                    {console.log('YES')}
            <DividendsSwitch
                tradHook={t}
                id='reinvestDividendsSwitch'
                onChange={(event) => {
                    reinvestDividends.current = event.target.checked;
                    if (!simulationFirstRun.current) setFortuneGrowthUtility();
                }}
            />
            <FormGroup>
                <FormControlLabel
                    control={
                        <IconButton size='small' color='primary' {...disabledProp}
                            onClick={() => {
                                simulationFirstRun.current = false;
                                setFortuneGrowthUtility();
                                }} >
                            <PlayCircleFilledOutlined />
                        </IconButton>
                    }
                    label={t('run')}  
                />
            </FormGroup>
        </Paper>
    )
}

export default ControlBar;