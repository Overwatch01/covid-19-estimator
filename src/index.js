import express from 'express';
import bodyParser from 'body-parser';
import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';
import covid19ImpactEstimator from './estimator';

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();
const fs = require('fs');

// XML Parser configurations, https://github.com/Leonidas-from-XIV/node-xml2js#options
const xmlOptions = {
  charkey: 'value',
  trim: false,
  explicitRoot: false,
  explicitArray: false,
  normalizeTags: false,
  mergeAttrs: true
};

// XML Builder configuration, https://github.com/Leonidas-from-XIV/node-xml2js#options-for-the-builder-class.
const builder = new xml.Builder({
  renderOpts: { pretty: false }
});

// Variables
let requestUrl;
let httpAction;
let logMessage;
let initialLog = true;
const fileName = 'logfile.txt';

// #region addToLog
const addToLog = (text) => {
  if (initialLog) {
    fs.writeFile(fileName, text, (err) => {
      if (err) throw err;
      initialLog = false;
    });
  } else {
    fs.appendFile(fileName, `\n${text}`, (err) => {
      if (err) throw err;
    });
  }
};
// #endregion

// #region /api/v1/on-covid-19
app.post('/api/v1/on-covid-19', xmlparser(xmlOptions), (req, res) => {
  const startHrTime = process.hrtime();
  const reqParams = req.query;
  const result = covid19ImpactEstimator(req.body);

  if (reqParams.hasXML) {
    res.set('Content-Type', 'application/xml');
    res.status(200).send(
      builder.buildObject({
        'COVID-ESTIMATOR': {
          data: req.body,
          impact: result.impact,
          severeImpact: result.severeImpact
        }
      })
    );
  } else if (reqParams.hasJson) {
    res.status(200).send({
      data: req.body,
      impact: result.impact,
      severeImpact: result.severeImpact
    });
  } else {
    httpAction = 'POST';
    requestUrl = '/api/v1/on-covid-19';
    res.status(200).send({
      data: req.body,
      impact: result.impact,
      severeImpact: result.severeImpact
    });
  }
  const elapsedHrTime = process.hrtime(startHrTime);
  const elapsedTimeInMs = Math.trunc((elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6));
  logMessage = `${httpAction} \t\t ${requestUrl} \t\t${200} \t\t ${elapsedTimeInMs}0ms`;
  addToLog(logMessage);
});
// #endregion

// #region /api/v1/on-covid-19/xml
app.post('/api/v1/on-covid-19/xml', (req, res) => {
  httpAction = 'POST';
  requestUrl = '/api/v1/on-covid-19/xml';
  res.redirect(307, '/api/v1/on-covid-19?hasXML=true');
});
// #endregion

// #region /api/v1/on-covid-19/json
app.post('/api/v1/on-covid-19/json', (req, res) => {
  httpAction = 'POST';
  requestUrl = '/api/v1/on-covid-19/json';
  res.redirect(307, '/api/v1/on-covid-19?hasJson=true');
});
// #endregion

// #region /api/v1/on-covid-19/logs
app.get('/api/v1/on-covid-19/logs', (req, res) => {
  httpAction = 'GET';
  requestUrl = '/api/v1/on-covid-19/logs';
  const startHrTime = process.hrtime();
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) throw err;
    res.set('Content-Type', 'text/plain');
    res.status(200).send(data);
  });
  const elapsedHrTime = process.hrtime(startHrTime);
  const elapsedTimeInMs = Math.trunc((elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6));
  logMessage = `${httpAction} \t\t ${requestUrl} \t\t${200} \t\t ${elapsedTimeInMs}0ms`;
  addToLog(logMessage);
});
// #endregion

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
