import React from 'react';
import { TextField, MenuItem } from '@mui/material';
import { isNumber } from '../../utils/functions';

const LockableTextField = (props) => {
    const { locked, baseID, value, label='', InputProps, size, step, min, max, select, ...other } = props;
    const fieldProps = (locked ?
        {
            InputProps: { readOnly : true, sx: {'::after': {
                borderColor: (theme) => theme.palette.success.main
            }}},
        }
        :
        {
            label,
            InputProps: { sx: { '::after': {
                borderColor: (theme) => theme.palette.secondary.dark
            }}},
            InputLabelProps: { sx: { '&.Mui-focused': {
                color: (theme) => theme.palette.secondary.dark
            }}}
        }
    );

    fieldProps.id = `${baseID}-input`;
    fieldProps.variant = 'standard';
    fieldProps.size = 'small';
    fieldProps.value = value;
    fieldProps.InputProps = { ...fieldProps.InputProps, ...InputProps };
    fieldProps.inputProps = { step, min, max, size };
    if (step || min || max) {
        fieldProps.inputProps.type = 'number';
        if (size) {
            if (!min) {
                fieldProps.inputProps.min = - (10**size) + 1;
            }
            if (!max) {
                fieldProps.inputProps.max = (10**size) - 1;
            }
        }
    }

    return select ? (
            <TextField select {...fieldProps} {...other} children={
                select ?
                select.map((item) => {
                    const menuItemProps = typeof item === 'string' ?
                    { value : item, children : item }
                    : { value : item.value, children : item.label };
                    menuItemProps.key = item;
                    return <MenuItem {...menuItemProps} />;
                })
                : <MenuItem key={''} value={''}>{''}</MenuItem>
            } />
        )
        : <TextField {...fieldProps} {...other} />;
}

export default LockableTextField;