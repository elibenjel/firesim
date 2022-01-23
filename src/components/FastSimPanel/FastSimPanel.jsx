import React, { useState, useRef, useReducer } from 'react';
import {
    Box,
    Typography,
    Paper,
    FormGroup,
    FormControlLabel,
    Switch,
    IconButton
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
    PlayCircleFilledOutlined
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';

import FastSimField from './FastSimField.jsx';
import { fieldInfo, tradKeys } from "./utils.js";
import CustomChart from '../CustomChart/CustomChart.jsx';
import HelpBubbleWrapper from '../HelpBubbleWrapper/HelpBubbleWrapper.jsx';
import { whenCanIFIRE } from '../../services/computations.js';


const InfoBanner = (props) => {
    const { tradHook : t } = props;

    return (
        <Paper
            variant='filled-secondary'
            sx={{
                p: 1,
                m : '16px 0 16px',
                textAlign : 'center'
            }}
        >
            <Typography variant='h6' fontWeight={'bold'} >{t('base-info1')}</Typography>
            <Typography variant='body1' >{t('base-info2')}</Typography>
        </Paper>
    )
}

const DividendsSwitch = (props) => {
    const { id, onChange } = props;
    const tradIndex = fieldInfo[id].index;
    
    const { t } = useTranslation('translation', { keyPrefix: 'FastSimPanel' });
    Object.entries(fieldInfo[id]).map(
        ([key, value]) => {
            if (value === null) {
                fieldInfo[id][key] = t(tradKeys[key](tradIndex));
            }
        }
    )
        
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
    const theme = useTheme();
    const { t } = useTranslation('translation', { keyPrefix: 'FastSimPanel' });

    const [currentFocus, setCurrentFocus] = useState(null);
    const simulationFirstRun = useRef(true);
    const [annualIncomeInit, annualSpendingsInit] = [30000, 15000];
    const annualBenefitsInit = annualIncomeInit - annualSpendingsInit;
    const [annualIncome, setAnnualIncome] = useState(annualIncomeInit);
    const [annualSpendings, setAnnualSpendings] = useState(annualSpendingsInit);
    const annualBenefits = useRef(annualBenefitsInit);

    const [igrInit, irInit] = [8, 2]
    const [igr, setIgr] = useState(igrInit);
    const [ir, setIr] = useState(irInit);
    const roi = useRef(igrInit + irInit);
    
    const reinvestDividends = useRef(false);

    // const fortuneGrowthInit = whenCanIFIRE({
    //     annualIncome: annualIncomeInit,
    //     annualSpendings: annualSpendingsInit,
    //     igr: igrInit,
    //     ir: irInit,
    //     reinvestDividends : false
    // });

    const [fortuneGrowth, setFortuneGrowth] = useState(null);

    const setYearsToRetireUtility = () => {
        const fortuneGrowth = whenCanIFIRE({
            annualIncome,
            annualSpendings,
            igr,
            ir,
            reinvestDividends: reinvestDividends.current
        });
        setFortuneGrowth(fortuneGrowth);
    };

    const [parameterValidity, dispatchParameterValidity] = useReducer((currentState, action) => {
        let newState = {...currentState};
        newState[action.target] = action.value;
        return newState;
    }, Object.keys(fieldInfo).reduce((prev, curr) => {  // returns an object containing entries of type { fieldID : true }
        prev[curr] = true;
        const next = {...prev};
        return next;
    }, {}));

    const disabled = !Object.values(parameterValidity).reduce((prev, current) => {
        return current && prev;
    }, true);

    const disabledProp = { disabled };
    const chartSeries = [{
        data : fortuneGrowth?.endFortunes
    }]


    return (
        <>
            <InfoBanner tradHook={t} />
            <Box container sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around'
            }} >
                <Paper variant='side-primary' reversed sx={{ maxWidth : '40%'}} >
                    <Typography variant='h4' fontWeight={'bold'}>{t('title1')}</Typography>
                    <Box container sx={{
                        display: 'flex',
                        flexDirection: 'column'
                    }} >
                        <FastSimField
                            id={'annualIncomeInput'}
                            state={annualIncome}
                            setState={(val) => {
                                annualBenefits.current = val - annualSpendings;
                                dispatchParameterValidity({
                                    target : 'annualBenefitsInput',
                                    value : fieldInfo.annualBenefitsInput.validateF(annualBenefits.current)
                                });
                                setAnnualIncome(val);
                            }}
                            validity={parameterValidity}
                            dispatch={dispatchParameterValidity}
                        />
                        <FastSimField
                            id='annualSpendingsInput'
                            state={annualSpendings}
                            setState={(val) => {
                                annualBenefits.current = annualIncome - val;
                                dispatchParameterValidity({
                                    target : 'annualBenefitsInput',
                                    value : fieldInfo.annualBenefitsInput.validateF(annualBenefits.current)
                                });
                                setAnnualSpendings(val);
                            }}
                            validity={parameterValidity}
                            dispatch={dispatchParameterValidity}
                        />
                        <FastSimField
                            id='annualBenefitsInput'
                            sref={annualBenefits}
                            validity={parameterValidity}
                            dispatch={dispatchParameterValidity}
                            disabled
                        />
                        <FastSimField
                            id='igrInput'
                            state={igr}
                            setState={(val) => {
                                roi.current = ir - - val;
                                dispatchParameterValidity({
                                    target : 'roiInput',
                                    value : fieldInfo.roiInput.validateF(roi.current)
                                });
                                setIgr(val);
                            }}
                            validity={parameterValidity}
                            dispatch={dispatchParameterValidity}
                        />
                        <FastSimField
                            id='irInput'
                            state={ir}
                            setState={(val) => {
                                roi.current = igr - - val;
                                dispatchParameterValidity({
                                    target : 'roiInput',
                                    value : fieldInfo.roiInput.validateF(roi.current)
                                });
                                setIr(val);
                            }}
                            validity={parameterValidity}
                            dispatch={dispatchParameterValidity}
                        />
                        <FastSimField
                            id='roiInput'
                            sref={roi}
                            validity={parameterValidity}
                            dispatch={dispatchParameterValidity}
                            disabled
                        />
                    </Box>
                </Paper>
                <Box sx={{
                    minWidth: '40%',
                    maxHeight: '100vh',
                    alignSelf: 'flex-start',
                    // flex: 1,
                    // flexGrow: 0.5,
                    // flexShrink: 2,
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
                            if (!simulationFirstRun.current) setYearsToRetireUtility();
                        }}
                        />
                        <FormGroup>
                        <FormControlLabel
                            control={
                                <IconButton size='small' color='primary' {...disabledProp}
                                onClick={() => {
                                    simulationFirstRun.current = false;
                                    setYearsToRetireUtility();
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
                </Box>
            </Box>
        </>
    )
}

export default FastSimPanel;