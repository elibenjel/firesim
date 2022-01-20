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

const fieldInfo = {
    annualIncomeInput: {
        name: 'Annual income',
        info: 'Represents the total amount of money earned each year (does not include the dividends related to the investments made).',
        validateF: (val) => {
            return val && !Number.isNaN(Number(val)) && val >= 0;
        },
        placeholder: 'ex: 30000',
        helperText: 'A valid positive number (the higher the better)',
        startAdornment: '$'
    },

    annualSpendingsInput: {
        name: 'Annual spendings',
        info: 'How much of the annual income do you generally need for living during one year (house, food, hobbies, taxes...). A FI/RE life style implies making that value as small as possible.',
        validateF: (val) => {
            return val && !Number.isNaN(Number(val)) && val >= 0;
        },
        placeholder: 'ex: 15000',
        helperText: 'A valid positive number (the smaller the better)',
        startAdornment: '$'
    },

    annualBenefitsInput: {
        name: 'Annual benefits',
        info: 'How much money do we have after spendings each year. The goal is to invest that money right away.',
        validateF: (val) => {
            return val && !Number.isNaN(Number(val)) && val >= 0;
        },
        helperText: 'The difference between income and spendings (must be more than 0)',
        startAdornment: '$'
    },

    igrInput: {
        name: 'Investment growth rate (IGR)',
        info: 'How much your investments grow in 1 year. For simplicity, the simulation assume the IGR is constant over years,' +
        ' takes the total value of the investments at the start of a year, and applies the IGR at the end of the same year. For example, ' +
        'starting by investing 1000$ on 01/01/2022 with an IGR of 10% means those 1000$ will become (1000 x (1+0.1)) x (1+0.1) = 1210$ on 31/12/2024 (without accounting for dividends).',
        validateF: (val) => {
            return val && !Number.isNaN(Number(val));
        },
        placeholder: 'ex: 8',
        helperText: 'A valid number',
        startAdornment: '%'
    },

    irInput: {
        name: 'Interest rate (IR)',
        info: 'Determines the dividends you get every year from your investments. It is also assumed constant over years, and ' +
        ' received at the end of each year based on the value of the investments at the start of the same year.',
        validateF: (val) => {
            return val && !Number.isNaN(Number(val));
        },
        placeholder: 'ex: 2',
        helperText: 'A valid number',
        startAdornment: '%'
    },

    roiInput: {
        name: 'Return on investment',
        info: 'The global return your investments bring you every year, both in terms of fortune growth and dividends. The IGR, IR ' +
        'and ROI rates are merely simple assumptions. There is no way of knowing their real values in advance. We can base our expectations ' +
        'either by averaging their values over the passed years, or by trying to measure the future potential of the investments made. ' +
        'However, expectations remain uncertain.',
        validateF: (val) => {
            return val && Number(val);
        },
        placeholder: 'ex: 10',
        helperText: 'The sum of IGR and IR',
        startAdornment: '%'
    },

    reinvestDividendsSwitch: {
        name: 'Reinvest dividends',
        info: 'You can choose to keep the dividends each year for your personal use, or make the magic of compound dividends works ' +
        ' by reinvesting them directly at the start of the following year. The second choice is more in phase with FI/RE principles.'
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

const FastSimPanel = () => {
    const theme = useTheme();
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

    const [yearsToRetire, setYearsToRetire] = useState(() => {
        whenCanIFIRE({
            annualIncome: annualIncomeInit,
            annualSpendings: annualSpendingsInit,
            igr: igrInit,
            ir: irInit,
            reinvestDividends : false
        });
    });

    const setYearsToRetireUtility = () => {
        setYearsToRetire(
        whenCanIFIRE({
            annualIncome,
            annualSpendings,
            igr,
            ir,
            reinvestDividends: reinvestDividends.current
        })
    )};

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

    return (
        <>
            <Paper elevation={0} sx = {{ p : 0, m : '16px 0 16px', position : 'sticky', top : 0, zIndex : 100 }} >
                <Paper variant='filled-secondary' sx={{ m : 0, p : 1, height : '120px', overflow: 'auto', borderRadius : 0, textAlign : 'center' }} >
                    { currentFocus ?
                        <>
                            <Typography variant='h6' fontWeight={'bold'} >{fieldInfo[currentFocus]?.name}:</Typography>
                            <Typography variant='body1' >{fieldInfo[currentFocus]?.info}</Typography>
                        </>
                        :
                        <>
                            <Typography variant='h6' fontWeight={'bold'} >Find the year of retirement you can expect if you adopt a FI/RE life style, based on the following parameters.</Typography>
                            <Typography variant='body1' component='em'>(focus a parameter field to get details about it)</Typography>
                        </>
                    }
                </Paper>
            </Paper>
            <Box container sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
            }} >
                <Paper variant='solid-primary' sx={{ maxWidth : '40%'}} >
                    <Typography variant='h4' fontWeight={'bold'}>Parameters</Typography>
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
                <Box sx={{ minWidth: '40%', alignSelf : 'flex-start', flex : 1, m : 4 }}>
                    <Paper variant='solid-primary' sx={{
                        mt : 0,
                        mb : 4,
                        p : '0 16px 0',
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
                                    }}/>
                                }
                                label='Reinvest dividends'
                                
                            />
                        </FormGroup>
                        <FormGroup>
                        <FormControlLabel
                            control={
                                <IconButton size='small' color='primary' {...disabledProp} onClick={() => setYearsToRetireUtility()} >
                                    <PlayCircleFilledOutlined />
                                </IconButton>
                            }
                            label='Run'  
                        />
                        </FormGroup>
                    </Paper>
                    <Typography variant='h4' fontWeight='bold' sx={{ textAlign : 'center'}} >Results</Typography>
                    {yearsToRetire !== undefined && <Typography variant='h6' sx={{ textAlign : 'center'}} >You can retire {
                        yearsToRetire === 0 ? 'immediately !' :
                        (yearsToRetire === 1 ?
                            'next year.' :
                            `in ${yearsToRetire} years.`)
                    }</Typography>}
                </Box>
            </Box>
        </>
    )
}

export default FastSimPanel;