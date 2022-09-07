import React, { useState, useEffect, useRef } from 'react';
import { useQuery, useQueries } from 'react-query';
import { t as tradF } from 'i18next';
import { Box, Paper, FormControl, Checkbox, Fade, FormControlLabel, Radio, RadioGroup, Typography, MenuItem, TextField, Button, InputAdornment, Slider, Grid, Input, Popper, ClickAwayListener } from '@mui/material';
import {
    RemoveCircleOutline,
    Undo,
    Add,
    Remove,
    Clear,
    Tune,
    FlareSharp,
} from '@mui/icons-material';

import ProfileManager from '../../components/MainSim/ProfileManager.jsx';
import { manageSpendings, manageIncome, manageMarket } from '../../services/simulation.js';
import ControlButton from "../../components/MainSim/ControlButton.jsx";
import LockableTextField from '../../components/MainSim/LockableTextField.jsx';
import { isNumber } from '../../utils/functions.js';
import { getFortuneGrowth } from '../../utils/computations.js';
import CustomRadioGroup from '../../components/MainSim/CustomRadioGroup.jsx';
import MarketRandomizer from '../../components/MainSim/MarketRandomizer.jsx';

const t = (arg) => tradF(arg, { ns : 'MainSim' });
const minYear = new Date().getFullYear();
let fetchNames = true;
const { useFetchProfile : useFetchSpendingsProfile } = manageSpendings;
const { useFetchProfile : useFetchIncomeProfile } = manageIncome;
const { useFetchProfile : useFetchMarketProfile } = manageMarket;

const financialYearLength = 30;
const chartHeight = 500;
const chartPadding = 50;
const f = (arg) => `${arg}%`;

const Typo = ({ children, ...other }) => {
    return <Typography variant='h10' textAlign='center' {...other} >{children}</Typography>
}

const ChartTypo = ({ children, ...other }) => {
    return <Typography variant='body2' textAlign='justify' {...other} >{children}</Typography>
}

const AddLineButton = (props) => {
    const { title, add, ...other } = props;

    const handleClick = (event) => {
        add();
    }

    const sxIcon = {
        fill: (theme) => theme.palette.secondary.dark,
        border: 'solid',
        borderRadius:'50%',
        borderColor: (theme) => theme.palette.secondary.dark
    }

    const sxDisabledIcon = {};

    return (
        <ControlButton title={title} onClick={handleClick}
            icon={<Add fontSize='large' sx={other.disabled ? sxDisabledIcon : sxIcon} />} {...other} />
    )
}

const RemoveLineButton = (props) => {
    const { title, remove, ...other } = props;

    const handleClick = (event) => {
        remove();
    }

    const sxIcon = {
        fill: (theme) => theme.palette.secondary.dark,
        border: 'solid',
        borderRadius:'50%',
        borderColor: (theme) => theme.palette.secondary.dark
    }

    const sxDisabledIcon = {};

    return (
        <ControlButton title={title} onClick={handleClick}
            icon={<Remove fontSize='large' sx={other.disabled ? sxDisabledIcon : sxIcon} />} {...other} />
    )
}

