const mongoose = require('mongoose');
const Joi = require('joi');

const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    }
});

const Genre = mongoose.model('Genre', genreSchema);

//Validate input
function validateGenre (genre){
    const schema = {
        name: Joi.string().required()
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;