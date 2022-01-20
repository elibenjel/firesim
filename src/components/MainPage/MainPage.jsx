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

const panels = [
    {
        tabLabel: 'How To Use',
        panelID: 'how-to-use-panel',
        icon: <Help />,
        panel: <HelpPanel />,
        sx: {
            flexDirection: 'row',
            alignItems: 'center',
            m: 'auto'
        }
    },
    {
        tabLabel: 'Fast Sim',
        panelID: 'fast-sim-panel',
        icon: <TrendingUp />,
        panel: <FastSimPanel />,
        sx: {
            flexDirection: 'column',
        }
    },
    {
        tabLabel: 'Complete Sim',
        panelID: 'complete-sim-panel',
        icon: <Analytics />,
        panel: <HelpPanel />,
        sx: {
            flexDirection: 'row'
        }
    }
];

const BasePanel = (props) => {
    const { children, selected, index, id, sx, ...other } = props;

    return (
        <>
            {(selected === index) &&
            <Box container id={id} aria-labelledby={`${id}-tab`}
                sx={{
                    display: 'flex',
                    justifyContent: 'space-evenly',
                    ...sx
                }}
                { ...other }
            >
                { children }
            </Box>
            }
        </>
    )
}

const MainPage = () => {
    const [tab, setTab] = useState(0);

    let { id } = useParams();
    console.log(window.innerWidth, window.outerWidth);
    
    return (
        <Box container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '100%'
            }}
        >
        <CustomAppBar panels={panels} tab={tab} setTab={setTab} />
            {
                panels.map(({ panel, panelID, sx }, index) => {
                    return (
                        <BasePanel key={index} index={index} selected={tab} id={panelID} sx={sx} >
                            { panel }
                        </BasePanel>
                    );
                })
            }
        </Box>
    )
}

export default MainPage;