const FinancialLineAux = (props) => {
    const { myKey, setFinancialProfile, minYear, amILast } = props;
    const timeChoice = useRef(1);
    const [year, setYear] = useState(minYear);
    const [yearIsChanging, setYearIsChanging] = useState(false);

    const setFinancialProfileAux = (value) => setFinancialProfile((current) => {
        let start = value;
        if (timeChoice.current === 0) {
            start = -1;
        }
        return { ...current, [myKey]: { ...current[myKey], start } };
    });

    useEffect(() => {
        if (yearIsChanging) return;
        if (year < minYear) setYear(minYear);
        else setFinancialProfileAux(year);
    }, [year, minYear, yearIsChanging]);

    const handleCheckboxChange = (event) => {
        timeChoice.current += 1;
        timeChoice.current %= 2;
        setFinancialProfileAux(year);
    }

    const handleYearChange = (event) => {
        setYearIsChanging(true);
        setYear(parseInt(event.target.value, 10));
    }

    const handleYearBlur = () => {
        setYearIsChanging(false);
    }

    const textfieldProps = (name) => ({
        locked: false, id: `${name}-input`, variant: 'filled', ml: 1,
        size: 'small', value: year,
        color: 'success', onChange: handleYearChange, onBlur: handleYearBlur
    });

    const checkboxProps = {
        checked: timeChoice.current === 0,
        onChange: handleCheckboxChange,
        color: 'secondary',
        disabled: !amILast
    }

    return (
        <Box display='flex' alignItems='center' mr={3} >
            <Typo>{t('financial-line-aux-1')}</Typo>
            <Box display='flex' flexDirection='column' ml={2} mr={2} >
                <LockableTextField {...textfieldProps('start-year')} disabled={timeChoice.current === 0} />
                <FormControlLabel control={<Checkbox {...checkboxProps} />} label={t('financial-line-aux-2')} />
            </Box>
            <Typo>➟</Typo>
        </Box>
    )
}

const CustomSlider = (props) => {
    const { id, group, disabled, minv, maxv, value, defaultValue, handleSliderChange, handleInputChange, handleBlur, isRatio, ...other } = props;
    return (
        <Box {...other} sx={{ width: 400, ...other.sx }}>
            <Typo id={`${id}-input-slider`} gutterBottom>
                {t(id)}
            </Typo>
            <Grid container spacing={2} alignItems="center">
                <Grid item xs>
                    <Slider
                        disabled={disabled}
                        size="small"
                        min={minv}
                        max={maxv}
                        value={value}
                        onChange={handleSliderChange(group, id)}
                        aria-labelledby="input-slider"
                    />
                </Grid>
                <Grid item>
                    <Input
                        disabled={disabled}
                        value={value}
                        size="small"
                        onChange={handleInputChange(group, id)}
                        onBlur={handleBlur(group, id)({ minv, maxv, value, defaultValue })}
                        inputProps={{
                            step: Math.min((maxv-minv) / 1000, 1000),
                            min: minv,
                            max: maxv,
                            type: 'number',
                            'aria-labelledby': 'input-slider',
                        }}
                        endAdornment={<InputAdornment position='end'>{isRatio ? '%' : t('currency')}</InputAdornment>}
                    />
                </Grid>
            </Grid>
        </Box>
    );
}

