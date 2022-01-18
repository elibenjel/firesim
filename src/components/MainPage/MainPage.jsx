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

const panels = [
    {
        tabLabel: 'How To Use',
        panelID: 'how-to-use-panel',
        icon: <Help />,
        panel: <HelpPanel />
    },
    {
        tabLabel: 'Fast Sim',
        panelID: 'fast-sim-panel',
        icon: <TrendingUp />,
        panel: <HelpPanel />
    },
    {
        tabLabel: 'Complete Sim',
        panelID: 'complete-sim-panel',
        icon: <Analytics />,
        panel: <HelpPanel />
    }
];

const MainPanel = (props) => {
    const { children, selected, index, id, ...other } = props;

    return (
        <>
            {(selected === index) &&
            <Box container id={id} aria-labelledby={`${id}-tab`}
                sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    alignItems: 'center',
                    m: 'auto'
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
    
    return (
        // <Background source={user_background}>
        //     <h1>Hello, you !</h1>
        // </Background>
        <Box container
            sx={{
                display: 'flex',
                flexDirection: 'column'
            }}
        >
        <CustomAppBar panels={panels} tab={tab} setTab={setTab} />
            {
                panels.map(({ panel, panelID }, index) => {
                    return (
                        <MainPanel key={index} index={index} selected={tab} id={panelID} >
                            { panel }
                        </MainPanel>
                    );
                })
            }
        </Box>
    )
}

export default MainPage;