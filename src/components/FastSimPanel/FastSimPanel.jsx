import React, { useState, useRef, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import {
    Box,
    Typography,
    Paper,
    FormGroup,
    FormControlLabel,
    Switch,
    IconButton
} from '@mui/material';
import { PlayCircleFilledOutlined } from '@mui/icons-material';

import FastSimField from './FastSimField.jsx';
import CustomChart from '../CustomChart/CustomChart.jsx';
import HelpBubbleWrapper from '../HelpBubbleWrapper/HelpBubbleWrapper.jsx';
import { fieldInfo, getTradKeys } from "./utils.js";
import { initTrads } from "../../utils/translations";
import { whenCanIFIRE } from '../../services/computations.js';


const InfoBanner = (props) => {
    const { tradHook : t } = props;

    return (
        <Paper
            variant='simple'
            sx={{
                p: 1,
                m : '16px 0 16px',
                borderRadius: 0,
                textAlign : 'center'
            }}
        >
            <Typography variant='h6' fontWeight={'bold'} >{t('base-info1')}</Typography>
            <Typography variant='body1' >{t('base-info2')}</Typography>
        </Paper>
    );
}

const ParameterPanel = (props) => {
    const { tradHook: t,
        annualIncome, setAnnualIncome, annualSpendings, setAnnualSpendings, annualBenefits,
        igr, setIgr, ir, setIr, roi,
        parameterValidity, dispatchParameterValidity
    } = props;

    const updateBenefits = (val, setState) => {
        annualBenefits.current = annualIncome - val;
        dispatchParameterValidity({
            target : 'annualBenefitsInput',
            value : fieldInfo.annualBenefitsInput.validateF(annualBenefits.current)
        });
        setState(val);
    }

    const updateRoi = (val, setState) => {
        roi.current = igr - - val;
        dispatchParameterValidity({
            target : 'roiInput',
            value : fieldInfo.roiInput.validateF(roi.current)
        });
        setState(val);
    }

    const validityProps = { validity : parameterValidity, dispatch : dispatchParameterValidity }

    return (
        <Paper variant='side-primary' reversed sx={{ maxWidth : '40%'}} >
            <Typography variant='h4' fontWeight={'bold'}>{t('title1')}</Typography>
            <Box container sx={{
                display: 'flex',
                flexDirection: 'column'
            }} >
                <FastSimField id={'annualIncomeInput'}
                    state={annualIncome} setState={val => updateBenefits(val, setAnnualIncome)} {...validityProps} />
                <FastSimField id='annualSpendingsInput'
                    state={annualSpendings} setState={val => updateBenefits(val, setAnnualSpendings)} {...validityProps} />
                <FastSimField readOnly id='annualBenefitsInput' sref={annualBenefits} {...validityProps} />
                <FastSimField id='igrInput' state={igr} setState={val => updateRoi(val, setIgr)} {...validityProps} />
                <FastSimField id='irInput' state={ir} setState={val => updateRoi(val, setIr)} {...validityProps} />
                <FastSimField readOnly id='roiInput' sref={roi} {...validityProps} />
            </Box>
        </Paper>
    );
}

const ControlBar = (props) => {
    const { tradHook : t, reinvestDividends, setFortuneGrowthUtility, simulationFirstRun, ...disabledProp } = props;

    return (
        <Paper variant='solid-primary' sx={{
            mt : 0, mb : 4, p : '0 24px 0',
            display : 'flex',
            justifyContent : 'space-between', alignItems : 'center'
        }}>
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

const DividendsSwitch = (props) => {
    const { tradHook : t, id, onChange } = props;
    initTrads({ t, source : fieldInfo[id], getTradKeys })
        
    const label = fieldInfo[id].name;
    const info = fieldInfo[id].info;

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

const FastSimPanel = () => {
    const { t } = useTranslation('translation', { keyPrefix: 'FastSimPanel' });
    const tradHook = t;

    // used to hide the chart if the user has not yet run the simulation 
    const simulationFirstRun = useRef(true);

    // initial values of the simulation
    const [annualIncomeInit, annualSpendingsInit] = [30000, 15000];
    const annualBenefitsInit = annualIncomeInit - annualSpendingsInit;
    
    // the two first input states must change the state of the third ref when they are updated
    const [annualIncome, setAnnualIncome] = useState(annualIncomeInit);
    const [annualSpendings, setAnnualSpendings] = useState(annualSpendingsInit);
    const annualBenefits = useRef(annualBenefitsInit);

    // same thing here
    const [igrInit, irInit] = [8, 2]
    const [igr, setIgr] = useState(igrInit);
    const [ir, setIr] = useState(irInit);
    const roi = useRef(igrInit + irInit);
    
    // state ref of the switch
    const reinvestDividends = useRef(false);

    // main state variable of the simulation : rerun the sim when it is updated
    const [fortuneGrowth, setFortuneGrowth] = useState(null);

    const setFortuneGrowthUtility = () => {
        const fortuneGrowth = whenCanIFIRE({
            annualIncome,
            annualSpendings,
            igr,
            ir,
            reinvestDividends: reinvestDividends.current
        });
        setFortuneGrowth(fortuneGrowth);
    };

    // hold validity states of each parameters of the sim, to disable it if something is wrong
    const [parameterValidity, dispatchParameterValidity] = useReducer((currentState, action) => {
        let newState = {...currentState};
        newState[action.target] = action.value;
        return newState;
    }, Object.keys(fieldInfo).reduce((prev, curr) => {  // returns an object containing entries of type { fieldID : true }
        prev[curr] = true;
        const next = {...prev};
        return next;
    }, {}));

    // can the simulation be run or not
    const disabled = !Object.values(parameterValidity).reduce((prev, current) => {
        return current && prev;
    }, true);

    const disabledProp = { disabled };

    // the data that must be shown
    const chartSeries = [{
        data : fortuneGrowth?.endFortunes
    }]

    const parameterPanelProps = {
        tradHook,
        annualIncome, setAnnualIncome,
        annualSpendings, setAnnualSpendings,
        annualBenefits,
        igr, setIgr,
        ir, setIr,
        roi,
        parameterValidity, dispatchParameterValidity
    }

    return (
        <>
            <InfoBanner tradHook={t} />
            <Box container sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around'
            }} >
                <ParameterPanel {...parameterPanelProps} />
                <Box sx={{
                    m: 4,
                    minWidth: '40%', maxHeight: '100vh',
                    position: 'sticky', top: 40,
                    alignSelf: 'flex-start',
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                <ControlBar
                    {...{ tradHook, setFortuneGrowthUtility, reinvestDividends, simulationFirstRun, ...disabledProp }}
                />
                <ResultPanel {...{ tradHook, fortuneGrowth, chartSeries, simulationFirstRun }} />
                {/* <Box sx={{
                    minWidth: '40%',
                    maxHeight: '100vh',
                    alignSelf: 'flex-start',
                    m: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'sticky',
                    top: 40
                }}>
                    <Paper variant='solid-primary' sx={{
                        mt : 0,
                        mb : 4,
                        p : '0 24px 0',
                        display : 'flex',
                        justifyContent : 'space-between',
                        alignItems : 'center' }} >
                        <DividendsSwitch
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
                                m: 2,
                                p: 2,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                visibility: simulationFirstRun.current ? 'hidden' : 'visible'
                            }}
                        >
                            <Typography variant='caption' fontWeight={'bold'} sx={{ textAlign : 'center' }} >{t('caption')}</Typography>
                            <CustomChart
                                series={chartSeries}
                                width={'100%'}
                                height={'70%'}
                                layerWidth={950}
                                layerHeight={600}
                                viewBox='0 0 900 600'
                                minY={0}
                                maxY={Math.max(...fortuneGrowth.endFortunes)}
                                ticks={fortuneGrowth.yearsToRetire}
                            />
                        </Paper>
                    </>
                    : null
                }
                </Box> */}
            </Box>
        </Box>
        </>
    )
}

export default FastSimPanel;