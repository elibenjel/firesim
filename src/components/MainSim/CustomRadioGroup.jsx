import React, { useState } from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const CustomRadioGroup = (props) => {
    const { values, labels, initialValue, groupLabel, row, setValueToParent } = props;
    const [value, setValue] = useState(initialValue);

    const handleChange = (event) => {
        setValue(event.target.value);
        if (setValueToParent) {
            setValueToParent(event.target.value);
        }
    };

    return (
        <FormControl>
            <FormLabel id={`${groupLabel}-radio-group-label`} >{groupLabel}</FormLabel>
            <RadioGroup
                aria-labelledby={`${groupLabel}-radio-group-label`}
                name={`${groupLabel}-radio-group`}
                value={value}
                onChange={handleChange}
                row={row}
            >
                {
                    values.map((value, index) => {
                        return (
                            <FormControlLabel key={value} value={value} control={<Radio />} label={labels[index]} />
                        )
                    })
                }
            </RadioGroup>
        </FormControl>
    );
}

export default CustomRadioGroup;