const Joi = require('joi');
const moment = require('moment');
const mongoose = require('mongoose');

/**
 * @swagger
 *  components:
 *    schemas:
 *      Rental:
 *        type: object
 *        required:
 *          - customer
 *          - movie
 *        properties:
 *          _id:
 *            type: string
 *            description: object ID in DB(set by mongoose).
 *          customer:
 *            $ref: '#components/schemas/Customer'
 *          movie:
 *            type: object
 *            required:
 *              - title
 *              - dailyRentalRate
 *            properties:
 *              title:
 *                type: string
 *                minlength: 3
 *                maxlength: 255
 *                description: Movie title.
 *              dailyRentalRate:
 *                type: number
 *                min: 0
 *                maxlength: 255
 *                description: Rental rate of movie in Naira.
 *            example:
 *              title: Avenger
 *              dailyRentalRate: 2
 *          dateOut:
 *            type: string
 *            format: date-time
 *            description: Date rental is made, set by server.
 *          dateReturned:
 *            type: string
 *            format: date-time
 *            description: Date rental is returned, set by server.
 *          rentalFee:
 *            type: number
 *            min: 0
 *            description: Rental fee(In Naira), set by server.
 *        example:
 *          _id: 2345654cdhhw345dnchd4583c
 *          customer: {
 *                      _id: 2345654cdhhw345dnchd4583c,
 *                      name: John Doe,
 *                      isGold: true,
 *                      phone: +12345678}
 *          movie: {
 *                  _id: 2345654cdhhw345dnchd4583c,
 *                  title: Avengers,
 *                  dailyRentalRate: 2}
 *          dateOut: 2020-01-11T22:14:13.724Z
 *          dateReturned: 2020-01-11T22:14:13.724Z
 *          rentalFee: 200
 */

const rentalSchema = new mongoose.Schema({
    customer: {
        type: new mongoose.Schema({
            name: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            isGold: {
                type: Boolean,
                default: false
            },
            phone: {
                type: String,
                required: true,
                minlength: 5,
                maxlength: 50
            }
        }),
        required: true
    },
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                trim: true,
                required: true,
                minlength: 5,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255     
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now
    },
    dateReturned: Date,
    rentalFee: {
        type: Number,
        min: 0
    }
});
//Add (static) method to user schema to find rental with customer and movie combination
rentalSchema.statics.lookup = function(customerId, movieId){
    return this.findOne({
        'customer._id': customerId, 
        'movie._id': movieId 
    });
};

rentalSchema.methods.return = function(){
    this.dateReturned = new Date(); //set return date

    const diffDays = moment().diff(this.dateOut, 'days'); //calculate the days difference
    this.rentalFee = diffDays * this.movie.dailyRentalRate;
};
const Rental = mongoose.model('Rental', rentalSchema);

function validateRental(rental){
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    };

    return Joi.validate(rental, schema);
}

exports.Rental = Rental;
exports.validate = validateRental; 