const FinancialYear = (props) => {
    const { myIndex, nestWorth, nestWorthShift, investments, cumulatedInvestments, cash, cashShift, marketPerfs, maxY, totalYears, xRange, svgWidth, convert, zeroHeight, yearToFIRE } = props;

    const [openPopper, setOpenPopper] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleHover = (event) => {
        setAnchorEl(event.currentTarget);
        setOpenPopper(true);
    };

    const handleLeave = (event) => {
        setOpenPopper(false)
    };

    const yearWidth = xRange/totalYears;
    const yearX = myIndex * yearWidth;
    const rectWidth = 0.25*yearWidth;
    const shiftX = 0.25*yearWidth
    const getRectProps = (value, fill, position) => {
        const ypos = - convert(value);
        const rectProps = {
            x: f(yearX + position*shiftX),
            y: Math.min(0, ypos),
            width: f(rectWidth),
            height: Math.abs(ypos),
            fill
        }
    
        if (value === 0) {
            rectProps.y = - convert(0.5*zeroHeight);
            rectProps.height = convert(zeroHeight);
        }

        return rectProps
    }

    const fillColors = { nestWorth : 'rgba(170,0,0,100%)', cumulatedInvestments : 'rgba(0,150,100,100%)', cash: 'rgba(50,100,180,100%)' };
    const positions = { nestWorth : 0, cumulatedInvestments : 1, cash : 2 };
    const getRects = (values) => {
        const rects = [];
        const current = { ...values };
        while (Object.keys(current).length > 0) {
            let biggest = null;
            Object.entries(current).forEach(([name, value]) => {
                if (!biggest || value > biggest[1]) {
                    biggest = [name, value];
                }
            });

            rects.push({
                name: biggest[0],
                props: getRectProps(biggest[1], fillColors[biggest[0]], positions[biggest[0]])
            });

            delete current[biggest[0]];
        }

        return rects;
    }

    const rects = getRects({ nestWorth, cumulatedInvestments, cash });
    const handlerRectProps = {
        x: f(yearX),
        y: f(-100),
        width: f(yearWidth),
        height: f(100),
        fill: openPopper ? 'rgba(20,0,0,5%)' : 'transparent',
        onMouseEnter: handleHover,
        onMouseMove: handleHover,
        onMouseLeave: handleLeave
    }
    const percToCoord = (perc) => perc*svgWidth/100;
    const textProps = {
        x: percToCoord(yearX+0.7*yearWidth),
        y: -convert(maxY/10),
        fontSize: '15pt',
        textAnchor: 'start',
        fill: 'rgba(70,70,70,60%)',
        letterSpacing: 5,
        children: t('fire').toUpperCase()
    }

    textProps.transform = `rotate(-90,${textProps.x},${textProps.y})`;

    return (
        <>
            {
                rects.map(({ name, props }) => {
                    return <rect key={name} {...props} />;
                })
            }
            {
                myIndex === yearToFIRE ?
                <text {...textProps} />
                : null
            }
            <rect {...handlerRectProps} />
            <Popper placement='right-end' id={`financial-year-${myIndex}-popper`} open={openPopper} anchorEl={anchorEl} >
                <Paper variant='simple' sx={{ p : '4px 24px 4px', maxWidth : '20rem' }}>
                        <ChartTypo>{`${t('year')} : ${minYear+myIndex}`}</ChartTypo>
                        <div>
                            <ChartTypo component='span'>{`${t('nestWorth')} : ${Math.round(nestWorth)} ${t('currency')} `}</ChartTypo>
                            <ChartTypo component='span' color={nestWorthShift < 0 ? 'rgb(150,0,0)' : 'rgb(0,150,0)'} >{`(${nestWorthShift < 0 ? '' : '+'}${Math.round(nestWorthShift)} ${t('currency')})`}</ChartTypo>
                        </div>
                        <div>
                            <ChartTypo component='span'>{`${t('investments')} : ${Math.round(cumulatedInvestments)} ${t('currency')} `}</ChartTypo>
                            <ChartTypo component='span' color='rgb(0,150,0)' >{`(+${Math.round(investments)} ${t('currency')})`}</ChartTypo>
                        </div>
                        <div>
                            <ChartTypo component='span'>{`${t('cash')} : ${Math.round(cash)} ${t('currency')} `}</ChartTypo>
                            <ChartTypo component='span' color={Math.round(cashShift) < 0 ? 'rgb(150,0,0)' : 'rgb(0,150,0)'} >{`(${Math.round(cashShift) < 0 ? '' : '+'}${Math.round(cashShift)} ${t('currency')})`}</ChartTypo>
                        </div>
                        <ChartTypo>{`${t('marketGrowth')} : ${marketPerfs?.igr}%`}</ChartTypo>
                        <ChartTypo>{`${t('receivedDividends')} : ${marketPerfs?.ir}%`}</ChartTypo>
                </Paper>
            </Popper>
        </>
    )
}

const ChartTicks = (props) => {
    const { originX, originY, endX, ticksY } = props;

    return (
        <>
            <line x1={f(originX)} y1={f(originY)} x2={f(endX + chartPadding)} y2={f(originY)} stroke='black' />
            {
                ticksY.map(({ value, pos }, index) => {
                    const tickText = { x : originX-chartPadding, y : pos, fontSize: '8pt', textAnchor: 'left', children : `${value}€` };
                    return (
                        <React.Fragment key={pos}>
                            <line x1={f(originX)} y1={pos} x2={f(endX + chartPadding)} y2={pos} stroke='black' />
                            <text {...tickText} />
                        </React.Fragment>
                    ) 
                })
            }
        </>
    )
}

