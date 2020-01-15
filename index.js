require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const express = require('express');
const app = express();

require('./startup/routes')(app); // handles routes (and) middleware
//Handle Uncaught exception
winston.handleExceptions(
    new winston.transports.File({filename: 'uncaughtExceptions.log'}),
    new winston.transports.MongoDB({ 
        db: 'mongodb://localhost/vidly',
        level: 'error'
    })
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

//connect to Mongo DB
mongoose.connect('mongodb://localhost/vidly')
            .then(()=> console.log('Connected to MongoDB ....'))
                .catch((err) => console.log('Error', err));

app.get('/', (req, res) => {
    res.send("Hello world");
});

const port = process.env.PORT || 3000;
app.listen(port, () =>{console.log(`Listening on port ${port}...`)});