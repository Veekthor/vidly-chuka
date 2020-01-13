const jwt = require('jsonwebtoken');
const config = require('config');

//Custom middleware function
module.exports = function (req, res, next){ 
    const token = req.header('x-auth-token');// get token
    if (!token) return res.status(401).send('Access denied. Token not provided');// check if token was sent

    try{
    const decode = jwt.verify(token, config.get('jwtPrivateKey')); //verify/decode token
    req.user = decode;
    next(); //move handler to next middleware
    }
    catch(ex){
        res.send(400).send('Invalid token.');
    }
}