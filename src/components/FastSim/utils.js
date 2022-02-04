import * as functions from '../../utils/functions';


export const fieldInfo = {
    annualIncomeInput: {
        index: 1,
        nameF: null,
        infoF: null,
        validateF: (val) => {
            return functions.isNumber(val) && val >= 0;
        },
        placeholder: 'ex: 30000',
        helperTextF: null,
        startAdornmentF: null,
    },

    annualSpendingsInput: {
        index: 2,
        nameF: null,
        infoF: null,
        validateF: (val) => {
            return functions.isNumber(val) && val >= 0;
        },
        placeholder: 'ex: 15000',
        helperTextF: null,
        startAdornmentF: null
    },

    annualBenefitsInput: {
        index: 3,
        nameF: null,
        infoF: null,
        validateF: (val) => {
            return functions.isNumber(val) && val >= 0;
        },
        helperTextF: null,
        startAdornmentF: null
    },

    igrInput: {
        index: 4,
        nameF: null,
        infoF: null,
        validateF: (val) => {
            return functions.isNumber(val);
        },
        placeholder: 'ex: 8',
        helperTextF: null,
        startAdornmentF: () => '%'
    },

    irInput: {
        index: 5,
        nameF: null,
        infoF: null,
        validateF: (val) => {
            return functions.isNumber(val);
        },
        placeholder: 'ex: 2',
        helperTextF: null,
        startAdornmentF: () => '%'
    },

    roiInput: {
        index: 6,
        nameF: null,
        infoF: null,
        validateF: (val) => {
            return functions.isNumber(val);
        },
        placeholder: 'ex: 10',
        helperTextF: null,
        startAdornmentF: () => '%'
    },

    reinvestDividendsSwitch: {
        index: 7,
        nameF: null,
        infoF: null
    }
}

const getTradKeys = {
    nameF: (i) => `fn${i}`,
    infoF: (i) => `info${i}`,
    helperTextF: (i) => `ht${i}`,
    startAdornmentF: () => 'currency'
};

// fill null values in fieldInfo  
Object.entries(fieldInfo).map(([fieldName, info]) =>{
    const index = info.index;
    const getDefaultKey = key => (index => `${key}${index}`);
    Object.entries(info).map(([key, value]) => {
        if (value === null) {
            const getKey = (key in getTradKeys ? getTradKeys[key] : getDefaultKey(key));
            const tradKey = getKey(index);
            info[key] = ((t) => t(tradKey));
        }
    });
})


export const whenCanIFIRE = (args) => {
    const { annualIncome, annualSpendings, igr, ir, reinvestDividends } = args;
    let yearsToRetire = 0;
    const targetFortune = parseInt((100 / 3) * Number(annualSpendings));
    const annualBenefits = Number(annualIncome) - Number(annualSpendings);
    let currentFortune = 0;
    let dividends = 0;
    const fortuneGrowth = { targetFortune, startFortunes : [], endFortunes : [], dividends : [] };

    while (currentFortune < targetFortune) {
        yearsToRetire += 1;
        currentFortune += annualBenefits;
        if (reinvestDividends) {
            currentFortune += dividends;
        }
        fortuneGrowth.startFortunes.push(parseInt(currentFortune));
        
        dividends = currentFortune * Number(ir) / 100;
        fortuneGrowth.dividends.push(parseInt(dividends));
        
        currentFortune *= 1 + Number(igr) / 100;
        fortuneGrowth.endFortunes.push(parseInt(currentFortune));
    }

    fortuneGrowth.yearsToRetire = yearsToRetire;
    return fortuneGrowth;
}
