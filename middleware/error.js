const winston = require('winston');
module.exports = (err, req, res, next)=>{
    //Log exception
    winston.error(err.message, err);
    res.status(500).send('Something failed');
};