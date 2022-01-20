import React from 'react';
import { useState, useRef, useReducer } from 'react';
import {
    Box,
    Typography,
    Paper,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CustomTextField from '../CustomFormFields/CustomTextField.jsx';
import {
    AccountCircle,
    TrendingUpIcon,
    WhatshotIcon,
    HelpIcon,
    AnalyticsIcon
} from '@mui/icons-material';

const fieldInfo = {
    'annualIncomeInput' : {
        name: 'Annual income',
        info: 'Represents the total amount of money earned each year (does not include the dividends related to the investments made).',
        validateF: (val) => {
            return Number(val) && val >= 0;
        },
        placeholder: 'ex: 30000',
        helperText: 'A valid positive number (the higher the better)'
    },

    'annualSpendingsInput' : {
        name: 'Annual spendings',
        info: 'How much of the annual income is spent for living during the year. A FI/RE life style implies making that value as small as possible.',
        validateF: (val) => {
            return Number(val) && val >= 0;
        },
        placeholder: 'ex: 15000',
        helperText: 'A valid positive number (the smaller the better)'
    },

    'annualBenefitsInput' : {
        name: 'Annual benefits',
        info: 'How much money do we have after spendings each year. The goal is to invest that money right away.',
        validateF: (val) => {
            return Number(val) && val >= 0;
        },
        helperText: 'The difference between income and spendings (must be more than 0)'
    }
}

const MoneyAmountField = (props) => {
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
            startAdornment='$'
            required={false}
            helperText={fieldInfo[id].helperText}
            {...other}
        />
    )
}

const FastSimPanel = () => {
    const theme = useTheme();
    const [currentFocus, setCurrentFocus] = useState(null);
    const [annualIncomeInit, annualSpendingsInit] = [30000, 15000]
    const [annualIncome, setAnnualIncome] = useState(annualIncomeInit);
    const [annualSpendings, setAnnualSpendings] = useState(annualSpendingsInit);
    const annualBenefits = useRef(annualIncomeInit - annualSpendingsInit);

    const [parameterValidity, dispatchParameterValidity] = useReducer((currentState, action) => {
        let newState = {...currentState};
        newState[action.target] = action.value;
        return newState;
    }, Object.keys(fieldInfo).reduce((prev, curr) => {  // returns an object containing entries of type { fieldID : true }
        prev[curr] = true;
        const next = {...prev};
        return next;
    }, {}));

    console.log(currentFocus)
    return (
        <>
            <Paper variant='filled-secondary' sx={{ mr : 0, ml : 0, p : 1, borderRadius : 0, textAlign : 'center' }} >
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
                        <MoneyAmountField
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
                        />
                        <MoneyAmountField
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
                        <MoneyAmountField
                            id='annualBenefitsInput'
                            sref={annualBenefits}
                            isValid={parameterValidity}
                            dispatch={dispatchParameterValidity}
                            setTargetID={setCurrentFocus}
                            disabled
                        />
                        
                    </Box>
                </Paper>
                <Paper variant='side-primary' sx={{ minWidth: '40%', minHeight : '100%', flex : 1 }} >
                    <Typography variant='h4' fontWeight='bold' sx={{ textAlign : 'center'}} >Results</Typography>
                </Paper>
            </Box>
        </>
    )
}

export default FastSimPanel;