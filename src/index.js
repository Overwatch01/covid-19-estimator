import express from 'express';
import bodyParser from 'body-parser';
import covid19ImpactEstimator from './estimator';

// Set up the express app
const app = express();

// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
    console.log('Hello World')
    res.send(JSON.stringify({ Hello: 'World'}));
   });

// get all todos
app.post('/api/v1/on-covid-19', (req, res) => {
    const result = covid19ImpactEstimator(req.body)
    res.status(200).send({
        success: 'true',
        message: 'todos retrieved',
        request: result
    })
});
const PORT = process.env.PORT || 1337;;

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`)
});