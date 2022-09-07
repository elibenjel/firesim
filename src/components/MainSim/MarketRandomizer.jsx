import React, { useState, useRef, useEffect } from 'react';
import { useQuery } from 'react-query';
import { Box, Button, InputAdornment } from '@mui/material';
import { t as tradF } from 'i18next';

import LockableTextField from '../../components/MainSim/LockableTextField.jsx';
import { isNumber } from '../../utils/functions.js';

const t = (arg) => tradF(arg, { ns : 'MainSim' });


const MarketRandomizer = (props) => {
    const { setRandomMarket, randomize, setRandomize, setEnableRandomize } = props;
    const [randomizerArgs, setRandomizerArgs] = useState({
        mean_igr: '',
        minv_igr: '',
        maxv_igr: '',
        mean_ir: '',
        minv_ir: '',
        maxv_ir: '',
        period: ''
    });

    const disableFetchProfileQuery = useRef(true);

    const myQueryKey = [
        'loadMarketProfile',
        {
            graphqlArgs: {
                args: {
                    name : { graphqlType : 'String!', value : '' },
                    randomMarketArgs : {
                        graphqlType: 'RandomMarketArgsInput',
                        value: randomizerArgs
                    }
                },
                selection: `{
                    variations {
                        year,
                        igr,
                        ir
                    }
                }`
            },
            feedbackOptions: { replace : t('load-success') }
        },
    ];

    const myQueryOptions = {
        onSuccess: (data) => {
            disableFetchProfileQuery.current = true;
            console.log(data)
            setRandomMarket(data.variations.reduce((prev, { year, igr, ir }) => ({ ...prev, [year] : { igr, ir } }), {}));
            setRandomize(false);
        },
        enabled: !disableFetchProfileQuery.current,
        refetchOnMount: false, refetchOnWindowFocus: false, refetchOnReconnect: false,
        keepPreviousData: true, cacheTime: 0
    };

    const {
        refetch: refetchRandomProfile
    } = useQuery(myQueryKey, myQueryOptions);

    const validateArgs = () => {
        const { mean_igr, minv_igr, maxv_igr, mean_ir, minv_ir, maxv_ir, period } = randomizerArgs;
        let incorrect_number = false;
        Object.values(randomizerArgs).forEach((val) => {
            if (!isNumber(val)) {
                incorrect_number = true;
            }
        });

        if (
            !incorrect_number &&
            minv_igr <= mean_igr - 1 &&
            maxv_igr >= mean_igr + 1 &&
            minv_ir <= mean_ir - 1 &&
            maxv_ir >= mean_ir + 1 &&
            period > 0 &&
            minv_ir >= 0
        ) return true;
        return false;
    }

    const handleChange = (name) => (e) => {
        const regex = name === 'period' ? /^[0-9]*$/ : /^[0-9.-]*$/;
        if (e.target.value.match(regex)) {
            setRandomizerArgs((current) => {
                return { ...current, [name] : e.target.value }
            })
        }
    }

    const handleBlur = (name) => (e) => {
        let value = e.target.value;
        if (value !== '') {
            value = parseFloat(value);
            if (name === 'period' && randomizerArgs[name] <= 0) {
                value = 1;
            } else if (name === 'minv_ir' && randomizerArgs[name] < 0) {
                value = 0;
            }
        }

        setRandomizerArgs((current) => {
            return { ...current, [name] : value }
        })
    }

    const textfieldProps = (name) => ({
        locked: false, id: `${name}-input`, variant: 'filled', ml: 1,
        helperText: t(name), size: 'small', value: randomizerArgs[name],
        color: 'success', onChange: handleChange(name), onBlur: handleBlur(name)
    });

    useEffect(() => {
        setEnableRandomize(validateArgs())
        if (randomize) {
            disableFetchProfileQuery.current = false;
            refetchRandomProfile();
            setRandomize(false);
        }
    });

    return (
        <Box display='flex' justifyContent='space-evenly' alignItems='flex-start' width='84vw' m={1} >
            <LockableTextField {...textfieldProps('minv_igr')} />
            <LockableTextField {...textfieldProps('mean_igr')} InputProps={{ startAdornment: <InputAdornment position='start'>{'\u{FF1C}'}</InputAdornment> }} />
            <LockableTextField {...textfieldProps('maxv_igr')} InputProps={{ startAdornment: <InputAdornment position='start'>{'\u{FF1C}'}</InputAdornment> }} />
            <LockableTextField {...textfieldProps('minv_ir')} sx={{ borderLeft : '1px solid'}} />
            <LockableTextField {...textfieldProps('mean_ir')} InputProps={{ startAdornment: <InputAdornment position='start'>{'\u{FF1C}'}</InputAdornment> }} />
            <LockableTextField {...textfieldProps('maxv_ir')} InputProps={{ startAdornment: <InputAdornment position='start'>{'\u{FF1C}'}</InputAdornment> }} />
            <LockableTextField {...textfieldProps('period')} sx={{ borderLeft : '1px solid'}} />
        </Box>
    );
}

export default MarketRandomizer;