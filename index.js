require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const express = require('express');
const app = express();

require('./startup/routes')(app); // handles routes (and) middleware
require('./startup/db')(); // connects to mongoDB
//Handle Uncaught exception
winston.handleExceptions(
    new winston.transports.File({filename: 'uncaughtExceptions.log'})
);
//Handle Unhandled Promise Rejection
process.on('unhandledRejection', (ex) =>{
    throw ex;
});

//configure winston to log to file
winston.add(winston.transports.File, {filename: 'logfile.log'});
//configure winston to log to MongoDB
winston.add(winston.transports.MongoDB, { 
    db: 'mongodb://localhost/vidly',
    level: 'error'
});

if(!config.get('jwtPrivateKey')){
    console.log('FATAL ERROR: Jwt private key not set');
    process.exit(1);
}

app.get('/', (req, res) => {
    res.send("Hello world");
});

const port = process.env.PORT || 3000;
app.listen(port, () =>{console.log(`Listening on port ${port}...`)});