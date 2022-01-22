import React, { useEffect } from 'react';
import { useState, useRef, useReducer } from 'react';
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
import CustomTextField from '../CustomFormFields/CustomTextField.jsx';
import { whenCanIFIRE } from '../../services/computations.js';
import {
    PlayCircleFilledOutlined,
    AccountCircle,
    TrendingUpIcon,
    WhatshotIcon,
    HelpIcon,
    AnalyticsIcon
} from '@mui/icons-material';
import CustomChart from '../CustomChart/CustomChart.jsx';
import { useTranslation } from 'react-i18next';

const fieldInfo = {
    annualIncomeInput: {
        index: 1,
        name: null,
        info: null,
        validateF: (val) => {
            return val && !Number.isNaN(Number(val)) && val >= 0;
        },
        placeholder: 'ex: 30000',
        helperText: null,
        startAdornment: null
    },

    annualSpendingsInput: {
        index: 2,
        name: null,
        info: null,
        validateF: (val) => {
            return val && !Number.isNaN(Number(val)) && val >= 0;
        },
        placeholder: 'ex: 15000',
        helperText: null,
        startAdornment: null
    },

    annualBenefitsInput: {
        index: 3,
        name: null,
        info: null,
        validateF: (val) => {
            return val && !Number.isNaN(Number(val)) && val >= 0;
        },
        helperText: null,
        startAdornment: null
    },

    igrInput: {
        index: 4,
        name: null,
        info: null,
        validateF: (val) => {
            return val && !Number.isNaN(Number(val));
        },
        placeholder: 'ex: 8',
        helperText: null,
        startAdornment: '%'
    },

    irInput: {
        index: 5,
        name: null,
        info: null,
        validateF: (val) => {
            return val && !Number.isNaN(Number(val));
        },
        placeholder: 'ex: 2',
        helperText: null,
        startAdornment: '%'
    },

    roiInput: {
        index: 6,
        name: null,
        info: null,
        validateF: (val) => {
            return val && Number(val);
        },
        placeholder: 'ex: 10',
        helperText: null,
        startAdornment: '%'
    },

    reinvestDividendsSwitch: {
        index: 7,
        name: null,
        info: null
    }
}

const SimField = (props) => {
    const { id, sref, state, setState, isValid, dispatch, setTargetID, ...other } = props;
    return (
        <CustomTextField item
            id={id}
            variant='filled'
            name={fieldInfo[id].name}
            stateRef={sref}
            state={state}
            setState={setState}
            type='text'
            validators={{
                isValid: () => isValid[id],
                setIsValid : (value) => dispatch({ target : id, value }),
                validateContent : fieldInfo[id].validateF
            }}
            setTargetID={setTargetID}
            placeholder={fieldInfo[id].placeholder}
            required={false}
            helperText={fieldInfo[id].helperText}
            startAdornment={fieldInfo[id].startAdornment}
            endAdornment={fieldInfo[id].endAdornment}
            {...other}
        />
    )
}

let init = false;

