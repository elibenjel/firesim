import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from '@mui/material/styles';
import {
    Paper,
    Typography,
    InputAdornment,
    Grid,
} from '@mui/material';
import {
    Edit,
    Lock,
    RemoveCircleOutline,
    Undo,
    Add,
    Visibility,
    VisibilityOff,
    VisibilityOutlined
} from '@mui/icons-material';

import ValidatorWrapper from "../../components/Feedback/ValidatorWrapper.jsx";
import ProfileManager from '../../components/MainSim/ProfileManager.jsx';
import ControlButton from "../../components/MainSim/ControlButton.jsx";
import LockableTextField from "../../components/MainSim/LockableTextField.jsx";
import { manageSpendings } from '../../services/simulation.js';
import * as functions from '../../utils/functions';
import { t as tradF } from "i18next";

const t = (arg) => tradF(arg, { ns : 'MainSim' });
const tempKey = -1;
const totalColumns = 12;
const lineColumns = 8;
const controlColumns = 3;
const remainingColumns = totalColumns - lineColumns - controlColumns;
const centeredInCell = { display : 'flex', alignItems : 'center', justifyContent : 'center' };


const CheckVisible = (props) => {
    const { title, checkedTitle, checked, indeterminate, ...other } = props;
    const theme = useTheme();
    
    const controlButtonProps = {};
    if (indeterminate) {
        controlButtonProps.title = checkedTitle;
        controlButtonProps.icon = <Visibility sx={{color : theme.palette.primary.main}} />;
    } else if (checked) {
        controlButtonProps.title = checkedTitle;
        controlButtonProps.icon = <VisibilityOff sx={{color : theme.palette.secondary.dark}} />;
    } else {
        controlButtonProps.title = title;
        controlButtonProps.icon = <VisibilityOutlined sx={{color : theme.palette.secondary.dark}} />;
    }

    return (
        <ControlButton {...controlButtonProps} {...other} />
    )
}

const ControlButtonFiller = (props) => {
    return (
        <ControlButton disabled icon={<Visibility />} hidden />
    )
}

const LinesGlobalController = (props) => {
    const { tradHook : t, deactivateAll, handleDeactivateAll, disableAll } = props;

    return (
        <Grid container columns={controlColumns} {...centeredInCell} textAlign='center' >
            <Grid item xs component={ControlButtonFiller} />
            <Grid item xs component={ControlButtonFiller} />
            <Grid item xs component={CheckVisible}
                title={t('deactivateAll')} checkedTitle={t('activateAll')}
                checked={!!deactivateAll} indeterminate={deactivateAll === null}
                onClick={handleDeactivateAll} disabled={disableAll} />
        </Grid>
    )
}

const LineController = (props) => {
    const { tradHook : t,
        lineIsLocked, setLineIsLocked, lineIsDeactivated, setLineIsDeactivated,
        lineIsTemp, lineIsValid, setUndo, removeLine } = props;

    const handleModify = () => {
        setLineIsLocked(false);
    }

    const handleLock = () => {
        setLineIsLocked(true);
        // setNewLockState();
    }

    const handleRemove = removeLine;
    
    const handleUndo = () => {
        setLineIsLocked(true);
        setUndo(true);
    }

    const handleDeactivate = setLineIsDeactivated;

    return (
        <Grid container columns={controlColumns} {...centeredInCell} textAlign='center' >
            {lineIsLocked ?
            <>
                <Grid item xs component={ControlButton} title={t('modify')}
                    onClick={handleModify} icon={<Edit />} />
                <Grid item xs component={ControlButton} title={t('remove')}
                    onClick={handleRemove} icon={<RemoveCircleOutline />} />
                <Grid item xs component={CheckVisible}
                    title={t('deactivate')} checkedTitle={t('activate')}
                    checked={lineIsDeactivated} onClick={handleDeactivate} />
            </>
            :
            <>
                <Grid item xs component={ControlButton} title={t('lock')}
                    onClick={handleLock} icon={<Lock />} disabled={!lineIsValid} />
                {lineIsTemp ?
                <Grid item xs component={ControlButton} title={t('remove')}
                    onClick={handleRemove} icon={<RemoveCircleOutline />} />
                : <Grid item xs component={ControlButton} title={t('undo')}
                    onClick={handleUndo} icon={<Undo />} />}
                <Grid item xs component={ControlButtonFiller} />
            </>}
        </Grid>
    )
}

