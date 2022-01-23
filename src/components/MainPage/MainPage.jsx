import React, {useState} from 'react';
import { Button, Box} from '@mui/material';
import { Link, useParams } from 'react-router-dom';
// import { makeStyles } from '@material-ui/core/styles';
import CustomAppBar from '../CustomAppBar/CustomAppBar.jsx';
import {
    TrendingUp,
    Help,
    Analytics,
    OndemandVideoOutlined
} from '@mui/icons-material';
import HelpPanel from '../HelpPanel/HelpPanel.jsx';
import FastSimPanel from '../FastSimPanel/FastSimPanel.jsx';
import { useTranslation } from 'react-i18next';

const panels = [
    {
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
        panelID: 'fast-sim-panel',
        to: '/fastsim',
        icon: <TrendingUp />,
        panel: <FastSimPanel />,
        sx: {
            flexDirection: 'column',
        }
    },
    {
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
        // <>
        //     {(selected === index) &&
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
        //     }
        // </>
    )
}

const MainPage = ({ tab }) => {
    // const [tab, setTab] = useState(0);
    const { t } = useTranslation('translation', { keyPrefix: 'MainPage' });
    if (!init){
        panels.forEach((_, index) => {
            const tradKey = `tabLabel${index+1}`;
            panels[index].tabLabel = t(tradKey);
        });
        init = true;
    }

    // let { id } = useParams();
    
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