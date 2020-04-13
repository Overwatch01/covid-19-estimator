const covid19ImpactEstimator = (response) => {
    const impact = generateImpactEstimation(response.data)
    const severeImpact = generateSevereImpactEstimation(response.data)

    return {
        impact: impact,
        severeImpact: severeImpact
    }
};

const generateImpactEstimation = (data) => {
    const currentlyInfected = data.reportedCases * 10;
    const infectionsByRequestedTime = generateInfectionByRequestedTime(currentlyInfected, data.periodType, data.timeToElapse);
    const severeCasesByRequestedTime = generateCasesByRequestedTime(infectionsByRequestedTime);
    const casesForICUByRequestedTime = generateCasesForICUByRequestedTime(infectionsByRequestedTime);
    const casesForVentilatorsByRequestedTime = generateCasesForVentilatorsByRequestedTime(infectionsByRequestedTime);
    const dollarsInFlight = generateDollarsInFlight(infectionsByRequestedTime, data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, data.periodType, data.timeToElapse);

    const impact = {
        currentlyInfected: currentlyInfected,
        infectionsByRequestedTime: infectionsByRequestedTime,
        severeCasesByRequestedTime: severeCasesByRequestedTime,
        hospitalBedsByRequestedTime: null,
        casesForICUByRequestedTime: casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTime,
        dollarsInFlight: dollarsInFlight

    }
    return impact
}

const generateSevereImpactEstimation = (data) => {
    const currentlyInfected = data.reportedCases * 50;
    const infectionsByRequestedTime = generateInfectionByRequestedTime(currentlyInfected, data.periodType, data.timeToElapse);
    const severeCasesByRequestedTime = generateCasesByRequestedTime(infectionsByRequestedTime);
    const casesForICUByRequestedTime = generateCasesForICUByRequestedTime(infectionsByRequestedTime);
    const casesForVentilatorsByRequestedTime = generateCasesForVentilatorsByRequestedTime(infectionsByRequestedTime);
    const dollarsInFlight = generateDollarsInFlight(infectionsByRequestedTime, data.region.avgDailyIncomePopulation, data.region.avgDailyIncomeInUSD, data.periodType, data.timeToElapse);


    const severeImpact = {
        currentlyInfected: currentlyInfected,
        infectionsByRequestedTime: infectionsByRequestedTime,
        severeCasesByRequestedTime: severeCasesByRequestedTime,
        hospitalBedsByRequestedTime: null,
        casesForICUByRequestedTime: casesForICUByRequestedTime,
        casesForVentilatorsByRequestedTime: casesForVentilatorsByRequestedTime,
        dollarsInFlight: dollarsInFlight
    }
    return severeImpact
}

//#region generateInfectionByRequestedTime
const generateInfectionByRequestedTime = (currentlyInfected, period, number) => {
    let daysFactors;

    if (period == 'days') {
        daysFactors = Math.trunc(number / 3);
    }
    if (period == 'weeks') {
        daysFactors = Math.trunc((number * 7) / 3);
    }
    if (period == 'months') {
        daysFactors = Math.trunc((number * 30) / 3);
    }
    const result = currentlyInfected * (2 ** daysFactors)
    return result
}
//#endregion

//#region generateCasesByRequestedTime
const generateCasesByRequestedTime = (infectionsByRequestedTime) => {
    const result = Math.trunc((15 / 100) * infectionsByRequestedTime)
    return result
}
//#endregion

//#region generateCasesForICUByRequestedTime
const generateCasesForICUByRequestedTime = (infectionsByRequestedTime) => {
    const result = Math.trunc((5 / 100) * infectionsByRequestedTime)
    return result
}
//#endregion

//#region generateCasesForVentilatorsByRequestedTime
const generateCasesForVentilatorsByRequestedTime = (infectionsByRequestedTime) => {
    const result = Math.trunc((2 / 100) * infectionsByRequestedTime)
    return result
}
//#endregion

//#region generateDollarsInFlight
const generateDollarsInFlight = (infectionsByRequestedTime, avgDailyIncomePopulation, avgDailyIncomeInUSD, period, number) => {
    let daysFactors;

    if (period == 'days') {
        daysFactors = number;
    }
    if (period == 'weeks') {
        daysFactors = number * 7;
    }
    if (period == 'months') {
        daysFactors = number * 30;
    }

    const result = Math.trunc((infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD * daysFactors))
    return result
}
//#endregion

export default covid19ImpactEstimator;
