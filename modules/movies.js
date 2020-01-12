const mongoose = require('mongoose');
const Joi = require('joi');
const genreSchema = require('./genres');

const Movie = mongoose.model('Movie', new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 255
    },
    genre: {
        type: genreSchema,
        required: true
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0, //to prevent negative numbers
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0, //to prevent negative numbers
        max: 255
    }
}));

//Validate input
function validateMovie (movie){
    const schema = {
        title: Joi.string().required().min(3).max(50),
        genreId: Joi.obectId().required(), //because client would send only the genre ID
        numberInStock: Joi.number().default(0).min(0),
        dailyRentalRate: Joi.number().default(0).min(0)
    };

    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;