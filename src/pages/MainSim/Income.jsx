import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { t as trad } from 'i18next';
import { Box, Grid, Typography, InputAdornment, Paper } from '@mui/material';
import { Add, Lock, Remove } from '@mui/icons-material';


import ProfileManager from '../../components/MainSim/ProfileManager.jsx';
import LockableTextField from '../../components/MainSim/LockableTextField.jsx';
import ControlButton from '../../components/MainSim/ControlButton.jsx';
import { manageIncome } from '../../services/simulation';
import { useEffect } from 'react';

const t = (arg) => trad(arg, { ns : 'MainSim' });
const tc = 13;
const llc = 1;
const rrc = 4;
const lcc = 3;
const rcc = tc - llc - lcc - rrc;
const sp = 1;
const centeredInCell = { display : 'flex', alignItems : 'center', justifyContent : 'center' };
const maxAmount = 10**7;

const MyGrid = (props) => {
    let additional = {};
    if (props.container) {
        additional = { spacing : sp, component : Paper }
    }
    if (props.item) {
        additional = { ...centeredInCell };
    }
    return (
        <Grid {...additional} {...props} />
    );
}

const Typo = ({ children }) => {
    return <Typography variant='h10' ml={2} mr={2} >{children}</Typography>
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
        <ControlButton title={title} size='large' onClick={handleClick}
            icon={<Add sx={other.disabled ? sxDisabled : sx} />} {...other} />
    )
}

const RemoveLineButton = (props) => {
    const { title, remove, ...other } = props;

    const handleClick = (event) => {
        remove();
    }

    const sx = {
        fill: (theme) => theme.palette.secondary.dark,
        border: 'solid',
        borderRadius:'50%',
        borderColor: (theme) => theme.palette.secondary.dark
    }

    const sxDisabled = {};

    return (
        <ControlButton title={title} size='large' onClick={handleClick}
            icon={<Remove sx={other.disabled ? sxDisabled : sx} />} {...other} />
    )
}

const LabelsLine = (props) => {
    const { incomeFrequency, setIncomeFrequency, increaseFrequency, setIncreaseFrequency } = props;

    const handleIncomeFrequencyChange = (event) => setIncomeFrequency(event.target.value);
    const handleIncreaseFrequencyChange = (event) => setIncreaseFrequency(event.target.value);

    const incomeSelect = [
        { value : 0, label : t('annual-m') },
        { value : 1, label : t('monthly-m') }
    ];
    const increaseSelect = [
        { value : 0, label : t('annual-f') },
        { value : 1, label : t('monthly-f') }
    ];

    return (
        <MyGrid container p={1} borderRadius={0} border='solid thin' elevation={4} sx={{
            backgroundColor: (theme) => theme.palette.secondary.light,
        }}>
            <MyGrid item xs={lcc*tc / (lcc+rcc)} >
                <Typo>{t('income')}</Typo>
                <LockableTextField variant='standard' baseID='income-frequency' value={incomeFrequency}
                    select={incomeSelect} onChange={handleIncomeFrequencyChange} />
            </MyGrid>
            <MyGrid item xs borderLeft='solid thin' >
                <Typo>{t('increase')}</Typo>
                <LockableTextField variant='standard' baseID='increase-frequency' value={increaseFrequency}
                    select={increaseSelect} onChange={handleIncreaseFrequencyChange} />
                <Typo>{t('average-f')}</Typo>
            </MyGrid>
        </MyGrid>
    )
}

const IncomeLine = (props) => {
    const {
        income=0, increase=0, period=-1,
        setIncome, setIncrease, setPeriod, setLocked,
        focusedFields, myIndex
    } = props;

    const handleFocus = () => {
        focusedFields.current += 1;
        setLocked(focusedFields.current === 0);
    }

    const handleBlur = () => {
        focusedFields.current -= 1;
        setLocked(focusedFields.current === 0);
    }

    const handleIncomeChange = (event) => {
        setIncome(event.target.value === '' ? '' : Number(event.target.value));
    }

    const handleIncomeBlur = (event) => {
        handleBlur();
        if (event.target.value === '' || income < 0) {
            setIncome(0);
        } else if (income > maxAmount) {
            setIncome(maxAmount);
        }
    };

    const handleIncreaseChange = (event) => {
        setIncrease(event.target.value === '' ? '' : Number(event.target.value));
    }

    const handleIncreaseBlur = (event) => {
        handleBlur();
        if (event.target.value === '' || increase < 0) {
            setIncrease(0);
        } else if (increase > maxAmount) {
            setIncrease(maxAmount);
        }
    };

    const handlePeriodChange = (event) => {
        setPeriod(event.target.value === '' ? '' : Number(event.target.value));
    }

    const handlePeriodBlur = (event) => {
        handleBlur();
        if (event.target.value === '' || period < 1) {
            setPeriod(1);
        } else if (period > 99) {
            setPeriod(99);
        }
    };

    return (
        <MyGrid container p={1} elevation={0} sx={{
            backgroundColor: myIndex % 2 ? 'rgb(230,230,230)' : 'rgba(0,0,0,0)',
        }} >
            <MyGrid item xs={llc} >
                {myIndex ? <Typo>{t('income-line-1')}</Typo> : null}
            </MyGrid>
            <MyGrid item xs={lcc} >
                <LockableTextField baseID='income' value={income} step={100} min={0} max={maxAmount}
                    InputProps={{ startAdornment : <InputAdornment position='start'>{t('currency')}</InputAdornment> }}
                    onChange={handleIncomeChange} onFocus={handleFocus} onBlur={handleIncomeBlur} />
            </MyGrid>
            {/* <Typo>{t('income-line-2')}</Typo> */}
            <MyGrid item xs={rcc} borderLeft='solid thin' >
                <LockableTextField baseID='increase' value={increase} step={100} min={0} max={maxAmount}
                    InputProps={{ startAdornment : <InputAdornment position='start'>{t('currency')}</InputAdornment> }}
                    onChange={handleIncreaseChange} onFocus={handleFocus} onBlur={handleIncreaseBlur} />
            </MyGrid>
            {
                <MyGrid item xs={rrc} >
                {
                    period === -1 ?
                    <Typo>{t('income-line-end')}</Typo>    
                    :
                    <>
                        <Typo>{t('income-line-2')}</Typo>
                        <LockableTextField baseID='period' value={period} step={1} min={1} size={2}
                            onChange={handlePeriodChange} onFocus={handleFocus} onBlur={handlePeriodBlur} />
                        <Typo>{t('income-line-3') + (period === 0 ? '' : 's')}</Typo>
                    </>
                }
                </MyGrid>
            }
        </MyGrid>
    );
}

