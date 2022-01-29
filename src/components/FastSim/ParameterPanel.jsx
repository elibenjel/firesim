import React from 'react';
import {
    Box,
    Typography,
    Paper,
} from '@mui/material';

import ParameterField from './ParameterField.jsx';
import { fieldInfo } from "./utils.js";


const ParameterPanel = (props) => {
    const { tradHook: t,
        annualIncome, setAnnualIncome, annualSpendings, setAnnualSpendings, annualBenefits,
        igr, setIgr, ir, setIr, roi,
        parameterValidity, dispatchParameterValidity,
        rerunOnEnter
    } = props;

    const onKeyUp = (event) => rerunOnEnter(event);
    const getFieldProps = (id) => {
        const { nameF, placeholder = '', helperTextF, validateF, startAdornmentF, infoF } = fieldInfo[id];
        const label = nameF(t), helperText = helperTextF(t), startAdornment = startAdornmentF(t), helpBubble = infoF(t);
        return {
            tradHook: t,
            id, label, placeholder, helperText,
            startAdornment, helpBubble,
            validateF, onKeyUp,
            sx : { width : '95%' }
        };
    }

    const updateBenefits = (val, newBenef, setState) => {
        annualBenefits.current = newBenef;
        dispatchParameterValidity({
            target : 'annualBenefitsInput',
            value : fieldInfo.annualBenefitsInput.validateF(annualBenefits.current)
        });
        setState(val);
    }

    const updateRoi = (val, newRoi, setState) => {
        roi.current = newRoi;
        dispatchParameterValidity({
            target : 'roiInput',
            value : fieldInfo.roiInput.validateF(roi.current)
        });
        setState(val);
    }

    return (
        <Paper variant='side-primary' reversed sx={{ maxWidth : '40%'}} >
            <Typography variant='h4' fontWeight={'bold'}>{t('title1')}</Typography>
            <Box container sx={{
                display: 'flex',
                flexDirection: 'column'
            }} >
                <ParameterField value={annualIncome} {...getFieldProps('annualIncomeInput')}
                    setState={val => updateBenefits(val, val-annualSpendings, setAnnualIncome)} />
                <ParameterField value={annualSpendings} {...getFieldProps('annualSpendingsInput')}
                    setState={val => updateBenefits(val, annualIncome-val, setAnnualSpendings)} />
                <ParameterField value={annualBenefits.current} externalValidityControl={parameterValidity.annualBenefitsInput}
                    {...getFieldProps('annualBenefitsInput')} readOnly />
                <ParameterField value={igr} {...getFieldProps('igrInput')}
                    setState={val => updateRoi(val, val - - ir, setIgr)} />
                <ParameterField value={ir} {...getFieldProps('irInput')}
                    setState={val => updateRoi(val, igr - - val, setIr)} />
                <ParameterField value={roi.current} externalValidityControl={parameterValidity.roiInput}
                    {...getFieldProps('roiInput')} readOnly />
            </Box>
        </Paper>
    );
}

export default ParameterPanel;