const FastSimPanel = () => {
    const theme = useTheme();
    const { t } = useTranslation('translation', { keyPrefix: 'FastSimPanel' });
    if (!init){
        Object.entries(fieldInfo).map(([field, information]) => {
            const index = information.index;
            const tradKeys = { name : 'fn', info : 'info', helperText : 'ht', startAdornment : 'currency' };

            Object.entries(information).map(([key, value]) => {
                if (value === null) {
                    const tradKey = (key === 'startAdornment') ? tradKeys[key] : `${tradKeys[key]}${index}`;
                    fieldInfo[field][key] = t(tradKey);
                }
            });

            console.log(fieldInfo)
        });
        init = true;
    }

    const [currentFocus, setCurrentFocus] = useState(null);
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

    const fortuneGrowthInit = whenCanIFIRE({
        annualIncome: annualIncomeInit,
        annualSpendings: annualSpendingsInit,
        igr: igrInit,
        ir: irInit,
        reinvestDividends : false
    });

    const [fortuneGrowth, setFortuneGrowth] = useState(fortuneGrowthInit);

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
        data : fortuneGrowth.endFortunes
    }]


    return (
        <>
            <Paper elevation={0} sx = {{ p : 0, m : '16px 0 16px', position : 'sticky', top : 0, zIndex : 100 }} >
                <Paper
                    variant='filled-secondary'
                    sx={{
                        m: 0,
                        p: 1,
                        height: (2 + theme.typography.fontSize)*8,
                        overflow: 'auto',
                        borderRadius: 0,
                        textAlign : 'center'
                    }}
                >
                    { currentFocus ?
                        <>
                            <Typography variant='h6' fontWeight={'bold'} >{fieldInfo[currentFocus]?.name}:</Typography>
                            <Typography variant='body1' >{fieldInfo[currentFocus]?.info}</Typography>
                        </>
                        :
                        <>
                            <Typography variant='h6' fontWeight={'bold'} >{t('base-info1')}</Typography>
                            <Typography variant='body1' >{t('base-info2')}<br/>
                                <em>{t('base-info3')}</em>
                            </Typography>
                        </>
                    }
                </Paper>
            </Paper>
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
                        <SimField
                            id='annualIncomeInput'
                            state={annualIncome}
                            setState={(val) => {
                                annualBenefits.current = val - annualSpendings;
                                dispatchParameterValidity({
                                    target : 'annualBenefitsInput',
                                    value : fieldInfo.annualBenefitsInput.validateF(annualBenefits.current)
                                })
                                setAnnualIncome(val);
                            }}
                            isValid={parameterValidity}
                            dispatch={dispatchParameterValidity}
                            setTargetID={setCurrentFocus}
                            size='small'
                        />
                        <SimField
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
                            isValid={parameterValidity}
                            dispatch={dispatchParameterValidity}
                            setTargetID={setCurrentFocus}
                        />
                        <SimField
                            id='annualBenefitsInput'
                            sref={annualBenefits}
                            isValid={parameterValidity}
                            dispatch={dispatchParameterValidity}
                            setTargetID={setCurrentFocus}
                            disabled
                        />
                        <SimField
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
                            isValid={parameterValidity}
                            dispatch={dispatchParameterValidity}
                            setTargetID={setCurrentFocus}
                        />
                        <SimField
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
                            isValid={parameterValidity}
                            dispatch={dispatchParameterValidity}
                            setTargetID={setCurrentFocus}
                        />
                        <SimField
                            id='roiInput'
                            sref={roi}
                            isValid={parameterValidity}
                            dispatch={dispatchParameterValidity}
                            setTargetID={setCurrentFocus}
                            disabled
                        />
                    </Box>
                </Paper>
                <Box sx={{
                    minWidth: '40%',
                    alignSelf: 'flex-start',
                    // flex: 1,
                    // flexGrow: 0.5,
                    // flexShrink: 2,
                    m: 4,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    position: 'sticky',
                    top: (3 + theme.typography.fontSize)*8
                }}>
                    <Paper variant='solid-primary' sx={{
                        mt : 0,
                        mb : 4,
                        p : '0 24px 0',
                        display : 'flex',
                        justifyContent : 'space-between',
                        alignItems : 'center' }} >
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Switch
                                    id='reinvestDividendsSwitch'
                                    size='small'
                                    color='primary'
                                    onMouseOver={(event) => {
                                        setCurrentFocus(event.target.id);
                                    }}
                                    onChange={(event) => {
                                        reinvestDividends.current = event.target.checked;
                                        // setYearsToRetireUtility();
                                    }}/>
                                }
                                label={fieldInfo.reinvestDividendsSwitch.name}
                                
                            />
                        </FormGroup>
                        <FormGroup>
                        <FormControlLabel
                            control={
                                <IconButton size='small' color='primary' {...disabledProp} onClick={() => setYearsToRetireUtility()} >
                                    <PlayCircleFilledOutlined />
                                </IconButton>
                            }
                            label={t('run')}  
                        />
                        </FormGroup>
                    </Paper>
                    <Typography variant='h4' fontWeight='bold' sx={{ textAlign : 'center'}} >{t('title2')}</Typography>
                    {fortuneGrowth.yearsToRetire !== undefined && <Typography variant='h6' sx={{ textAlign : 'center'}} >
                        {t('r1')}{
                        fortuneGrowth.yearsToRetire === 1 ? t('r2') :
                        (fortuneGrowth.yearsToRetire === 1 ?
                            t('r3') :
                            `${t('r4')}${fortuneGrowth.yearsToRetire}${t('r5')}`)
                    }</Typography>}
                    <Paper
                        variant='solid-primary'
                        sx={{
                            m: 2,
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            height: '20%'
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
                </Box>
            </Box>
        </>
    )
}

export default FastSimPanel;