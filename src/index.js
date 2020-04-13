import express from 'express';
import bodyParser from 'body-parser';
import covid19ImpactEstimator from './estimator';

import xmlparser from 'express-xml-bodyparser';
import xml from 'xml2js';
require('dotenv').config()

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
    const reqParams = req.query;
    const result = covid19ImpactEstimator(req.body)

    if (reqParams.hasXML) {
        res.set('Content-Type', 'application/xml');
        res.status(200).send(
            builder.buildObject({ ['COVID-ESTIMATOR']: result })
        );
    } else {
        res.status(200).send({
            success: 'true',
            message: 'todos retrieved',
            request: result
        })
    }
});

app.post('/api/v1/on-covid-19/xml', (req, res) => {
    res.redirect(307, '/api/v1/on-covid-19?hasXML=true');
});

app.post('/api/v1/on-covid-19/json', (req, res) => {
    res.redirect(307, '/api/v1/on-covid-19');
});

const PORT = process.env.PORT || 1337;;

app.listen(PORT, () => {
    console.log(process.env.BACKEND)
    console.log(`server running on port ${PORT}`)
});