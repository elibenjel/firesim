import React, { useState, useRef, useReducer } from 'react';
import { useTranslation } from 'react-i18next';
import { Box } from '@mui/material';

import InfoBanner from '../components/FastSim/InfoBanner.jsx';
import ParameterPanel from '../components/FastSim/ParameterPanel.jsx';
import ControlBar from '../components/FastSim/ControlBar.jsx';
import ResultPanel from '../components/FastSim/ResultPanel.jsx';
import { fieldInfo, whenCanIFIRE } from "../components/FastSim/utils.js";

const FastSim = () => {
    const { t } = useTranslation('FastSim');
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

    // main state variable of the simulation : rerun the sim when it is updated
    const [fortuneGrowth, setFortuneGrowth] = useState(null);

    const setFortuneGrowthUtility = () => {
        if (disabled) return;
        const fortuneGrowth = whenCanIFIRE({
            annualIncome,
            annualSpendings,
            igr,
            ir,
            reinvestDividends: reinvestDividends.current
        });
        setFortuneGrowth(fortuneGrowth);
    };

    // the data that must be shown
    const chartSeries = [{
        data : fortuneGrowth?.endFortunes
    }]

    const rerunOnEnter = (event) => {
        if (event.key === 'Enter') {
            simulationFirstRun.current = false;
            setFortuneGrowthUtility()
        }
    }

    const parameterPanelProps = {
        tradHook,
        annualIncome, setAnnualIncome,
        annualSpendings, setAnnualSpendings,
        annualBenefits,
        igr, setIgr,
        ir, setIr,
        roi,
        parameterValidity, dispatchParameterValidity,
        rerunOnEnter
    }

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column'
        }}>
            <InfoBanner tradHook={t} />
            <Box container sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around'
            }}>
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
                </Box>
            </Box>
        </Box>
    )
}

export default FastSim;