
module.exports = {

    whenCanIFIRE : (args) => {
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
}