const mongoose = require('mongoose');
const Joi = require('joi');
const genreSchema = require('./genres');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Movie:
 *        type: object
 *        required:
 *          - title
 *          - genre
 *          - numberInStock
 *          - dailyRentalRate
 *        properties:
 *          _id:
 *            type: string
 *            description: object ID in DB(set by mongoose).
 *          title:
 *            type: string
 *            minlength: 3
 *            maxlength: 255
 *            description: Movie title.
 *          genre:
 *            $ref: '#components/schemas/Genre'
 *          numberInStock:
 *            type: number
 *            min: 0
 *            maxlength: 255
 *            description: Number of movies in stock.
 *          dailyRentalRate:
 *            type: number
 *            min: 0
 *            maxlength: 255
 *            description: Rental rate of movie in Naira.
 *        example:
 *          _id: 2345654cdhhw345dnchd4583c
 *          title: Avenger
 *          genre: {
 *                    _id: 2345654cdhhw345dnchd4583c,
 *                    name: Thriller
 *                  }
 *          numberInStock: 20
 *          dailyRentalRate: 2
 */
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
        genreId: Joi.objectId().required(), //because client would send only the genre ID
        numberInStock: Joi.number().default(0).min(0),
        dailyRentalRate: Joi.number().default(0).min(0)
    };

    return Joi.validate(movie, schema);
}

exports.Movie = Movie;
exports.validate = validateMovie;