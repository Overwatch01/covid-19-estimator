// #region generateInfectionByRequestedTime
const generateInfectionByRequestedTime = (currentlyInfected, period, number) => {
  let daysFactors;
  if (period === 'days') {
    daysFactors = Math.trunc(number / 3);
  }
  if (period === 'weeks') {
    daysFactors = Math.trunc((number * 7) / 3);
  }
  if (period === 'months') {
    daysFactors = Math.trunc((number * 30) / 3);
  }
  const result = currentlyInfected * (2 ** daysFactors);
  return result;
};
// #endregion

// #region generateCasesByRequestedTime
const generateCasesByRequestedTime = (infectionsByRequestedTime) => {
  const result = Math.trunc((15 / 100) * infectionsByRequestedTime);
  return result;
};
// #endregion

// #region generateCasesForICUByRequestedTime
const generateCasesForICUByRequestedTime = (infectionsByRequestedTime) => {
  const result = Math.trunc((5 / 100) * infectionsByRequestedTime);
  return result;
};
// #endregion

// #region generateHospitalBedsByRequestedTime
const generateHospitalBedsByRequestedTime = (totalHospitalBeds, severeCasesByRequestedTime) => {
  const bedAvailability = (35 / 100) * totalHospitalBeds;
  const result = Math.trunc(bedAvailability - severeCasesByRequestedTime);
  return result;
};
// #endregion

// #region generateCasesForVentilatorsByRequestedTime
const generateCasesForVentilatorsByRequestedTime = (infectionsByRequestedTime) => {
  const result = Math.trunc((2 / 100) * infectionsByRequestedTime);
  return result;
};
// #endregion

// #region generateDollarsInFlight
const generateDollarsInFlight = (
  infectionsByRequestedTime,
  avgDailyIncomePopulation,
  avgDailyIncomeInUSD,
  period,
  number
) => {
  let daysFactors;

  if (period === 'days') {
    daysFactors = number;
  }
  if (period === 'weeks') {
    daysFactors = number * 7;
  }
  if (period === 'months') {
    daysFactors = number * 30;
  }

  const result = Math.trunc(
    (infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD * daysFactors)
  );
  return result;
};
// #endregion

// #region generateImpactEstimation
const generateImpactEstimation = (data) => {
  const currentlyInfected = data.reportedCases * 10;
  const infectionsByRequestedTime = generateInfectionByRequestedTime(
    currentlyInfected, data.periodType, data.timeToElapse
  );
  const severeCasesByRequestedTime = generateCasesByRequestedTime(infectionsByRequestedTime);
  const hospitalBedsByRequestedTime = generateHospitalBedsByRequestedTime(
    data.totalHospitalBeds, severeCasesByRequestedTime
  );
  const casesForICUByRequestedTime = generateCasesForICUByRequestedTime(infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTime = generateCasesForVentilatorsByRequestedTime(
    infectionsByRequestedTime
  );
  const dollarsInFlight = generateDollarsInFlight(
    infectionsByRequestedTime, data.region.avgDailyIncomePopulation,
    data.region.avgDailyIncomeInUSD, data.periodType, data.timeToElapse
  );
  const impact = {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
  return impact;
};
// #endregion

// #region generateSevereImpactEstimation
const generateSevereImpactEstimation = (data) => {
  const currentlyInfected = data.reportedCases * 50;
  const infectionsByRequestedTime = generateInfectionByRequestedTime(
    currentlyInfected, data.periodType, data.timeToElapse
  );
  const severeCasesByRequestedTime = generateCasesByRequestedTime(infectionsByRequestedTime);
  const hospitalBedsByRequestedTime = generateHospitalBedsByRequestedTime(
    data.totalHospitalBeds, severeCasesByRequestedTime
  );
  const casesForICUByRequestedTime = generateCasesForICUByRequestedTime(infectionsByRequestedTime);
  const casesForVentilatorsByRequestedTime = generateCasesForVentilatorsByRequestedTime(
    infectionsByRequestedTime
  );
  const dollarsInFlight = generateDollarsInFlight(
    infectionsByRequestedTime, data.region.avgDailyIncomePopulation,
    data.region.avgDailyIncomeInUSD, data.periodType, data.timeToElapse
  );
  const severeImpact = {
    currentlyInfected,
    infectionsByRequestedTime,
    severeCasesByRequestedTime,
    hospitalBedsByRequestedTime,
    casesForICUByRequestedTime,
    casesForVentilatorsByRequestedTime,
    dollarsInFlight
  };
  return severeImpact;
};
// #endregion

const covid19ImpactEstimator = (data) => {
  const impact = generateImpactEstimation(data);
  const severeImpact = generateSevereImpactEstimation(data);
  return {
    impact,
    severeImpact
  };
};

export default covid19ImpactEstimator;
