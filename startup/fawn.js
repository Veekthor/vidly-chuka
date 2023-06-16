const Fawn = require('fawn');
const config = require('config');

module.exports = () =>{
    const db = config.get('db');
    Fawn.init(db);
}