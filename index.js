require('express-async-errors');
const winston = require('winston');
require('winston-mongodb');
const config = require('config');
const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const auth = require('./routes/auth');
const users = require('./routes/users');
const error = require('./middleware/error');
const express = require('express');
const app = express();

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


//middle ware
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/auth', auth);
app.use('/api/users', users);

//error middle ware
app.use(error);

app.get('/', (req, res) => {
    res.send("Hello world");
});

const port = process.env.PORT || 3000;
app.listen(port, () =>{console.log(`Listening on port ${port}...`)});