const LabelsLine = (props) => {
    const { fields } = props;
    const itemProps = (label, index) => ({
        variant: 'h8', fontWeight: 'bold', pl: 1,
        borderLeft: index ? 'solid thin' : 'none',
        key: label, children: label
    })
    return (
        <Grid container component={Paper} p={1} borderRadius={0} border='solid thin' elevation={4} sx={{
            backgroundColor: (theme) => theme.palette.secondary.light,
        }}>
            {
                fields.map((label, index) => (
                    <Grid item xs component={Typography} {...itemProps(label, index)} />
                ))
            }
        </Grid>
    )
}

const ResultLine = (props) => {
    const { tradHook : t, total } = props;

    const formatLabel = (content) => `${content}:`;
    const formatValue = (value) => `${Math.floor(value)} ${t('currency')}`;
    const cells = [
        { content : t('monthly-spendings'), xs : 'auto', isLabel : true, key : 1 },
        { content : Number(total / 12), xs : 'auto', isLabel : false, key : 2 },
        { content : t('annual-spendings'), xs : 'auto', isLabel : true, key : 3 },
        { content : Number(total), xs : 'auto', isLabel : false, key : 4 }
    ];

    const typoProps = (isLabel) => ({
        variant: isLabel ? 'h8' : 'body1',
        fontWeight: 'bold',
        sx: { color : (theme) => theme.palette.primary.dark }
    })

    return (
        <Grid container columnSpacing={2} p={1} >
                <Grid item xs />
            {
                cells.map((item) => (
                    <Grid item {...centeredInCell} xs={item.xs} key={item.key}
                        component={Typography} {...typoProps(item.isLabel)}
                        children={item.isLabel ? formatLabel(item.content) : formatValue(item.content)} />
                ))
            }
        </Grid>
    )
}

