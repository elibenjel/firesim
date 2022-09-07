import { isNumber } from "./functions";

export const getFortuneGrowth = (args) => {
    const { market, ...options } = args;

    const fortuneGrowth = {
        investments: [], cumulatedInvestments: [],
        nestWorth: [], nestWorthShift: [],
        cash: [], cashShift: [],
        yearToFIRE: null
    };
    if (!market) return;

    const minYear = new Date().getFullYear();
    let maxYear = 0;
    Object.keys(args).forEach((key) => {
        if (isNumber(key) && key > maxYear) {
            maxYear = key;
        }
    });
    let year = -1;
    
    let yearlyFees;
    let yearlyFeesAfterFIRE = getYearlyFees(-1 in args ? args[-1].spendings : args[maxYear].spendings);
    let income, incomeFrequency, increaseFrequency;
    let incomeLineIndex = 0;
    let incomeLinePeriodProgress = 0;
    let marketIgr;
    let marketIr;
    
    const goal = options.rule === '4%' ? 25 * (yearlyFeesAfterFIRE.normal + yearlyFeesAfterFIRE.deducible)
    : 25 * (yearlyFeesAfterFIRE.normal + yearlyFeesAfterFIRE.deducible);
    let goalIsReached = false;
    const period = options.period;
    while ((period && year + 1 < period) || !goalIsReached ) {
        year += 1;
        const financialProfile = fortuneGrowth.yearToFIRE === year-1 ? args[-1] : args[minYear+year];
        if (financialProfile) {
            yearlyFees = getYearlyFees(financialProfile.spendings);
            income = financialProfile.income;
            if (!income) break;

            incomeFrequency = financialProfile.incomeFrequency;
            increaseFrequency = financialProfile.increaseFrequency;
            if (financialProfile.resetIncome) {
                incomeLineIndex = 0;
                incomeLinePeriodProgress = 0;
            }
        }

        if (year in market) {
            marketIgr = Number(market[year].igr);
            marketIr = Number(market[year].ir);
        }

        const incomeLine = income[incomeLineIndex];
        const currentYearIncome = incomeLine.income*(incomeFrequency ? 12 : 1)
        + incomeLinePeriodProgress*incomeLine.increase*(increaseFrequency ? 12 : 1)

        incomeLinePeriodProgress += 1;
        if (incomeLinePeriodProgress === incomeLine.period) {
            incomeLineIndex += 1;
            incomeLinePeriodProgress = 0;
        }

        const lastYearCash = year > 0 ? fortuneGrowth.cash[year-1] : options.startingCash || 0;
        let lastYearNestWorth = (year > 0 ? fortuneGrowth.nestWorth[year-1] : options.startingCapital || 0);
        const dividends = lastYearNestWorth*marketIr/100;
        let remainingCash = getRemainingCash(currentYearIncome, dividends, yearlyFees);

        if (remainingCash < 0) {
            if (remainingCash + lastYearCash >= 0) {
                lastYearCash += remainingCash;
                remainingCash = 0;
            } else {
                remainingCash += lastYearCash;
                lastYearCash = 0;
                const financialHelp = Math.min(-remainingCash, lastYearNestWorth);
                remainingCash += financialHelp;
                lastYearNestWorth -= financialHelp;
            }
        }
        
        const percentageToInvest = options.percentageToInvest || 100;
        const maxAmountToInvest = options.maxAmountToInvest || -1;

        let amountToInvest = remainingCash * percentageToInvest / 100;
        if (maxAmountToInvest > 0 && amountToInvest > maxAmountToInvest) {
            amountToInvest = maxAmountToInvest;
        }

        if ('maxCash' in options && (amountToInvest < remainingCash + lastYearCash - options.maxCash)) {
            amountToInvest = remainingCash + lastYearCash - options.maxCash;
        }

        if ('minCash' in options && lastYearCash < options.minCash) {
            amountToInvest = remainingCash - (options.minCash - lastYearCash);
        }

        if (amountToInvest < 0) {
            amountToInvest = 0;
        }

        fortuneGrowth.investments.push(amountToInvest);
        fortuneGrowth.cumulatedInvestments.push(fortuneGrowth.cumulatedInvestments.at(year-1) || 0);
        fortuneGrowth.cumulatedInvestments[year] += amountToInvest;

        fortuneGrowth.nestWorth.push(amountToInvest);
        fortuneGrowth.nestWorth[year] += lastYearNestWorth*(1+marketIgr/100);
        fortuneGrowth.nestWorthShift.push(fortuneGrowth.nestWorth[year] - (year > 0 ? fortuneGrowth.nestWorth.at(year-1) : options.startingCapital));

        fortuneGrowth.cash.push(remainingCash - amountToInvest);
        fortuneGrowth.cash[year] += lastYearCash;
        fortuneGrowth.cashShift.push(fortuneGrowth.cash[year] - (year > 0 ? fortuneGrowth.cash.at(year-1) : options.startingCash))
        
        if (Math.round(fortuneGrowth.cash[year]) < 0) break;

        if (!goalIsReached) {
            goalIsReached = fortuneGrowth.nestWorth.at(-1) > goal;
            if (goalIsReached) {
                fortuneGrowth.yearToFIRE = year;
                yearlyFees = yearlyFeesAfterFIRE;
            }
        }
    }

    return fortuneGrowth;
}

const getYearlyFees = (spendings) => {
    const fees = { normal : 0, deducible : 0 };
    spendings.forEach(({ amount, frequency, isDeducible }) => {
        if (isDeducible) {
            fees.deducible += amount*frequency;
        } else {
            fees.normal += amount*frequency;
        }
    });

    return fees;
}

const getRemainingCash = (income, dividends, fees) => {
    const { normal, deducible } = fees;
    return income + dividends*0.7 - normal;
}