const IncomeProfile = (props) => {
    const {
        tradHook : t,
        initial = { income : [], incomeFrequency : 0, increaseFrequency : 0 },
        trackProfileData, setIsProfileLocked } = props;
    const [incomeFrequency, setIncomeFrequency] = useState(initial.incomeFrequency);
    const [increaseFrequency, setIncreaseFrequency] = useState(initial.increaseFrequency);
    const [profileState, setProfileState] = useState({
        lines: initial.income.map((item, index) => {
            return {
                myKey: index,
                ...item
            }
        })
    });

    const createdLines = useRef(initial.length);
    const focusedFields = useRef(0);

    useEffect(() => {
        setIsProfileLocked(!focusedFields.current);
    }, [!!focusedFields.current]);

    const setLineIncome = (lineIndex) => (value) => {
        setProfileState(current => {
            return {
                ...current,
                lines: current.lines.map((item, index) => {
                    if (index === lineIndex) return { ...item, income : value };
                    return item;
                })
            };
        })
    }

    const setLineIncrease = (lineIndex) => (value) => {
        setProfileState(current => {
            return {
                ...current,
                lines: current.lines.map((item, index) => {
                    if (index === lineIndex) return { ...item, increase : value };
                    return item;
                })
            };
        })
    }

    const setLinePeriod = (lineIndex) => (value) => {
        setProfileState(current => {
            return {
                ...current,
                lines: current.lines.map((item, index) => {
                    if (index === lineIndex) return { ...item, period : value };
                    return item;
                })
            };
        })
    }

    const addLine = () => {
        setProfileState(current => {
            const newLines = [...current.lines];
            newLines.at(-1).period = 1;
            const res = {
                ...current,
                lines: [
                    ...newLines,
                    {
                        myKey: createdLines.current,
                        income: 0,
                        increase: 0,
                        period: -1
                    }
                ]
            };
            return res;
        });
        createdLines.current += 1;
    }

    const removeLine = () => {
        setProfileState(current => {
            const newLines = [...current.lines];
            if (newLines.length > 1) {
                newLines.pop();
                newLines.at(-1).period = -1;
            } else {
                newLines[0] = { income : 0, increase : 0, period : -1 };
            }
            const res = {
                ...current,
                lines: newLines
            };
            return res;
        });
    }

    trackProfileData(profileState.lines.map(item => {
        const { myKey, ...dataToSend } = item;
        return dataToSend;
    }), incomeFrequency, increaseFrequency);

    return (
        <MyGrid container direction='row' columns={tc} variant='side-primary' reversed m={2} p={2} pr={30} width='100%' >
            <MyGrid item xs={llc} />
            <MyGrid item xs={lcc + rcc} >
                <LabelsLine {...{ incomeFrequency, setIncomeFrequency, increaseFrequency, setIncreaseFrequency }} />
            </MyGrid>
            <MyGrid item xs={rrc} />
            {
                profileState.lines.map((line, index) => {
                    const { myKey, ...lineProps } = line;
                    lineProps.setLocked = setIsProfileLocked;
                    lineProps.setIncome = setLineIncome(index);
                    lineProps.setIncrease = setLineIncrease(index);
                    lineProps.setPeriod = setLinePeriod(index);
                    lineProps.focusedFields = focusedFields;
                    lineProps.myIndex = index;
                    lineProps.incomeFieldLength = incomeFrequency.length;
                    lineProps.increaseFieldLength = increaseFrequency.length;
                    return (
                        <MyGrid key={myKey} item xs={tc} >
                            <IncomeLine {...lineProps} />
                        </MyGrid>
                    )
                })
            }
            <MyGrid item xs={tc} >
                <RemoveLineButton title={t('remove')} remove={removeLine} />
                <AddLineButton title={t('add')} add={addLine} />
            </MyGrid>
        </MyGrid>
    );
}

const initialProfileData = {
        income: [
        {
            income: 2000,
            increase: 0,
            period: 2,
        },
        {
            income: 4000,
            increase: 100,
            period: -1,
        }
    ],
    incomeFrequency: 0,
    increaseFrequency: 0
};

const Income = (props) => {
    const { t } = useTranslation('MainSim');

    const profileData = useRef({});
    const trackProfileData = (incomeValue, incomeFrequencyValue, increaseFrequencyValue) => {
        profileData.current = { incomeValue, incomeFrequencyValue, increaseFrequencyValue };
    }

    const profileManagerProps = {
        tradHook: t,
        initialProfileData,
        managerFunctions: manageIncome,
        profileData
    }

    return (
        <ProfileManager {...profileManagerProps} >
            {
                ({ key, props }) => <IncomeProfile key={key} {...props} trackProfileData={trackProfileData} />
            }
        </ProfileManager>
    )
}

export default Income;