const FinancialChart = (props) => {
    const { simulationID, data, market, ...boxWrapperProps } = props;

    const defaultChartData = {
        financialYears: [{ nestWorth : 0 }],
        maxY: 10000,
        minY: 0,
        ticksStep: 1000
    };

    const [chartData, setChartData] = useState(defaultChartData);
    const [yearToFIRE, setYearToFIRE] = useState(null);

    useEffect(() => {
        const round = (value, roundFactor) => {
            if (value === 0) return value;
            const absolute = Math.abs(value);
            return Math.sign(value) * Math.floor((absolute / roundFactor) + 1) * roundFactor;
        }
    
        const getRoundFactor = (maxValue) => {
            let n = 0;
            while (10**n < maxValue) {
                n += 1;
            }
            let roundFactor = 10**(n-1);
            while(Math.floor(maxValue / roundFactor) < 5) {
                roundFactor /= 2;
            }
            return roundFactor;
        }
    
        const processData = (data) => {
            let { maxY : maxValue, minY : minValue } = defaultChartData;
            
            let financialYears = {
                nestWorth: null, nestWorthShift: null,
                investments: null, cumulatedInvestments: null,
                cash: null, cashShift: null
            };
            const printedKeys = ['nestWorth', 'cumulatedInvestments', 'cash'];
            Object.keys(financialYears).forEach((key) => {
                if (!data || !data[key]) return;
                financialYears[key] = data[key].map(value => {
                    if (printedKeys.includes(key)) {
                        if (value > maxValue) {
                            maxValue = value;
                        } else if (value < minValue) {
                            minValue = value;
                        }
                    }
        
                    return value;
                })
            });

            financialYears = financialYears.nestWorth?.map((_, index) => {
                const year = {};
                Object.entries(financialYears).forEach(([key, values]) => {
                    year[key] = values[index];
                });

                return year;
            });

            if (!financialYears) {
                financialYears = defaultChartData.financialYears;
            }
    
            const roundFactor = getRoundFactor(maxValue);
            const maxY = round(maxValue, roundFactor);
            const minY = round(Math.min(minValue, -0.01*maxValue), roundFactor);
            return { financialYears, maxY, minY, ticksStep : roundFactor, zeroHeight : 0.005*maxValue };
        }

        setChartData(processData(data));
        setYearToFIRE(data?.yearToFIRE);

    }, [data]);

    const { financialYears, maxY, minY, ticksStep, zeroHeight } = chartData;
    // const [financialYears, setFinancialYears] = useState(getFinancialYears(data));

    const convert = (value) => {
        const newValue = value * chartHeight / (maxY-minY);
        return newValue;
    }

    const chartWidth = financialYearLength * financialYears.length;
    const svgWidth = chartWidth +2*chartPadding
    const svgProps = {
        width: svgWidth,
        height: chartHeight,
        viewBox: [
            - chartPadding,
            - convert(maxY),
            svgWidth,
            convert(maxY-minY)
        ].join(' '),
        preserveAspectRatio: 'xMinYMax slice'
    };

    const ticksY = [{ value : minY, pos : -convert(minY) }];
    while(ticksY.at(-1).value < maxY) {
        const value = ticksY.at(-1).value + ticksStep;
        ticksY.push({ value, pos : -convert(value) });
    }

    return (
        <Box {...boxWrapperProps} >
            <svg id={simulationID} {...svgProps} >
                <ChartTicks originX={0} originY={0} endX={100} endY={-100} stepX={5} ticksY={ticksY} maxY={maxY} />
            {
                financialYears.map((year, index) => {
                    let marketPerfs = market && market[index];
                    if (market && !marketPerfs) {
                        const maxYear = Math.max(...Object.keys(market).map(el => Number(el)));
                        marketPerfs = market[maxYear];
                    }
                    return (
                        <FinancialYear
                            key={[simulationID, index]} {...year} marketPerfs={marketPerfs}
                            totalYears={financialYears.length} maxY={chartData.maxY}
                            convert={convert} myIndex={index} zeroHeight={zeroHeight}
                            xRange={100*(1 - 2*chartPadding/svgWidth)}
                            svgWidth={svgWidth} yearToFIRE={yearToFIRE}
                        />
                    )
                })
            }
            </svg>
        </Box>
    );
}

