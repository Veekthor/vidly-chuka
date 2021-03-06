const winston = require('winston');
const config = require('config')
require('winston-mongodb');
require('express-async-errors');

module.exports = function(){
    //Handle Uncaught exception
    winston.handleExceptions(
        new winston.transports.Console({ colorize: true, prettyPrint: true}),
        new winston.transports.File({filename: 'uncaughtExceptions.log'}) //saves to file
    );
    //Handle Unhandled Promise Rejection and rethrow as exception
    process.on('unhandledRejection', (ex) =>{
        throw ex;
    });

    //configure winston to log to file
    winston.add(winston.transports.File, {filename: 'logfile.log'});
    // configure winston to log to MongoDB
    winston.add(winston.transports.MongoDB, { 
        db: config.get('db'),
        level: 'error'
    });
}