import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Paper,
    IconButton,
    TextField,
    Typography,
    Tooltip,
    Checkbox
} from '@mui/material';
import {
    Edit,
    Lock,
    RemoveCircleOutline,
    Undo,
    Add,
    Visibility,
    VisibilityOff
} from '@mui/icons-material';

import ValidatorWrapper from "../InformationDisplay/ValidatorWrapper.jsx";
import * as functions from '../../utils/functions';

const ControlButton = (props) => {
    const { title, onClick, icon, ...other } = props;
    return (
        <Tooltip title={title} >
            <span>
                <IconButton id={`${title}-button`} onClick={onClick} {...other} >
                    {icon}
                </IconButton>
            </span>
        </Tooltip>
    )
}

const Test = () => {
    console.log('test !');
    return <Box />
}

const CheckVisible = (props) => {
    return <Checkbox {...props} icon={<Visibility />} checkedIcon={<VisibilityOff />} />
}

const ControlGroup = (props) => {
    const { tradHook : t, lock, setLockUtility, lockState, setNewLockState, backToLockState, validContent, removeSelf, isChecked, handleChecked } = props;

    const handleModify = () => {
        setLockUtility(false);
    }

    const handleLock = () => {
        setLockUtility(true);
        setNewLockState();
    }

    const handleRemove = removeSelf;
    
    const handleUndo = () => {
        setLockUtility(true);
        backToLockState();
    }


    return (
        <Box sx={{
            display: 'flex',
        }}>
            {lock ?
            <>
                <ControlButton title={t('modify')} onClick={handleModify} icon={<Edit />} />
                <ControlButton title={t('remove')} onClick={handleRemove} icon={<RemoveCircleOutline />} />
                <CheckVisible checked={isChecked()} onChange={handleChecked} />
            </>
            :
            <>
                <ControlButton title={t('lock')} onClick={handleLock} icon={<Lock />} disabled={!validContent} />
                <ControlButton title={t('undo')} onClick={handleUndo} icon={<Undo />} disabled={!lockState} />
                {backToLockState ?
                    null : <ControlButton title={t('remove')} onClick={handleRemove} icon={<RemoveCircleOutline />} />}
            </>
            }
        </Box>
    )
}

const SpendingsLineContent = (props) => {
    const {
        tradHook : t, externalValidityControl,
        setChildrenIsValid, setHide,
        defaultName, defaultAmount, defaultTPY, locked,
        removeSelf, addLine, noPeriodic, isChecked, handleChecked
    } = props;
    const [name, setName] = useState(defaultName || '');
    const [amount, setAmount] = useState(defaultAmount || '');
    const [timesPerYear, setTimesPerYear] = useState(defaultTPY || 1);

    // permanent lines are locked by default, and must have a valid default content
    // a new line does not have a valid content, and is not locked : when locked, it is removed and
    // a permanent line that copies its content is created by addLine function
    const [lock, setLock] = useState(locked || false);
    const [lockState, setLockState] = useState(
        (lock && name && amount && timesPerYear) ?
        { name, amount, timesPerYear }
        : null
    );

    // remember the previous valid state that was locked, to come back to it if the user wants
    const setNewLockState = () => {
        setLockState({ name, amount, timesPerYear });
    }

    const backToLockState = lockState && (() => {
        setName(lockState.name);
        setAmount(lockState.amount);
        setTimesPerYear(lockState.timesPerYear);
    });

    // when locking the line, if it is a new line that is locked for the first time, add it to the permanent lines list
    const setLockUtility = (bool) => {
        setLock(bool);
        addLine && addLine({ defaultName : name, defaultAmount : amount, defaultTPY : timesPerYear }, name);
    }
    
    // manage the valid state of the line content to notify ValidatorWrapper
    const validateName = () => {
        return name.length > 0 && name.length < 100;
    }
    
    const validContent = validateName() && amount;
    
    useEffect(() => {
        setChildrenIsValid(validContent);
        setHide(lock);
    });

    // manage events for each field
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

    const fieldProps = (baseID, value, inputProps = {}, sx = {}) => ({
        id: `${baseID}-input`, label: t(`${baseID}-label`), helperText: t(`${baseID}-help`),
        size: 'small', color: 'secondary', value,
        inputProps: { disabled : lock, ...inputProps },
        sx: { mr : 2, ...sx }
    });
    
    const controlGroupProps = {
        tradHook: t,
        lock, setLockUtility, lockState, setNewLockState, backToLockState,
        validContent, removeSelf, isChecked, handleChecked
    };


    return (
            <Paper elevation={lock ? 0 : 1 } sx={{
                display: 'flex',
                justifyContent: 'flex-start', alignItems: 'center',
                width: '100%',
                p: 1, m: 1,
                backgroundColor: (theme) => lock ? 'rgba(0,0,0,0)' : theme.palette.background.paper,
            }}>
                <TextField {...fieldProps('name', name)} onChange={(event) => setName(event.target.value)} />
                <TextField {...fieldProps('amount', amount, { step : 50, min : 1, type : 'number' })}
                    onChange={handleAmountChange} onBlur={handleAmountBlur} />
                <TextField {...fieldProps('tpy', timesPerYear,
                    { step : 1, min : 1, type : 'number' },
                    { display : noPeriodic ? 'none' : null })}
                    onChange={handleTPYChange} onBlur={handleTPYBlur} />
                <ControlGroup {...controlGroupProps} />
            </Paper>
    )
}

