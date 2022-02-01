import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
    Box,
    Paper,
    IconButton,
    TextField,
    Typography,
    Tooltip
} from '@mui/material';
import {
    Edit,
    Lock,
    RemoveCircleOutline,
    Undo,
    AddCircleOutline
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

const ControlGroup = (props) => {
    const { tradHook : t, lock, setLock, lockState, setNewLockState, backToLockState, validContent, removeSelf } = props;

    const handleModify = () => {
        setLock(false);
    }

    const handleLock = () => {
        setLock(true);
        setNewLockState();
    }

    const handleRemove = removeSelf;
    
    const handleUndo = () => {
        setLock(true);
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
            </>
            :
            <>
                <ControlButton title={t('lock')} onClick={handleLock} icon={<Lock />} disabled={!validContent} />
                <ControlButton title={t('undo')} onClick={handleUndo} icon={<Undo />} disabled={!lockState} />
            </>
            }
        </Box>
    )
}

const SpendingsLineContent = (props) => {
    const {
        tradHook : t, externalValidityControl,
        setChildrenIsValid, setHide,
        removeSelf, defaultName, defaultAmount, defaultTPY, locked,
        addLine, noPeriodic, ...other
    } = props;
    const [name, setName] = useState(defaultName || '');
    const [amount, setAmount] = useState(defaultAmount || '');
    const [timesPerYear, setTimesPerYear] = useState(defaultTPY || 1);
    const [lock, setLock] = useState(locked || false);
    const [lockState, setLockState] = useState(
        (lock && name && amount && timesPerYear) ?
        { name, amount, timesPerYear }
        : null
    );

    const setNewLockState = () => {
        setLockState({ name, amount, timesPerYear });
    }

    const backToLockState = () => {
        setName(lockState.name);
        setAmount(lockState.amount);
        setTimesPerYear(lockState.timesPerYear);
    }

    const setLockUtility = (bool) => {
        setLock(bool);
        addLine && addLine({ defaultName : name, defaultAmount : amount, defaultTPY : timesPerYear }, name);
    }
    
    const validateName = () => {
        return name.length > 0 && name.length < 100;
    }
    
    const validContent = validateName() && amount;
    useEffect(() => {
        setChildrenIsValid(validContent);
        setHide(lock);
    });

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

    const controlGroupProps = { tradHook : t, lock, setLock, lockState, setNewLockState, backToLockState, validContent, removeSelf };
    return (
            <Paper elevation={lock ? 0 : 1 } sx={{
                display: 'flex',
                justifyContent: 'flex-start', alignItems: 'center',
                width: '100%',
                p: 1, m: 1,
                backgroundColor: (theme) => lock ? 'rgba(0,0,0,0)' : theme.palette.background.paper,
            }}>
                <TextField id='nameInput' size='small' color='secondary' value={name} label={t('spendings-label')}
                    onChange={(event) => setName(event.target.value)} helperText={t('spendings-help')}
                    sx={{ mr : 2 }} readOnly={lock} />
                <TextField id='amountInput' size='small' color='secondary' value={amount} label={t('amount-label')}
                    onChange={handleAmountChange} onBlur={handleAmountBlur} helperText={t('amount-help')}
                    inputProps={{ min : 1, type : 'number'}}
                    sx={{ mr : 2 }} readOnly={lock} />
                <TextField id='tpyInput' size='small' color='secondary' value={timesPerYear} label={t('tpy-label')}
                    onChange={handleTPYChange} onBlur={handleTPYBlur} helperText={t('tpy-help')}
                    inputProps={{ step : 1, min : 1, type : 'number' }}
                    sx={{ mr : 2, display : noPeriodic ? 'none' : null }} readOnly={lock} />
                <ControlGroup {...controlGroupProps} />
            </Paper>
    )
}

const SpendingsLine = (props) => {
    const { externalValidityControl, ...other } = props;
    return (
        <ValidatorWrapper externalValidityControl={externalValidityControl} iconMargins={{ mt : 3 }} sx={{ width : '100%' }} >
            {(args) => <SpendingsLineContent {...args} setName {...other} />}
        </ValidatorWrapper>
    )
}

const AddLineButton = (props) => {
    const { title, add } = props;

    const handleClick = (event) => {
        add();
    }

    return (
        <ControlButton title={title} onClick={handleClick} icon={<AddCircleOutline />} />
    )
}

const SpendingsBase = (props) => {
    const { tradHook : t, title, initial, ...other } = props;
    const [keys, setKeys] = useState(initial.map(item => item.key));
    const removedKey = useRef(null);
        
    const removeLine = (key) => () => {
        setKeys((curr) => curr.filter(el => el !== key));
        removedKey.current = key;
    }

    const addLine = (line, key) => {
        setKeys((curr) => [...curr.filter(el => el !== ':temp:'), key]);
        lines.current[key] = (
            <SpendingsLine tradHook={t} locked
                {...line} removeSelf={removeLine(key)} {...other} />
        );
    };

    const addTemp = () => {
        setKeys((curr) => [...curr, ':temp:']);
    }
        
    const lines = useRef(initial.reduce((prev, curr) => {
        const { key } = curr;
        return {
            [key] : <SpendingsLine tradHook={t} locked
                        {...curr} removeSelf={removeLine(key)} {...other} />,
            ...prev
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
            {
                keys.map((k) => {
                    return lines.current[k] || <SpendingsLine tradHook={t} key=':temp:' addLine={addLine} />
                })
            }
            <AddLineButton title={t('add')} add={addTemp} />
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
        item.defaultName = item.nameF(t);
        delete item.nameF;
    }));

    return (
        <Box sx={{
            display: 'flex', flexDirection: 'column',
            justifyContent: 'space-around', alignItems: 'center',
            p: 1, m: 1,
            width: '100%'
        }}>
            <SpendingsBase tradHook={t} title={t('periodic-title')} initial={periodic} />
            <SpendingsBase tradHook={t} title={t('occasional-title')} noPeriodic initial={occasional} />
        </Box>
    )
}

export default Spendings;