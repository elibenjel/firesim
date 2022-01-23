
export const fieldInfo = {
    annualIncomeInput: {
        index: 1,
        name: null,
        info: null,
        validateF: (val) => {
            return val && !Number.isNaN(Number(val)) && val >= 0;
        },
        placeholder: 'ex: 30000',
        helperText: null,
        startAdornment: null,
        // helpBubbleContent: null
    },

    annualSpendingsInput: {
        index: 2,
        name: null,
        info: null,
        validateF: (val) => {
            return val && !Number.isNaN(Number(val)) && val >= 0;
        },
        placeholder: 'ex: 15000',
        helperText: null,
        startAdornment: null
    },

    annualBenefitsInput: {
        index: 3,
        name: null,
        info: null,
        validateF: (val) => {
            return val && !Number.isNaN(Number(val)) && val >= 0;
        },
        helperText: null,
        startAdornment: null
    },

    igrInput: {
        index: 4,
        name: null,
        info: null,
        validateF: (val) => {
            return val && !Number.isNaN(Number(val));
        },
        placeholder: 'ex: 8',
        helperText: null,
        startAdornment: '%'
    },

    irInput: {
        index: 5,
        name: null,
        info: null,
        validateF: (val) => {
            return val && !Number.isNaN(Number(val));
        },
        placeholder: 'ex: 2',
        helperText: null,
        startAdornment: '%'
    },

    roiInput: {
        index: 6,
        name: null,
        info: null,
        validateF: (val) => {
            return val && Number(val);
        },
        placeholder: 'ex: 10',
        helperText: null,
        startAdornment: '%'
    },

    reinvestDividendsSwitch: {
        index: 7,
        name: null,
        info: null
    }
}

export const tradKeys = {
    name: (i) => `fn${i}`,
    info: (i) => `info${i}`,
    helperText: (i) => `ht${i}`,
    startAdornment: () => 'currency'
};

export const initTrads = ({ t, id }) => {
    const information = fieldInfo[id];
    const index = fieldInfo[id].index;
    
    Object.entries(information).map(([key, value]) => {
        if (value === null) {
            const tradKey = tradKeys[key](index);
            fieldInfo[id][key] = t(tradKey);
        }
    });
}