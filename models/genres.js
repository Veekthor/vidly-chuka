const mongoose = require('mongoose');
const Joi = require('joi');
/**
 * @swagger
 *  components:
 *    schemas:
 *      Genre:
 *        type: object
 *        required:
 *          - name
 *        properties:
 *          name:
 *            type: string
 *            minlength: 5
 *            maxlength: 50
 *            description: Name of genre.
 *        example:
 *          name: Thriller
 */
const genreSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
    }
});

const Genre = mongoose.model('Genre', genreSchema);

//Validate input
function validateGenre (genre){
    const schema = {
        name: Joi.string().min(5).max(50).required()
    };

    return Joi.validate(genre, schema);
}

exports.Genre = Genre;
exports.genreSchema = genreSchema;
exports.validate = validateGenre;