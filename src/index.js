import express from 'express';
import bodyParser from 'body-parser';

import covid19ImpactEstimator from './estimator';

import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';

require('dotenv').config()

const log = require('simple-node-logger').createSimpleFileLogger('project.log');

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


// XML Parser configurations, https://github.com/Leonidas-from-XIV/node-xml2js#options
const xmlOptions = {
    charkey: 'value',
    trim: false,
    explicitRoot: false,
    explicitArray: false,
    normalizeTags: false,
    mergeAttrs: true,
};

// XML Builder configuration, https://github.com/Leonidas-from-XIV/node-xml2js#options-for-the-builder-class.
const builder = new xml.Builder({
    renderOpts: { 'pretty': false }
});

app.get('/', function (req, res) {
    console.log('Hello World')
    res.send(JSON.stringify({ Hello: 'World' }));
});

// get all todos
app.post('/api/v1/on-covid-19', xmlparser(xmlOptions), (req, res) => {
    const startHrTime = process.hrtime();
    const reqParams = req.query;
    const result = covid19ImpactEstimator(req.body);
    let requestTitle;

    if (reqParams.hasXML) {
        res.set('Content-Type', 'application/xml');
        res.status(200).send(
            builder.buildObject({ ['COVID-ESTIMATOR']: {
                data: req.body.data,
                impact: result.impact,
                severeImpact: result.severeImpact
            }})
        );
    } else {
        res.status(200).send({
            data: req.body.data,
            impact: result.impact,
            severeImpact: result.severeImpact
        })
    }

    if (reqParams.title == "xml") {
        requestTitle = "on-covid-19/xml"
    } else if (reqParams.title == "json") {
        requestTitle = "on-covid-19/json"
    } else {
        requestTitle = "on-covid-19"
    }
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6).toFixed(2);
    log.info(`${Date.now()} \t\t${requestTitle}  \t\t\t\tdone in ${elapsedTimeInMs} miliseconds`);
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
    res.redirect(307, '/api/v1/on-covid-19?title=xml&hasXML=true');
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
    res.redirect(307, '/api/v1/on-covid-19?title=json');
});

app.get('/api/v1/on-covid-19/logs', function (req, res) {
    var fs = require('fs');

    fs.readFile('project.log', 'utf8', function(err, data) {
        if (err) throw err;
        res.status(200).send(data)
    });
});

const PORT = process.env.PORT || 1337;;

app.listen(PORT, () => {
    console.log(process.env.BACKEND)
    console.log(`server running on port ${PORT}`)
});