const OptionsPanel = (props) => {
    const { options, setOptions, setValid } = props;

    const [showPanel, setShowPanel] = useState(false);
    const anchorPanel = useRef(null);

    const setNewValue = (optionGroup, optionName, value) => {
        setOptions((current) => {
            return {
                ...current,
                [optionGroup]: {
                    ...current[optionGroup],
                    [optionName]: { ...current[optionGroup][optionName], value }
                }
            }
        });
    }

    const handleCheckboxChange = (optionName) => (e) => {
        setOptions((current) => {
            return {
                ...current,
                checkedSliders: {
                    ...current.checkedSliders,
                    [optionName]: { ...current.checkedSliders[optionName], checked : !current.checkedSliders[optionName].checked }
                }
            }
        });
    }

    const handleBlur = (optionGroup, optionName) => ({ minv, value, maxv, defaultValue }) => () => {
        setValid(true);
        let correction = null;
        if (!isNumber(value)) {
            correction = defaultValue;
        }
        else if (value < minv) {
            correction = minv;
        } else if (value > maxv) {
            correction = maxv;
        }

        if (correction !== null) {
            setNewValue(optionGroup, optionName, correction);
        }
    }

    const handleSliderChange = (optionGroup, optionName) => (event, newValue) => {
        setNewValue(optionGroup, optionName, newValue);
    };

    const handleInputChange = (optionGroup, optionName) => (event) => {
        setValid(false);
        setNewValue(optionGroup, optionName, event.target.value);
    };

    const handleShowPanelClick = (event) => {
        setShowPanel(!showPanel);
        anchorPanel.current = event.target;
    }

    const handleClickAway = (event) => {
        if (anchorPanel.current && anchorPanel.current.contains(event.target)) {
            return;
          }
      
          setShowPanel(false);
    }

    const prevShowPanel = useRef(showPanel);
    useEffect(() => {
        if (prevShowPanel.current === true && showPanel === false) {
            anchorPanel.current.focus();
        }

        prevShowPanel.current = showPanel;
    }, [showPanel]);

    return (
        <Box display='flex' flexDirection='column' alignItems='center' width='100%' >
            <ControlButton title={t('more-options')} onClick={handleShowPanelClick}
                icon={<Tune fontSize='large' />} />
            <Popper id='options-popper' open={showPanel} anchorEl={anchorPanel.current} style={{ zIndex : 1000 }} >
                <ClickAwayListener onClickAway={handleClickAway} >
                    <Paper elevation={4} sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        p: 2
                    }} >
                        {Object.entries(options).map(([optionType, option]) => {
                            return Object.entries(option).map(([optionName, { checked, minv, maxv, value, isRatio, defaultValue }], index) => {
                                return optionType === 'checkedSliders' ? (
                                    <Box key={[optionType, optionName]} display='flex' justifyContent='flex-start' sx={{ mr : index === 0 ? 4 : 2 }} >
                                        <Checkbox checked={checked} onChange={handleCheckboxChange(optionName)} sx={{ mr : 2 }} />
                                        <CustomSlider id={optionName} group='checkedSliders' disabled={!checked}
                                            minv={minv} maxv={maxv} value={value} defaultValue={defaultValue}
                                            handleInputChange={handleInputChange} handleSliderChange={handleSliderChange}
                                            handleBlur={handleBlur} isRatio={isRatio} />
                                    </Box>
                                ) : (
                                    <CustomSlider key={[optionType, optionName]} id={optionName} group='sliders'
                                        minv={minv} maxv={maxv} value={value} defaultValue={defaultValue} isRatio={isRatio}
                                        handleInputChange={handleInputChange} handleSliderChange={handleSliderChange}
                                        handleBlur={handleBlur} sx={{ mr : 2 }} />
                                )
                            })
                        })}
                    </Paper>
                </ClickAwayListener>
            </Popper>
        </Box>
    )
}