const SpendingsLine = (props) => {
    const { externalValidityControl, ...other } = props;
    return (
        <ValidatorWrapper externalValidityControl={externalValidityControl} iconMargins={{ mt : 3 }} sx={{ width : '100%' }} >
            {(args) => <SpendingsLineContent {...args} {...other} />}
        </ValidatorWrapper>
    )
}

const AddLineButton = (props) => {
    const { title, add, ...other } = props;

    const handleClick = (event) => {
        add();
    }

    return (
        <Paper elevation={1} sx={{
            borderRadius: '50%',
            backgroundImage: (theme) => `
                linear-gradient(45deg, ${theme.palette.background.paper} 2%,
                ${theme.palette.secondary.light} 100%)
            `
        }}>
            <ControlButton title={title} size='large' onClick={handleClick}
                icon={<Add sx={{ fill: (theme) => theme.palette.secondary.dark }} />} {...other} />
        </Paper>
    )
}

const SpendingsBase = (props) => {
    const { tradHook : t, title, initial = [], ...other } = props;
    const tempKey = ':temp:';
    const [keys, setKeys] = useState(() => initial.map(item => item.key));
    const removedKey = useRef(null);
    
    // track check state of each line to sync global checkbox state
    const checkedSummary = useRef(false);
    const [checked, setChecked] = useState(() => initial.reduce((prev, curr) => {
        return { ...prev, [curr.key] : false };
    }, {}));

    const sumUpChecked = (newChecked) => {
        let total = true;
        let start = true;
        for (const curr in newChecked) {
            const bool = newChecked[curr];
            if (!start && (bool !== total)) {
                total = null;
                break;
            }
            total = bool && total;
            start = false;
        }

        checkedSummary.current = total;
    }

    const handleChecked = (key) => (event) => {
        setChecked((current) => {
            let newChecked = { ...current, [key] : event.target.checked };
            if (checkedSummary.current === null) {
                sumUpChecked(newChecked);
            } else {
                checkedSummary.current = null;
            }
            return newChecked
        });
    }

    const handleAllChecked = (event) => {
        let allChecked = {};
        const getNewBool = (bool) => checkedSummary.current === null ? false : !bool;
        let bool;
        for (const key in checked) {
            bool = getNewBool(checked[key]);
            allChecked[key] = bool;
        }
        setChecked(allChecked);
        checkedSummary.current = bool;
    }

    // used each time a permanent line must be added to lines list
    // checked state needs to be passed in the returned jsx expression to get its most recently updated state
    const getPermanentLine = (props, key) => (currentChecked) => {
        return <SpendingsLine tradHook={t} locked 
            {...props} removeSelf={removeLine(key)} isChecked={() => currentChecked[key]} handleChecked={handleChecked(key)}
            {...other} />
    }

    // callback passed down to each line so that it can notify this component that it must be removed
    const removeLine = (key) => () => {
        setKeys((curr) => curr.filter(el => el !== key));
        removedKey.current = key;
        setChecked((curr) => {
            let newState = { ...curr };
            delete newState[key];
            (checkedSummary.current === null) && sumUpChecked(newState);
            return newState;
        });
    }

    // callback only passed to the temporary line that allows to create a new permanent line and add it to the list of lines
    // it also removes the temporary line
    const addLine = (line, key) => {
        const count = keys.filter(el => el.split(':')[0] === key).length;
        line.key = count ? `${key}:${count}` : key;
        setKeys((curr) => [...curr.filter(el => el !== tempKey), line.key]);
        lines.current[line.key] = getPermanentLine(line, line.key);
        setChecked((curr) => ({ ...curr, [line.key] : false }));
        if (checkedSummary.current) {
            checkedSummary.current = null;
        }
    };

    // callback used by AddLineButton to create a temporary line (max. 1)
    const addTemp = () => {
        setKeys((curr) => [...curr, tempKey]);
    }
    
    // the list of lines to display
    // does not contain React elements directly, but functions that return them
    // otherwise, the children lines do not rerender when this parent component (SpendingsBase) is rerendered
    const lines = useRef(initial.reduce((prev, curr) => {
        const { key } = curr;
        return {
            ...prev,
            [key] : getPermanentLine(curr, key)
        };
    }, {}));

    if (removedKey.current) {
        delete lines.current[removedKey.current];
        removedKey.current = null;
    }

    return (
        <Paper variant='side-primary' reversed sx={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'flex-start', alignItems: 'flex-start',
            p: 1, m: 1,
            width: '100%'
        }}>
            <Typography variant='h4' fontWeight={'bold'} >{title}</Typography>
            <Box sx={{display : 'flex', justifyContent : 'flex-end', width : '100%'}} >
                <CheckVisible checked={!!checkedSummary.current}
                    indeterminate={checkedSummary.current === null}
                    onChange={handleAllChecked} />
            </Box>
            {
                keys.map((k) => {
                    return lines.current[k] ? lines.current[k](checked) : <SpendingsLine tradHook={t} key={tempKey} isChecked={() => 'temp'}
                    addLine={addLine} removeSelf={removeLine(tempKey)} {...other} />
                })
            }
            <AddLineButton title={t('add')} add={addTemp} disabled={keys.includes(tempKey)} />
        </Paper>
    )
}

const periodic = [
    {
        key: ':housing:',
        defaultName: null,
        nameF: t => t('housing'),
        defaultAmount: 400,
        defaultTPY: 12
    },
    {
        key: ':food:',
        defaultName: null,
        nameF: t => t('food'),
        defaultAmount: 200,
        defaultTPY: 12
    }
];

const occasional = [
    {
        key: ':total:',
        defaultName: null,
        nameF: t => t('total'),
        defaultAmount: 2000
    }
]

const Spendings = (props) => {
    const { t } = useTranslation('MainSim');
    
    [periodic, occasional].forEach((list) => list.forEach((item) => {
        if (item.nameF) {
            item.defaultName = item.nameF(t);
            delete item.nameF;
        }
    }));

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-around', alignItems: 'center',
            p: 1, m: 1,
            width: '100%'
        }}>
            <SpendingsBase tradHook={t} title={t('periodic-title')} initial={periodic} />
            {/* <SpendingsBase tradHook={t} title={t('occasional-title')} noPeriodic initial={occasional} /> */}
        </Box>
    )
}

export default Spendings;