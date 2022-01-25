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

    const commonProps = {
        tradHook: t,
        validity: parameterValidity, dispatch: dispatchParameterValidity,
        callbacks: {
            handleKeyUp: (event) => rerunOnEnter(event)
        }
    }

    return (
        <Paper variant='side-primary' reversed sx={{ maxWidth : '40%'}} >
            <Typography variant='h4' fontWeight={'bold'}>{t('title1')}</Typography>
            <Box container sx={{
                display: 'flex',
                flexDirection: 'column'
            }} >
                <ParameterField id={'annualIncomeInput'}
                    state={annualIncome} setState={val => updateBenefits(val, val-annualSpendings, setAnnualIncome)}
                    {...commonProps}
                />
                <ParameterField id='annualSpendingsInput'
                    state={annualSpendings} setState={val => updateBenefits(val, annualIncome-val, setAnnualSpendings)}
                    {...commonProps}
                />
                <ParameterField readOnly id='annualBenefitsInput' sref={annualBenefits} {...commonProps} />
                <ParameterField id='igrInput' state={igr} setState={val => updateRoi(val, val - - ir, setIgr)}
                    {...commonProps}
                />
                <ParameterField id='irInput' state={ir} setState={val => updateRoi(val, igr - - val, setIr)}
                    {...commonProps}
                />
                <ParameterField readOnly id='roiInput' sref={roi} {...commonProps} />
            </Box>
        </Paper>
    );
}

export default ParameterPanel;