const ProfileLoader = (props) => {
    const { setProfiles, simulationID, setValidProfiles, disableFetchProfileQueries } = props;

    const [financialProfile, setFinancialProfile] = useState({
        0: {
            start: new Date().getFullYear(),
            selectedSpendingsProfile: '',
            selectedIncomeProfile: ''
        }
    });
    const [selectedMarketProfile, setSelectedMarketProfile] = useState('');
    const [randomize, setRandomize] = useState(false);
    const [enableRandomize, setEnableRandomize] = useState(false);

    const marketModes = ['profileMode', 'randomizerMode'];
    const [marketMode, setMarketMode] = useState(marketModes[0])
    const financialProfileKey = useRef(0);

    useEffect(() => {
        let validFinancialProfile = true;
        Object.entries(financialProfile).forEach(([_, { selectedSpendingsProfile, selectedIncomeProfile }]) => {
            if (selectedSpendingsProfile === '' || selectedIncomeProfile === '') {
                validFinancialProfile = false;
            }
        });

        setValidProfiles(
            validFinancialProfile && (
                (marketMode === marketModes[0] && selectedMarketProfile !== '') ||
                (marketMode === marketModes[1] && enableRandomize)
            )
        );
    }, [financialProfile, selectedMarketProfile, enableRandomize])

    const {
        data: profileNames,
        refetch: refetchProfileNames
    } = useQuery([
        ['mySpendingsProfileNames', 'myIncomeProfileNames', 'myMarketProfileNames'],
        { graphqlArgs : {}, feedbackOptions : { disableOnSuccess : true } }
    ], { enabled : fetchNames });

    fetchNames = false;

    // fetch this query on mount only
    useEffect(() => {
        refetchProfileNames();
    }, []);

    const getRequestedProfiles = () => {
        const dates = [];
        const spendingsProfiles = [];
        const incomeProfiles = [];
        Object.values(financialProfile).forEach(({ start, selectedSpendingsProfile, selectedIncomeProfile }) => {
            dates.push(start);
            spendingsProfiles.push(selectedSpendingsProfile);
            incomeProfiles.push(selectedIncomeProfile);
        });

        return { dates, incomeProfiles, spendingsProfiles };
    }

    const requestedProfiles = getRequestedProfiles();
    
    const {
        refetch: refetchSpendingsProfiles
    } = useFetchSpendingsProfile({
        queryArgs: { selectedProfileNames : requestedProfiles.spendingsProfiles },
        queryOptions: { enabled : !disableFetchProfileQueries.current },
        queryCallbacks: {
            onSuccess: (data) => {
                disableFetchProfileQueries.current.spendings = true;
                setProfiles((current) => {
                    const newState = { ...current };
                    requestedProfiles.dates.forEach((date, index) => {
                        newState[date] = { ...newState[date], ...data[index] };
                    });
                    return newState;
                });
            }
        },
        feedbackOptions: { replace : t('load-success') }
    });

    const {
        refetch: refetchIncomeProfiles
    } = useFetchIncomeProfile({
        queryArgs: { selectedProfileNames : requestedProfiles.incomeProfiles },
        queryOptions: { enabled : !disableFetchProfileQueries.current },
        queryCallbacks: {
            onSuccess: (data) => {
                disableFetchProfileQueries.current.income = true;
                setProfiles((current) => {
                    const newState = { ...current };
                    let lastIncomeProfileName = '';
                    requestedProfiles.dates.forEach((date, index) => {
                        newState[date] = { ...newState[date], ...data[index] };
                        if (requestedProfiles.incomeProfiles[index] !== lastIncomeProfileName) {
                            newState[date].resetIncome = true;
                        }
                        lastIncomeProfileName = requestedProfiles.incomeProfiles[index];
                    });
                    return newState;
                });
            }
        },
        feedbackOptions: { replace : t('load-success') }
    });

    const {
        refetch: refetchMarketProfile
    } = useFetchMarketProfile({
        queryArgs: { selectedProfileName : selectedMarketProfile },
        queryOptions: { enabled : !disableFetchProfileQueries.current },
        queryCallbacks: {
            onSuccess: (data) => {
                disableFetchProfileQueries.current.market = true;
                setProfiles((current) => {
                    return { ...current, market : data.variations.reduce((prev, { year, igr, ir }) => ({ ...prev, [year] : { igr, ir } }), {}) }
                });
            }
        },
        feedbackOptions: { replace : t('load-success') }
    });

    const setRandomMarket = (market) => setProfiles((current) => {
        return { ...current, market }
    });

    const addFinancialProfileLine = () => {
        financialProfileKey.current += 1;
        setFinancialProfile((current) => ({
            ...current,
            [financialProfileKey.current]: { selectedSpendingsProfile : '', selectedIncomeProfile : '' }
        }))
    }

    const findGreatestKey = (obj) => {
        let key = 0;
        Object.keys(obj).forEach((k) => {
            if (k > key) {
                key = k;
            }
        });
        return key;
    }

    const removeFinancialProfileLine = () => {
        setFinancialProfile((current) => {
            const { [findGreatestKey(current)] : _, ...newState } = current;
            return newState;
        })
    }

    const handleSelectedSpendingsProfileChange = (key) => (event) => {
        setFinancialProfile((current) => ({
            ...current,
            [key] : { ...current[key], selectedSpendingsProfile : event.target.value }
        }));
    }

    const handleSelectedIncomeProfileChange = (key) => (event) => {
        setFinancialProfile((current) => ({
            ...current,
            [key] : { ...current[key], selectedIncomeProfile : event.target.value }
        }));
    }

    const handleSelectedMarketProfileChange = (event) => {
        setSelectedMarketProfile(event.target.value);
    }

    const profileNameSelectorProps = (key) => (name) => ({
        id: `${name}-selector-${key}`, variant: 'filled',
        label: t(`select-${name}`), size: 'small', color: 'success', sx: { minWidth: 300 },
        children: profileNames ?
            profileNames[name].map((item) => (
                <MenuItem key={item} value={item}>{item}</MenuItem>
            ))
            : <MenuItem key={''} value={''}>{''}</MenuItem>
    });

    useEffect(() => {
        if (simulationID === 0) return;
        refetchSpendingsProfiles();
        refetchIncomeProfiles();

        if (marketMode === marketModes[0]) {
            refetchMarketProfile();
        } else {
            setRandomize(true);
        }
    }, [simulationID]);

    return (
        <Box display='flex'flexDirection='column' justifyContent='flex-start' alignItems='center' width='100%' p={1} >
            <CustomRadioGroup
                row values={marketModes} labels={marketModes.map(el => t(el))}
                initialValue={marketModes[0]} groupLabel=" " setValueToParent={setMarketMode}
            />
            {
                marketMode === marketModes[0] ?
                <TextField select {...profileNameSelectorProps(0)('myMarketProfileNames')}
                    onChange={handleSelectedMarketProfileChange} value={selectedMarketProfile} sx={{ minWidth: 600 }} />
                : <MarketRandomizer setRandomMarket={setRandomMarket} randomize={randomize} setRandomize={setRandomize} setEnableRandomize={setEnableRandomize} />
            }
            {
                Object.entries(financialProfile).map(([key, { selectedSpendingsProfile, selectedIncomeProfile }], index, entries) => {
                    const amILast = index === entries.length - 1;
                    return (
                        <Box key={key} display='flex' justifyContent='center' alignItems='center' width='100%' mt={1} >
                            {
                                index > 0 ?
                                <FinancialLineAux myKey={key} setFinancialProfile={setFinancialProfile}
                                    minYear={entries[index-1][1].start + 1} amILast={amILast} />
                                : null
                            }
                            <TextField select {...profileNameSelectorProps(key)('mySpendingsProfileNames')}
                                onChange={handleSelectedSpendingsProfileChange(key)} value={selectedSpendingsProfile}
                                sx={{ width: 300 }} />
                            <TextField select {...profileNameSelectorProps(key)('myIncomeProfileNames')}
                                onChange={handleSelectedIncomeProfileChange(key)} value={selectedIncomeProfile}
                                sx={{ width: 300 }} />
                        </Box>
                    )
                })
            }
            <Box display='flex' >
                <AddLineButton title={t('add-financial-line')} add={addFinancialProfileLine}
                    disabled={financialProfile[findGreatestKey(financialProfile)].start === -1} />
                <RemoveLineButton remove={removeFinancialProfileLine} disabled={Object.keys(financialProfile).length === 1} />
            </Box>
        </Box>
    );
}

