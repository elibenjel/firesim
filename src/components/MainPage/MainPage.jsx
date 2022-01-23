import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';
import {
    TrendingUp,
    Help,
    Analytics
} from '@mui/icons-material';

import CustomAppBar from '../CustomAppBar/CustomAppBar.jsx';
import HelpPanel from '../HomePanel/HomePanel.jsx';
import FastSimPanel from '../FastSimPanel/FastSimPanel.jsx';
import { initTrads } from '../../utils/translations.js';

const panels = [
    {
        index: 1,
        tabLabel: null,
        panelID: 'home-panel',
        to: '/home',
        icon: <Help />,
        panel: <HelpPanel />,
        sx: {
            flexDirection: 'row',
            alignItems: 'center',
            m: 'auto'
        }
    },
    {
        index: 2,
        tabLabel: null,
        panelID: 'fast-sim-panel',
        to: '/fastsim',
        icon: <TrendingUp />,
        panel: <FastSimPanel />,
        sx: {
            flexDirection: 'column',
        }
    },
    {
        index: 3,
        tabLabel: null,
        panelID: 'complete-sim-panel',
        to: '/home',
        icon: <Analytics />,
        panel: <HelpPanel />,
        sx: {
            flexDirection: 'row'
        }
    }
];

let init = false

const BasePanel = (props) => {
    // const { children, selected, index, id, sx, ...other } = props;
    const { panelProps, ...other } = props;
    const { panel, panelID : id, sx,  } = panelProps;

    return (
        <Box container id={id} aria-labelledby={`${id}-tab`}
            sx={{
                display: 'flex',
                justifyContent: 'space-evenly',
                ...sx
            }}
            { ...other }
        >
            { panel }
        </Box>
    )
}

const MainPage = ({ tab }) => {
    const { t } = useTranslation('translation', { keyPrefix: 'MainPage' });
    const didInit = useRef(false);
    if (!didInit.current) {
        panels.forEach((_, index) => initTrads({ t, source : panels[index] }));
        didInit.current = true;
    }

    return (
        <Box container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}
        >
        <CustomAppBar panels={panels} tab={tab} setTab={'setTab'} />
            {/* {
                panels.map(({ panel, panelID, sx }, index) => {
                    return (
                        <BasePanel key={index} index={index} selected={tab} id={panelID} sx={sx} >
                            { panel }
                        </BasePanel>
                    );
                })
            } */}
            <BasePanel selected={tab} panelProps={panels[tab]} />
        </Box>
    )
}

export default MainPage;