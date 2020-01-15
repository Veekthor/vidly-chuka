const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');

module.exports = function(){//Handle Uncaught exception
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
}