const Simulation = (props) => {
    const [simulationID, setSimulationID] = useState(0);
    const [profiles, setProfiles] = useState({ market : null });
    const disableFetchProfileQueries = useRef({ spendings: true, income: true, market: true });
    const [validProfiles, setValidProfiles] = useState(false);
    const [fortuneGrowth, setFortuneGrowth] = useState({});
    const [options, setOptions] = useState({
        sliders: {
            percentageToInvest: { minv : 0, maxv : 100, value : 95, defaultValue : 95, isRatio : true },
            startingCapital: { minv : 0, maxv : 10**6, value : 0, defaultValue : 0 },
            startingCash: { minv : 0, maxv : 10**6, value : 0, defaultValue : 0 },
        },
        checkedSliders: {
            maxAmountToInvest: { checked : false, minv : 0, maxv : 10**6, value : 10000, defaultValue : 10000 },
            maxCash: { checked : false, minv : 0, maxv : 10**6, value : 10000, defaultValue : 10000 },
            minCash: { checked : false, minv : 0, maxv : 10**6, value : 10000, defaultValue : 10000 },
            period: { checked : false, minv : 1, maxv : 100, value : 40, defaultValue : 40 }
        }
    });

    const [validOptions, setValidOptions] = useState(true);

    const handleLoad = () => {
        setProfiles({ market : null });
        disableFetchProfileQueries.current = { spendings: false, income: false, market: false };
        setSimulationID(current => current + 1)
    }

    const myOptions = Object.entries(options).reduce((prev, [_, optionGroup]) => {
        const next = { ...prev };
        Object.entries(optionGroup).forEach(([optionName, { checked, value }]) => {
            if (checked === false) return;
            next[optionName] = Number(value);
        });
        return next;
    }, {});

    useEffect(() => {
        if (!(simulationID !== 0)) return;
        setFortuneGrowth(getFortuneGrowth({ ...profiles, ...myOptions }));
    }, [profiles]);

    console.log('profiles :', profiles);
    console.log('fortune :', fortuneGrowth);

    return (
        <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='flex-start' p={1} ml={3} mr={3}
            width='95%' >
            <Box display='flex' flexDirection='column' justifyContent='flex-start' alignItems='center' p={1} width='100%' maxWidth='85vw'
                component={Paper} >
                <ProfileLoader setProfiles={setProfiles} simulationID={simulationID}
                    validProfiles={validProfiles} setValidProfiles={setValidProfiles} disableFetchProfileQueries={disableFetchProfileQueries} />
                <OptionsPanel options={options} setOptions={setOptions} setValid={setValidOptions} />
                <Button variant='contained' color='primary'
                    onClick={handleLoad} disabled={!(validProfiles && validOptions)}
                    sx={{ mt : 1, flex : 0.8 }}>{t('load')}</Button>
            </Box>
            {
                (simulationID !== 0) ?
                <FinancialChart simulationID={simulationID} data={fortuneGrowth} market={profiles.market} width='90%' maxWidth='85vw' sx={{ overflowX:'auto', m : '16px 32px' }} />
                : null
            }
        </Box>
    );
}

export default Simulation;