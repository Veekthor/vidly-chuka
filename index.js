const winston = require('winston');
const express = require('express');
const app = express();

require('./startup/logging')();// dealing with error handling & winston
require('./startup/routes')(app); // handles routes (and) middleware
require('./startup/db')(); // connects to mongoDB
require('./startup/config')();
require('./startup/validation')();

app.get('/', (req, res) => {
    res.send("Hello world");
});

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>{winston.info(`Listening on port ${port}...`)});

module.exports = server;