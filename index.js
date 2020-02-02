const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/fawn')(); // fawn initialization
require('./startup/logging')();// dealing with error handling & winston
require('./startup/routes')(app); // handles routes (and) middleware
require('./startup/db')(); // connects to mongoDB
require('./startup/config')();
require('./startup/validation')(); // implement joi object id validation
require('./startup/prod')(app);

app.get('/', (req, res) => {
    res.redirect('/docs');
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>{winston.info(`Listening on port ${port}...`)});

module.exports = server;