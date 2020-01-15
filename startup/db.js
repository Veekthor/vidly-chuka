const winston = require('winston');
const mongoose = require('mongoose');

module.exports = function (){
    mongoose.connect('mongodb://localhost/vidly')
    .then(()=> winston.info('Connected to MongoDB ....'));// use winston to log as info and universal error handler catches any error
}