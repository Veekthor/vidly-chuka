const genres = require('../routes/genres');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const auth = require('../routes/auth');
const users = require('../routes/users');
const returns = require('../routes/returns');
const swagger = require('./swagger');
const error = require('../middleware/error');
const express = require('express');

module.exports = function(app){
    //middle ware
    app.use(express.json()); // allows json inputs
    app.use(express.urlencoded({ extended: true })); // allows url-encoded inputs
    app.use('/api/genres', genres);
    app.use('/api/customers', customers);
    app.use('/api/movies', movies);
    app.use('/api/rentals', rentals);
    app.use('/api/auth', auth);
    app.use('/api/users', users);
    app.use('/api/returns', returns);
    app.use('/docs', swagger);

    //error middle ware
    app.use(error);
}