const SpendingsLine = (props) => {
    const {
        tradHook : t, myIndex,
        setChildrenIsValid, setHide,
        defaultName, defaultAmount, defaultTPY,
        myKey, locked, deactivated, outdated, notifyChange,
        addLine, setMyTotal, noPeriodic,
    } = props;

    const [name, setName] = useState(defaultName || '');
    const [amount, setAmount] = useState(defaultAmount || '');
    const [timesPerYear, setTimesPerYear] = useState(defaultTPY || 1);
    const [lockState, setLockState] = useState(() => (
        locked ? {
        name: defaultName,
        amount: defaultAmount,
        timesPerYear: defaultTPY
    } : null));

    const firstMount = useRef(true);
    const total = useRef(null);

    // keep the total up to date and relay its value to parent, or 0 if the line is deactivated
    total.current = Number(amount*timesPerYear);

    useEffect(() => {
        if (myKey !== tempKey && locked) {
            setMyTotal(deactivated ? 0 : total.current);
        }
    }, [total.current, deactivated, locked]);

    // manage the valid state of the line content to notify ValidatorWrapper
    const validateName = () => {
        return name.length > 0 && name.length < 100;
    }
    
    const amIValid = validateName() && functions.isNumber(amount) && amount >= 0;
    
    useEffect(() => {
        setChildrenIsValid(amIValid);
        setHide(locked);
    });

    // react to state received from parents if locked has changed from false to true :
    // if the key is the tempKey, remember new lockState, add a new line that copies this one, and remove this one
    // else, either come back to previous valid state, or set the new lockState
    useEffect(() => {
        if (firstMount.current || !locked) {
            firstMount.current = false;
            return;
        }

        if (myKey === tempKey) {
            setLockState({ name, amount, timesPerYear });
            addLine({
                defaultName : name, currentName : name,
                defaultAmount : amount, currentAmount : amount,
                defaultTPY : timesPerYear, currentTPY : timesPerYear
            });
        } else if (outdated || !amIValid) {
            setName(lockState.name);
            setAmount(lockState.amount);
            setTimesPerYear(lockState.timesPerYear);
            notifyChange({ outdated : false });
        } else {
            setLockState({ name, amount, timesPerYear });
            notifyChange({ currentName : name, currentAmount : amount, currentTPY : timesPerYear });
        }
    }, [locked]);

    // manage events for each field
    const handleNameChange = (event) => {
        const forbidden = [/:/, /\|/];
        const content = event.target.value;
        setName((prev) => {
            let allow = true;
            forbidden.forEach(substr => {
                if(content.match(substr)) {
                    allow = false;
                }
            })
            return allow ? content : prev;
        });
    }

    const handleNameBlur = (event) => {
        return;
    }

    const handleAmountChange = (event) => {
        setAmount(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleAmountBlur = (event) => {
        if (event.target.value !== '' && amount < 1) {
            setAmount(1);
        }
    };

    const handleTPYChange = (event) => {
        setTimesPerYear(event.target.value === '' ? '' : Number(event.target.value));
    };

    const handleTPYBlur = () => {
        if (timesPerYear < 1) {
            setTimesPerYear(1);
        }
    };

    const itemProps = { locked, sx : { ml : 1, mr : 1 } }

    return (
        <Grid container component={Paper} p={1} elevation={locked ? 0 : 1 } sx={{
            backgroundColor: (theme) => locked ? (myIndex % 2 ? 'rgb(230,230,230)' : 'rgba(0,0,0,0)') : theme.palette.background.paper,
            opacity: (locked && deactivated) ? '20%' : '100%'
        }}>
            <Grid item xs component={LockableTextField} {...itemProps}
                baseID='name' value={name} label={t('name-label')}
                InputProps={{ endAdornment: <InputAdornment position='end'>:</InputAdornment> }}
                onChange={handleNameChange} onBlur={handleNameBlur} />
            <Grid item xs component={LockableTextField} {...itemProps}
                baseID='amount' value={amount} label={t('amount-label')} step={50} min={0}
                InputProps={{ startAdornment: <InputAdornment position='start'>{t('currency')}</InputAdornment> }}
                onChange={handleAmountChange} onBlur={handleAmountBlur} />
            <Grid item xs component={LockableTextField} {...itemProps}
                baseID='tpy' value={timesPerYear} label={t('tpy-label')} step={1} min={1}
                InputProps={{ startAdornment : <InputAdornment position='start'>x</InputAdornment> }}
                onChange={handleTPYChange} onBlur={handleTPYBlur} />
            <Grid item xs component={LockableTextField} {...itemProps}
                baseID='total' value={total.current} label={t('total-label')} disabled
                InputProps={{
                    startAdornment: <InputAdornment position='start'>=</InputAdornment>,
                    disableUnderline: true
                }} />
        </Grid>
    )
}

const AddLineButton = (props) => {
    const { title, add, ...other } = props;

    const handleClick = (event) => {
        add();
    }

    const sx = {
        fill: (theme) => theme.palette.secondary.dark,
        border: 'solid',
        borderRadius:'50%',
        borderColor: (theme) => theme.palette.secondary.dark
    }

    const sxDisabled = {};

    return (
        <ControlButton title={title} onClick={handleClick}
            icon={<Add fontSize='large' sx={other.disabled ? sxDisabled : sx} />} {...other} />
    )
}

const SpendingsProfile = (props) => {
    const { tradHook : t, initial, trackProfileData, setIsProfileLocked } = props;
    
    // the line states that cause visual modifications
    const [linesStates, setLinesStates] = useState(() => initial.spendings.map(item => (
        {
            locked: true,
            deactivated: false,
            total: 0,
        }
    )));

    // notify the parent about any unlocked line
    let doIHaveUnlockedLines = false;
    for (const line of linesStates) {
        if (!line.locked) {
            doIHaveUnlockedLines = true;
            break;
        }
    }

    useEffect(() => setIsProfileLocked(!doIHaveUnlockedLines), [doIHaveUnlockedLines]);

    // keep track of the number of created lines, and use it for the prop key of each new line
    const createdLines = useRef(initial.length);

    const totalSpendings = useRef(0);

    // the remaining line state variables do not cause visual modifications
    const linesRefs = useRef(initial.spendings?.map((item, index) => (
        {
            myKey: index,
            defaultName: item.label,
            currentName: item.label,
            defaultAmount: item.amount,
            currentAmount: item.amount,
            defaultTPY: item.frequency,
            currentTPY: item.frequency,
            outdated: false,
        }
    )));
    
    const deactivateAll = useRef(false);
    if (!linesStates.length) {
        deactivateAll.current = false;
    }

    // help to determine if global checkbox state is indeterminate, true or false
    const sumUpDeactivated = (newState) => {
        let total = true;
        let start = true;
        for (const curr of newState) {
            const bool = curr.deactivated;
            if (!start && (bool !== total)) {
                total = null;
                break;
            }
            total = bool && total;
            start = false;
        }

        deactivateAll.current = total;
    }

    const setDeactivated = (index) => (event) => {
        setLinesStates((current) => {
            const newState = current.map((item, i) => (
                i !== index ?
                item
                :
                { ...item, deactivated : !item.deactivated }
            ));

            if (deactivateAll.current === null) {
                sumUpDeactivated(newState);
            } else {
                deactivateAll.current = null;
            }
            return newState
        });
    }

    const handleDeactivateAll = (event) => {
        deactivateAll.current = deactivateAll.current === null ? false : !deactivateAll.current;
        setLinesStates((current) => current.map(item => (
            { ...item, deactivated : deactivateAll.current }
        )));
    }
    
    // Control button handlers
    const setLocked = (index) => (lock) => {
        setLinesStates((current) => current.map(
            (item, i) => i !== index ? item : { ...item, locked : lock }
        ));
    }

    const setUndo = (index) => (lock) => {
        setLinesStates((current) => current.map(
            (item, i) => i !== index ? item : { ...item, locked : lock, outdated : true }
        ));
        linesRefs.current[index].outdated = true;
    }

    const removeLine = (index) => () => {
        setLinesStates((current) => {
            const newState = current.filter((_, i) => i !== index);
            (deactivateAll.current === null) && sumUpDeactivated(newState);
            return newState;
        });
        
        linesRefs.current = linesRefs.current.filter((_, i) => i !== index);
    }

    // can be called by AddLineButton to add a temporary line, or by a temporary line that is locked with a valid state
    // to add a permanent line
    const addLine = (line) => {
        if (line) {
            linesRefs.current.pop();
            linesRefs.current = [...linesRefs.current, { myKey : createdLines.current, ...line, outdated : false }];
            createdLines.current += 1;
            setLinesStates((current) => [ ...current.slice(0, -1), {
                locked: true,
                deactivated: false,
                total: 0
            }]);
        } else {
            linesRefs.current = [...linesRefs.current, { myKey : tempKey, outdated : false }]
            setLinesStates((current) => [ ...current, {
                locked: false,
                deactivated: false,
                total: 0
            }]);
        }

        if (deactivateAll.current) {
            deactivateAll.current = null;
        }
    }

    // let each line set their total by themselves, and compute the total of all lines
    const setTotal = (index) => (value) => {
        setLinesStates((current) => current.map(
            (item, i) => i !== index ? item : { ...item, total : value }
        ));
    }

    totalSpendings.current = linesStates.reduce((prev, curr) =>  prev + curr.total, 0);

    // Relay to parent the desired info about this spending profile
    trackProfileData(linesRefs.current.reduce((prev, curr) => {
            const { currentName, currentAmount, currentTPY } = curr;
            return curr.myKey !== tempKey ? [...prev, { currentName, currentAmount, currentTPY }] : prev;
        }, []),
        totalSpendings.current
    );

    const controlGroupProps = (index) => {
        const myProps = { ...linesStates[index], ...linesRefs.current[index] };
        return {
            tradHook: t,
            lineIsLocked: myProps.locked, lineIsDeactivated: myProps.deactivated, lineIsTemp: myProps.myKey === tempKey,
            setLineIsLocked: setLocked(index), setLineIsDeactivated: setDeactivated(index), setUndo: setUndo(index),
            removeLine: removeLine(index)
        }
    };

    const topControlGroupProps = {
        tradHook: t,
        deactivateAll: deactivateAll.current, handleDeactivateAll,
        disableAll: !linesStates.length || linesRefs.current[0].myKey === tempKey
    }

    const resultLineProps = {
        tradHook: t,
        total: totalSpendings.current
    }

    return (
        <Grid container direction='row' spacing={2}
            component={Paper} variant='side-primary' reversed
            m={2} p={0} pr={19} >
            <Grid item xs={remainingColumns} />
            <Grid item xs={lineColumns} children={<LabelsLine fields={[
                    t('name-label'),
                    t('amount-label'),
                    t('tpy-label'),
                    t('total-label')
                ]} />}
            />
            <Grid item xs={controlColumns} children={<LinesGlobalController {...topControlGroupProps} />} />
            {
                linesStates.map(
                    (line, index) => {
                        const lineProps = {
                            ...line, ...linesRefs.current[index],
                            myIndex: index,
                            notifyChange: (change) => {
                                linesRefs.current[index] = { ...linesRefs.current[index], ...change };
                            },
                            setMyTotal: setTotal(index),
                        };
                        return (
                            <Grid key={linesRefs.current[index].myKey} container
                                spacing={2} item xs={totalColumns} component={ValidatorWrapper} exposeIndicator >
                                {
                                    (args) => {
                                        const { getChildrenIsValid, getIndicator, ...indicatorControl } = args;
                                        return (
                                            <>
                                                <Grid item xs={remainingColumns} {...centeredInCell}
                                                    children={getIndicator()} />
                                                <Grid item xs={lineColumns} {...centeredInCell} textAlign='center'
                                                    children={
                                                    <SpendingsLine addLine={addLine} tradHook={t} {...lineProps}
                                                        {...indicatorControl} />
                                                }/>
                                                <Grid item xs={controlColumns} {...centeredInCell} children={
                                                    <LineController lineIsValid={getChildrenIsValid()}
                                                        {...controlGroupProps(index)} />
                                                }/>
                                            </>
                                        )
                                    }
                                }
                            </Grid>
                        )
                    }
                )
            }
            <Grid item xs={remainingColumns} />
            <Grid item xs={lineColumns} sx={{ textAlign : 'center' }} children={
                <AddLineButton title={t('add')} add={addLine} disabled={linesRefs.current.at(-1)?.myKey === tempKey} />
            }/>
            <Grid item xs={controlColumns} />
            <Grid item xs={remainingColumns} />
            <Grid item xs={lineColumns} sx={{ textAlign : 'center' }} children={<ResultLine {...resultLineProps} />} />
            <Grid item xs={controlColumns} />
        </Grid>
    )
}

const initialProfileData = {
    spendings: [
        {
            label: t('housing'),
            amount: 400,
            frequency: 12
        },
        {
            label: t('food'),
            amount: 200,
            frequency: 12
        }
    ],
    total: 12*400 + 12*200
};

const Spendings = (props) => {

    // used to track the modifications made to the profile
    // each time SpendingsProfile does render, it updates correctly this ref using the tracking function
    const profileData = useRef({});
    const trackProfileData = (spendingsValue, totalValue) => {
        profileData.current = { spendingsValue, totalValue };
    }

    const profileManagerProps = {
        tradHook: t,
        initialProfileData,
        profileData,
        managerFunctions: manageSpendings
    }

    return (
        <ProfileManager {...profileManagerProps} >
            {
                ({ key, props }) => <SpendingsProfile key={key} {...props} trackProfileData={trackProfileData} />
            }
        </ProfileManager>
    )
}

export default Spendings;