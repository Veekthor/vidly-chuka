const config = require('config');

module.exports = function () {
    //checks if jwtPrivateKey & db connection string are set 
    if(!config.get('jwtPrivateKey')){
        throw new Error('FATAL ERROR: Jwt private key not set');
    }

    if(!config.get('db')){
        throw new Error('FATAL ERROR: DB connection string not set');
    }
}