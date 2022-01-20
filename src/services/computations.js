
module.exports = {

    whenCanIFIRE : (args) => {
        const { annualIncome, annualSpendings, igr, ir, reinvestDividends } = args;
        let yearsToRetire = 0;
        const targetFortune = 25*Number(annualSpendings);
        const annualBenefits = Number(annualIncome) - Number(annualSpendings);
        let currentFortune = 0;
        let dividends = 0;

        while (currentFortune < targetFortune) {
            yearsToRetire += 1;
            currentFortune += annualBenefits;
            if (reinvestDividends) {
                currentFortune += dividends;
            }
            currentFortune *= 1 + Number(igr)/100;
            dividends = currentFortune * Number(ir) / 100;
            console.log(yearsToRetire, parseInt(currentFortune), parseInt(dividends), igr, ir)
        }

        return yearsToRetire;
    }
}