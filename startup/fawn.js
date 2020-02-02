const mongoose = require('mongoose');
const Fawn = require('fawn');
    
module.exports = () =>{
    Fawn.init(mongoose);
}